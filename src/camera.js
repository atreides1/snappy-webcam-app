import { React, Component } from 'react';
import { Redirect } from "react-router-dom";
// import axios from 'axios';
import { Button, Form } from 'react-bootstrap';

class Camera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            width: window.innerWidth,
            height: window.innerHeight,
            userInput: false,
            // image properties used for cropping handles
            image: null,
            imageX: 0,
            imageY: 0,
            imageWidth: 0,
            imageHeight: 0,
            redirect: null,
        };

        this.canvas = null; //used for fabric.js

        this.xOffset = 0; //used for cropping
        this.yOffset = 0;
        this.active = false
        this.activeItem = null;
        this.cropAspectRatio = null;

        this.loadStream = this.loadStream.bind(this);
        this.stopStream = this.stopStream.bind(this);
        this.takePhoto = this.takePhoto.bind(this);
        this.reload = this.reload.bind(this);
        this.save = this.save.bind(this);
        this.upload = this.upload.bind(this);
        this.crop = this.crop.bind(this);
    }

    componentDidMount() {
        // get ID of user from query string
        let userID = this.props.location.search.substring(3)
        this.setState({ user: userID });
        this.loadStream();
        //maybe add a resize listener
        window.addEventListener("resize", this.resize, false);
    }

    componentWillUnmount() {
        this.stopStream();
        window.addEventListener("resize", this.resize);
    }

    resize = () => {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        if (document.querySelector("canvas")) {
            // resize canvas
            let canvas = document.querySelector("canvas");
            let context = canvas.getContext("2d");

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // resize content
            let image = this.state.image;
            if (image) {
                console.log("adding image again");
                let aspectRatio;
                if (image.id === "video") {
                    aspectRatio = this.state.imageWidth / this.state.imageHeight;
                    console.log("ratio", aspectRatio)
                } else {
                    aspectRatio = image.width / image.height;
                }
                let newWidth = canvas.width;
                let newHeight = newWidth / aspectRatio;
                if (newHeight > canvas.height) {
                    newHeight = canvas.height;
                    newWidth = newHeight * aspectRatio;
                }

                context.drawImage(image, canvas.width / 2 - newWidth / 2, 0, newWidth, newHeight);
                this.setState({
                    imageX: canvas.width / 2 - newWidth / 2,
                    imageY: 0,
                    imageWidth: newWidth,
                    imageHeight: newHeight,
                })
            }
        }
        console.log(window.innerWidth, window.innerHeight)
    }

    loadStream() {
        let constraints = { audio: false, video: { width: this.state.width, height: this.state.height, facingMode: 'environment' } };
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function (mediaStream) {
                let video = document.querySelector("video");
                video.srcObject = mediaStream;
                video.onloadedmetadata = function (e) {
                    video.play();
                };
            })
            .catch(function (err) {
                console.log(err.name + ": " + err.message);
            });
    }

    stopStream() {
        // close the video stream
        let video = document.getElementById("video");
        if (video === null || video.srcObject === null) {
            return
        }
        let stream = video.srcObject;
        let tracks = stream.getTracks();

        for (let i = 0; i < tracks.length; i++) {
            let track = tracks[i];
            track.stop();
        }
        video.srcObject = null;
    }

    takePhoto() {
        let w = this.state.width;
        let h = this.state.height;
        let video = document.querySelector("video");
        let canvas = document.querySelector("canvas");
        let context = canvas.getContext('2d');

        canvas.style.display = "block";
        canvas.width = w;
        canvas.height = h;

        // this maintains the aspect ratio
        let aspectRatio = video.videoWidth / video.videoHeight;
        let newWidth = canvas.width;
        let newHeight = newWidth / aspectRatio;
        if (newHeight > canvas.height) {
            newHeight = canvas.height;
            newWidth = newHeight * aspectRatio;
        }
        let x = canvas.width / 2 - newWidth / 2;
        let y = 0;
        context.drawImage(video, x, y, newWidth, newHeight);
        // save the frame for resizing purposes
        let frame = document.createElement("canvas");
        frame.width = newWidth;
        frame.height = newHeight;
        let frameContext = frame.getContext("2d");
        frameContext.drawImage(canvas, x, y, newWidth, newHeight, 0, 0, newWidth, newHeight);

        let img = new Image();
        img.src = frame.toDataURL();
        this.setState({
            image: img,
            imageX: x,
            imageY: y,
            imageWidth: newWidth,
            imageHeight: newHeight,
        })
        video.style.display = "none";
        this.stopStream();
        canvas.style.setProperty("position", "static")
        this.setState({ userInput: true });
    }

    reload() {
        let video = document.querySelector("video");
        let canvas = document.querySelector("canvas");
        video.style.display = "block";
        canvas.style.display = "none";
        if (this.canvas !== null) {
            this.canvas.dispose();
        }
        this.cropAspectRatio = null;
        this.loadStream();
        this.setState({
            userInput: false,
            image: null,
        })

    }

    save(event) {
        event.preventDefault();
        let canvas = document.getElementById("canvas");
        // let context = canvas.getContext("2d");
        // check size of crop window overlay
        let overlay = document.getElementById("imageOverlay").getBoundingClientRect();
        let x = overlay.left;
        let y = overlay.top;
        let width = Math.round(overlay.width);
        let height = Math.round(overlay.height);
        console.log(width, height, this.state.imageWidth, this.state.imageHeight)
        console.log(width !== this.state.imageWidth);
        console.log(height !== this.state.imageHeight)
        // if the crop handles have been changed, make sure to save that!
        if (width !== this.state.imageWidth || height !== this.state.imageHeight) {
            console.log("not the same")
            let tempCanvas = document.createElement("canvas");
            let tempContext = tempCanvas.getContext("2d")
            tempCanvas.width = width;
            tempCanvas.height = height;
            // save from src canvas to temp
            tempContext.drawImage(canvas, x, y, width, height, 0, 0, width, height);

            // let name = Date.now().toString();
            let image = tempCanvas.toDataURL('image/jpeg', 0.8);
            localStorage.setItem("photo", image);
            // let data = {
            //     user: this.state.user,
            //     name: name,
            //     imageSrc: image,
            //     canvas: null,
            //     objProps: null
            // }
            // axios.post(process.env.REACT_APP_WEBSOCKET_SERVER + '/save', data)
            //     .then(() => console.log("Image saved to database"))
            //     .catch(err => {
            //         console.error(err);
            //     })

            this.stopStream(); //this removes video stream
            this.setState({ redirect: "/editor" })

        } else {
            console.log("no changes to crop handles")
            // save data to server
            // make temp canvas the same size as image
            let tempCanvas = document.createElement("canvas");
            let tempContext = tempCanvas.getContext("2d")
            tempCanvas.width = this.state.imageWidth;
            tempCanvas.height = this.state.imageHeight;

            tempContext.drawImage(canvas, this.state.imageX, this.state.imageY, this.state.imageWidth, this.state.imageHeight, 0, 0, this.state.imageWidth, this.state.imageHeight);
            // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            // let name = Date.now().toString();
            let image = tempCanvas.toDataURL('image/jpeg', 0.8);
            localStorage.setItem("photo", image);
            // let data = {
            //     user: this.state.user,
            //     name: name,
            //     imageSrc: image,
            //     canvas: null,
            //     objProps: null
            // }
            // axios.post(process.env.REACT_APP_WEBSOCKET_SERVER + '/save', data)
            //     .then(() => console.log("Image saved to database"))
            //     .catch(err => {
            //         console.error(err);
            //     })

            this.stopStream(); //this removes video stream
            this.setState({ redirect: "/editor" })
        }
    }

    upload() {
        let w = this.state.width;
        let h = this.state.height;
        let input = document.getElementById("cameraInput");
        let video = document.querySelector("video");
        let canvas = document.querySelector("canvas");
        let context = canvas.getContext('2d')

        canvas.style.display = "block";
        canvas.width = w;
        canvas.height = h;

        this.stopStream();
        video.style.display = "none";
        this.setState({ userInput: true })
        //file reading setup
        const currentFile = input.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const image = document.createElement('img');
            image.onload = () => {

                let aspectRatio = image.width / image.height;
                let newWidth = canvas.width;
                let newHeight = newWidth / aspectRatio;
                if (newHeight > canvas.height) {
                    newHeight = canvas.height;
                    newWidth = newHeight * aspectRatio;
                }
                let x = canvas.width / 2 - newWidth / 2;
                let y = 0;
                context.drawImage(image, x, y, newWidth, newHeight);

                this.setState({
                    image: image,
                    imageX: x, //x,//canvas.width / 2 - newWidth / 2,
                    imageY: y, //y, //0,
                    imageWidth: Math.round(newWidth),
                    imageHeight: Math.round(newHeight),
                })
            }
            image.src = reader.result;

        }, true);

        if (currentFile) {
            reader.readAsDataURL(currentFile);
        }
    }

    crop() {
        console.log("crop")
        let canvas = document.getElementById("canvas");
        let context = canvas.getContext("2d");
        // get position of cropping handles
        let tl = document.getElementById("tl").getBoundingClientRect();
        let tr = document.getElementById("tr").getBoundingClientRect();
        let bl = document.getElementById("bl").getBoundingClientRect();
        //set x, y, width and height
        let x = tl.left;
        let y = tl.top;
        let width = tr.left - tl.left + 20;
        let height = bl.top - tl.top + 20;
        //create image of current canvas
        let image = document.createElement("img");
        image.src = canvas.toDataURL();
        image.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            //draw lines for cropping handles
            let aspectRatio = width / height;
            let newWidth = canvas.width;
            let newHeight = newWidth / aspectRatio;
            if (newHeight > canvas.height) {
                newHeight = canvas.height;
                newWidth = newHeight * aspectRatio;
            }
            // save cropped image to canvas
            context.drawImage(image, x, y, width, height, canvas.width / 2 - newWidth / 2, 0, newWidth, newHeight);

            // "reset" cropping handles
            this.setState({
                image: image,
                imageX: canvas.width / 2 - newWidth / 2,
                imageY: 0,
                imageWidth: Math.round(newWidth),
                imageHeight: Math.round(newHeight),
            })

            let tl = document.getElementById("tl");
            let tr = document.getElementById("tr");
            let bl = document.getElementById("bl");
            let br = document.getElementById("br");
            let overlay = document.getElementById("imageOverlay");

            tl.style.transform = "none";
            tr.style.transform = "none";
            bl.style.transform = "none";
            br.style.transform = "none";
            overlay.style.transform = "none";

            tl.style.left = `${canvas.width / 2 - newWidth / 2}px`
            tl.style.top = `${0}px`

            tr.style.left = `${(canvas.width / 2 - newWidth / 2) + newWidth - 20}px`
            tr.style.top = `${0}px`

            bl.style.left = `${canvas.width / 2 - newWidth / 2}px`
            bl.style.top = `${newHeight - 20}px`

            br.style.left = `${(canvas.width / 2 - newWidth / 2) + newWidth - 20}px`
            br.style.top = `${newHeight - 20}px`;

            overlay.style.left = `${canvas.width / 2 - newWidth / 2}px`
            overlay.style.top = `${0}px`
            overlay.style.width = `${newWidth}px`
            overlay.style.height = `${newHeight}px`;
        }
    }

    cropToAspect = (aspectRatio) => {
        // let canvas = document.getElementById("canvas");
        // find width and height of image at aspect ratio
        let imageWidth = this.state.imageWidth;
        let imageHeight = this.state.imageHeight;
        let w = imageWidth;
        let h = imageHeight;
        let imageAspectRatio = imageWidth / imageHeight;

        if (imageAspectRatio > aspectRatio) {
            w = imageWidth * aspectRatio
            //set this.cropAspectRatio to val
            w = w / 2
            this.cropAspectRatio = aspectRatio;
        } else if (imageAspectRatio < aspectRatio) {
            h = imageWidth / aspectRatio;
            //set this.cropAspectRatio to val
            this.cropAspectRatio = aspectRatio;
        }

        // set cropping handles and overlay position
        let tl = document.getElementById("tl");
        let tr = document.getElementById("tr");
        let bl = document.getElementById("bl");
        let br = document.getElementById("br");
        let overlay = document.getElementById("imageOverlay");

        // clear any prior transformations
        overlay.style.transform = "unset";

        tl.style.left = `${this.state.imageX}px`
        tl.style.top = `${this.state.imageY}px`

        tr.style.left = `${this.state.imageX + w - 20}px`
        tr.style.top = `${this.state.imageY}px`

        bl.style.left = `${this.state.imageX}px`
        bl.style.top = `${this.state.imageY + h - 20}px`

        br.style.left = `${this.state.imageX + w - 20}px`
        br.style.top = `${this.state.imageY + h - 20}px`;

        overlay.style.left = `${this.state.imageX}px`
        overlay.style.top = `${this.state.imageY}px`
        overlay.style.width = `${w}px`
        overlay.style.height = `${h}px`;
        //this affects the "move" func for crop handles,
        //it creates a set translate, maintaing the aspect ratio
    }

    // funcs for cropping
    setTranslate = (x, y, handle) => {
        handle.style.left = `${x}px`
        handle.style.top = `${y}px`
        let tl = document.getElementById("tl")
        let tr = document.getElementById("tr")
        let br = document.getElementById("br")
        let bl = document.getElementById("bl")

        if (handle.id === "tl") {
            bl.style.left = `${x}px`;
            tr.style.top = `${y}px`;
        }
        if (handle.id === "tr") {
            br.style.left = `${x}px`;
            tl.style.top = `${y}px`;

        }
        if (handle.id === "br") {
            tr.style.left = `${x}px`
            bl.style.top = `${y}px`
        }
        if (handle.id === "bl") {
            tl.style.left = `${x}px`;
            br.style.top = `${y}px`;
        }
        // // set overlay
        let overlay = document.getElementById("imageOverlay");
        let curr_tl = document.getElementById("tl").getBoundingClientRect();
        let curr_br = document.getElementById("br").getBoundingClientRect();
        let width = curr_br.left - curr_tl.left + 20;
        let height = curr_br.top - curr_tl.top + 20;

        overlay.style.left = `${curr_tl.left}px`;
        overlay.style.top = `${curr_tl.top}px`;
        overlay.style.width = `${width}px`
        overlay.style.height = `${height}px`
    }

    translateWithAspectRatio = (x, y, handle) => {
        // gets weird if opposite handles are moved
        let tl = document.getElementById("tl")
        let tr = document.getElementById("tr")
        let br = document.getElementById("br")
        let bl = document.getElementById("bl")
        let overlay = document.getElementById("imageOverlay");
        let aspectRatio = this.cropAspectRatio
        // keep width and height of aspect ratio
        // (find "ideal" x and y)
        handle.style.left = `${x}px`;

        if (handle.id === "tl") {
            bl.style.left = `${x}px`;
        }
        if (handle.id === "tr") {
            br.style.left = `${x}px`;
        }
        if (handle.id === "br") {
            tr.style.left = `${x}px`
        }
        if (handle.id === "bl") {
            tl.style.left = `${x}px`;
        }
        // calc width and height
        let curr_tl = document.getElementById("tl").getBoundingClientRect();
        let curr_br = document.getElementById("br").getBoundingClientRect();
        let width = curr_br.left - curr_tl.left + 20;
        let height = width / aspectRatio;

        y = curr_br.top - height + 20;
        if (handle.id === "tl") {
            tl.style.top = `${y}px`;
            tr.style.top = `${y}px`;
        }
        if (handle.id === "tr") {
            tr.style.top = `${y}px`;
            tl.style.top = `${y}px`;
        }
        y = height - 20;
        console.log(y)
        if (handle.id === "br") {
            br.style.top = `${y}px`
            bl.style.top = `${y}px`
        }
        if (handle.id === "bl") {
            bl.style.top = `${y}px`;
            br.style.top = `${y}px`;
        }

        // set overlay
        curr_tl = document.getElementById("tl").getBoundingClientRect();
        curr_br = document.getElementById("br").getBoundingClientRect();
        width = curr_br.left - curr_tl.left + 20;
        height = curr_br.top - curr_tl.top + 20;
        overlay.style.transform = "initial";
        overlay.style.left = `${curr_tl.left}px`;
        overlay.style.top = `${curr_tl.top}px`;
        overlay.style.width = `${width}px`
        overlay.style.height = `${height}px`

    }

    translateAll = (x, y) => {
        // (x, y) are offsets
        console.log(x, y)
        console.log("translating")
        let tl = document.getElementById("tl");
        let tr = document.getElementById("tr");
        let bl = document.getElementById("bl");
        let br = document.getElementById("br");
        let overlay = document.getElementById("imageOverlay");


        // need some way to truly reset the translate vals
        // maybe it should be the current val + the offset??
        let left = this.state.imageX + x;
        let top = this.state.imageY + y;

        overlay.style.left = `${left}px`
        overlay.style.top = `${top}px`

        let curr_x = overlay.getBoundingClientRect().left;
        let curr_y = overlay.getBoundingClientRect().top;
        let width = overlay.getBoundingClientRect().width - 20
        let height = overlay.getBoundingClientRect().height - 20

        tl.style.left = `${curr_x}px`
        tl.style.top = `${curr_y}px`
        tr.style.left = `${curr_x + width}px`
        tr.style.top = `${curr_y}px`
        bl.style.left = `${curr_x}px`
        bl.style.top = `${curr_y + height}px`
        br.style.left = `${curr_x + width}px`
        br.style.top = `${curr_y + height}px`

    }

    startHandleDrag = (e) => {
        // maybe reset offset and currentX + Y here
        e.stopPropagation()
        if (e.target !== e.currentTarget) {
            if (e.target.id === "tl" || e.target.id === "tr" || e.target.id === "bl" || e.target.id === "br" || e.target.id === "imageOverlay") {
                this.active = true;
                this.activeItem = e.target;
                if (this.activeItem !== null) {
                    if (!this.activeItem.xOffset) {
                        this.activeItem.xOffset = 0;
                    }
                    if (!this.activeItem.yOffset) {
                        this.activeItem.yOffset = 0;
                    }
                    let activeItem = this.activeItem;
                    if (e.type === "touchstart") {
                        activeItem.initialX = e.touches[0].clientX - activeItem.xOffset;
                        activeItem.initialY = e.touches[0].clientY - activeItem.yOffset;
                    } else {
                        activeItem.initialX = e.clientX - activeItem.xOffset;
                        activeItem.initialY = e.clientY - activeItem.yOffset;
                    }
                }
            }
        }
    }

    moveHandle = (e) => {
        if (this.active) {
            e.stopPropagation()
            e.preventDefault();
            let activeItem = this.activeItem;
            let x, y;
            if (e.type === "touchmove") {
                activeItem.currentX = e.touches[0].clientX - activeItem.initialX;
                activeItem.currentY = e.touches[0].clientY - activeItem.initialY;
                x = e.touches[0].clientX;
                y = e.touches[0].clientY;
            } else {
                activeItem.currentX = e.clientX - activeItem.initialX;
                activeItem.currentY = e.clientY - activeItem.initialY;
                x = e.clientX;
                y = e.clientY;
            }

            activeItem.xOffset = activeItem.currentX;
            activeItem.yOffset = activeItem.currentY;
            if (this.activeItem.id === "imageOverlay") {
                this.translateAll(activeItem.currentX, activeItem.currentY);
            } else if (this.cropAspectRatio) {
                this.translateWithAspectRatio(x, y, activeItem);
            } else {
                this.setTranslate(x, y, activeItem);
            }
        }
    }

    endHandleDrag = (e) => {
        e.stopPropagation()
        if (this.activeItem !== null) {
            this.activeItem.initialX = this.activeItem.currentX;
            this.activeItem.initialY = this.activeItem.currentY;
        }
        this.active = false;
        this.activeItem = null;
    }

    render() {
        let handleStyle = {
            "position": "absolute",
            "top": "0",
            "left": "0",
            "zIndex": "999",
        }
        let location = {
            pathname: this.state.redirect,
        }

        if (this.state.redirect) {
            return <Redirect to={location} />
        }

        // position crop handles
        let tlStyle, trStyle, brStyle, blStyle, overlayStyle = {};
        if (this.state.imageWidth || this.state.imageHeight) {
            console.log(this.state.imageX, this.state.imageY, this.state.imageWidth, this.state.imageHeight)
            tlStyle = {
                left: this.state.imageX,
                top: this.state.imageY,
            }
            trStyle = {
                left: this.state.imageX + this.state.imageWidth - 20,
                top: this.state.imageY,
            }
            brStyle = {
                left: this.state.imageX + this.state.imageWidth - 20,
                top: this.state.imageY + this.state.imageHeight - 20,
            }
            blStyle = {
                left: this.state.imageX,
                top: this.state.imageY + this.state.imageHeight - 20
            }

            overlayStyle = {
                left: this.state.imageX,
                top: this.state.imageY,
                width: this.state.imageWidth,
                height: this.state.imageHeight
            }
        }

        return (
            <div id="camera" onMouseDown={this.startHandleDrag} onMouseMove={this.moveHandle} onMouseUp={this.endHandleDrag} onTouchStart={this.startHandleDrag} onTouchMove={this.moveHandle} onTouchEnd={this.endHandleDrag}>

                <video autoPlay={true} id="video"></video>
                <canvas id="canvas" resize="true"></canvas>
                {/* Take picture for iOS / file upload */}
                <form>
                    {!this.state.userInput &&
                        <div className="camMenu">
                            <Form>
                                <Form.Label>Choose Image</Form.Label>
                                <Form.File style={{ "color": "white" }} type="file" capture="environment" accept="image/*" name="cameraInput" id="cameraInput" onChange={this.upload} />
                            </Form>
                            <Button variant="dark" id="captureButton" onClick={this.takePhoto}>Take Photo</Button>
                        </div>
                    }
                    {this.state.userInput &&
                        <div>
                            <div className="camMenu">
                                <Button variant="dark" id="retakeButton" onClick={this.reload}>Retry</Button>
                                <span>
                                    <Button onClick={this.crop}>Crop</Button>
                                    <Button onClick={() => { this.cropToAspect(16 / 9) }}>16:9</Button>
                                </span>
                                <span>
                                    <Button variant="success" onClick={this.save}>Save</Button>
                                </span>
                            </div>
                            <div style={handleStyle} id="cropHandles">
                                <span id="tl" style={tlStyle}></span>
                                <span id="tr" style={trStyle}></span>
                                <span id="br" style={brStyle}></span>
                                <span id="bl" style={blStyle}></span>
                            </div>
                            <div id="imageOverlay" style={overlayStyle}></div>
                        </div>
                    }
                </form>
            </div>
        );
    }
}

export default Camera;

// import { React, Component } from 'react';
// import { Link } from "react-router-dom";

// class Camera extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             width: 960,
//             height: 540,
//         };
//         this.loadStream = this.loadStream.bind(this);
//         this.takePhoto = this.takePhoto.bind(this);
//         this.reload = this.reload.bind(this);
//         this.save = this.save.bind(this);
//     }

//     loadStream() {
//         let constraints = { audio: false, video: { width: this.state.width, height: this.state.height} };
//         navigator.mediaDevices
//             .getUserMedia(constraints)
//             .then(function(mediaStream) {
//                 let video = document.querySelector("video");
//                 video.srcObject = mediaStream;
//                 video.onloadedmetadata = function(e) {
//                     video.play();
//                 };
//             })
//             .catch(function(err) {
//                 console.log(err.name + ": " + err.message);
//             });
//     }

//     takePhoto() {
//         let w = this.state.width;
//         let h = this.state.height;
//         let video = document.querySelector("video");
//         let canvas = document.querySelector("canvas");
//         let context = canvas.getContext('2d');

//         canvas.style.display = "block";
//         canvas.width = w;
//         canvas.height = h;
//         context.drawImage(video, 0, 0, w, h);
//         video.style.display = "none";

//         let btn = document.getElementById("captureButton");
//         let btn1 = document.getElementById("retakeButton");
//         let btn2 = document.getElementById("savePhoto");
//         btn.style.display = "none";
//         btn1.style.display = "block";
//         btn2.style.visibility = "visible";
        
//     }

//     reload() {
//         let video = document.querySelector("video");
//         let canvas = document.querySelector("canvas");

//         canvas.style.display = "none";
//         video.style.display = "block";
//         this.loadStream();
//         let btn = document.getElementById("captureButton");
//         let btn1 = document.getElementById("retakeButton")
//         let btn2 = document.getElementById("savePhoto")

//         btn.style.display = "block";
//         btn1.style.display = "none";
//         btn2.style.visibility = "hidden";
//     }

//     save() {
//         console.log("saving image...");
//         let canvas = document.querySelector("canvas");
//         let video = document.querySelector("video");
//         let image = canvas.toDataURL();
//         console.log({ image });
//         console.log("saved!");
//         localStorage.setItem("photo", image);
//         video.srcObject = null; //this removes video stream
//         //alert user save was successful
//         alert("Photo was saved successfully!");
//     }

//     componentDidMount() {
//         this.loadStream();
//     }

//     render() {
//         const hiddenSyle = { display: 'none'};

//         return (
//             <div id="camera">
//                 <h3>Take your image here!</h3>
//                 <video autoPlay={true} id="video"></video>
                
//                 <button id="captureButton" onClick={this.takePhoto}>Take Photo</button>
//                 <button id="retakeButton" onClick={this.reload} style={hiddenSyle}>Retry</button>
//                 <div id="savePhoto"><Link to="editor" onClick={this.save}>✔️ Save and Edit </Link></div>
//                 <canvas id="canvas"></canvas>
//             </div>
//         );
//     }
// }

// export default Camera;