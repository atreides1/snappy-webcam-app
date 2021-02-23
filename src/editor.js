import { React, Component } from 'react';
import { Redirect } from "react-router-dom";
import { Button } from 'react-bootstrap';
import download from "downloadjs";
class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }

    componentDidMount() {
        this.loadImage();
        window.addEventListener("resize", this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }

    resize = () => {
        console.log("resizing")
        if (document.getElementById("editableCanvas")) {
            // resize canvas
            let canvas = document.getElementById("editableCanvas");
            let context = canvas.getContext("2d");

            canvas.width = window.innerWidth - (window.innerWidth * 0.10);
            canvas.height = window.innerHeight - (window.innerHeight * 0.25);
            // resize content
            let image = this.image;

            if (image) {
                console.log("adding image again");
                let aspectRatio = image.width / image.height;
                let newWidth = canvas.width;
                let newHeight = newWidth / aspectRatio;
                if (newHeight > canvas.height) {
                    newHeight = canvas.height;
                    newWidth = newHeight * aspectRatio;
                }

                canvas.width = newWidth;
                canvas.height = newHeight;
                context.drawImage(image, canvas.width / 2 - newWidth / 2, 0, newWidth, newHeight);
            } 
        }
    }

    loadImage = () => {
        // loads the image data onto canvas
        console.log("loading")

        if (localStorage.length > 0) 
        {
            console.log("finding previously taken images");
            let dataURL = localStorage.getItem("photo");
            let image = document.createElement("img");
            image.src = dataURL;
            image.onload = () => {
                this.image = image;
                this.resize()
            }
        }
    }

    getImageData = () => {
        let canvas = document.getElementById("editableCanvas");
        let context = canvas.getContext('2d');
        let imageData = context.getImageData(0,0, canvas.width, canvas.height);
        return imageData;
    }

    saveCurrentImageState = () => {
        let canvas = document.getElementById("editableCanvas");
        let img = document.createElement("img");
        img.src = canvas.toDataURL("image/jpeg", 0.95);
        img.onload = () => {
          this.image = img;
        };
    }

    // convolution function is from: 
    // https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
    convoluteImage = (imageData, weights, opaque=1) => {
        const createTempImageData = (w, h) => {
          let tempCanvas = document.createElement("canvas");
          let tempContext = tempCanvas.getContext("2d");
          return tempContext.createImageData(w, h);
        };
        let side = Math.round(Math.sqrt(weights.length));
        let halfSide = Math.floor(side/2);
        let src = imageData.data;
        let sw = imageData.width;
        let sh = imageData.height;
        
        let w = sw;
        let h = sh;
        let output = createTempImageData(w, h);
        let dst = output.data;

        let alpha = opaque ? 1 : 0;
        // go through each pixel
        for (let y=0; y<h; y++) {
            for (let x=0; x<w; x++) {
                let sy = y;
                let sx = x;
                let dstOff = (y*w+x) * 4;
                //calculate weighted sum
                let r=0, g=0, b=0, a=0;
                for (let cy=0; cy<side; cy++) {
                    for (let cx=0; cx<side; cx++) {
                        let scy = sy + cy - halfSide;
                        let scx = sx + cx - halfSide;
                        if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                            let srcOff = (scy*sw+scx)*4;
                            let wt = weights[cy*side+cx];
                            r += src[srcOff] * wt;
                            g += src[srcOff+1] * wt;
                            b += src[srcOff+2] * wt;
                            a += src[srcOff+3] * wt;
                        }
                    }
                }
                dst[dstOff] = r;
                dst[dstOff+1] = g;
                dst[dstOff+2] = b;
                dst[dstOff+3] = a + alpha * (255-a)
            }
        }
        return output;
    }

    applyGreyscale = () => {
        let canvas = document.getElementById("editableCanvas");
        let context = canvas.getContext('2d');
        let imageData = this.getImageData();
        let pixels = imageData.data;

        for (let i = 0; i < pixels.length; i += 4) {

            let r = pixels[i],
                g = pixels[i + 1],
                b = pixels[i + 2];

            let lightness = parseInt(0.2126 * r + 0.7152 * g + 0.0722 * b);
            pixels[i] = pixels[i + 1] = pixels[i + 2] = lightness;
        }
        context.putImageData(imageData, 0, 0);
        this.saveCurrentImageState();
        console.log("Applied greyscale");
    }

    applySepia = () => {
        let canvas = document.getElementById("editableCanvas");
        let context = canvas.getContext('2d');
        let imageData = this.getImageData();
        let pixels = imageData.data;

        for (let i = 0; i < pixels.length; i += 4) {

            let r = pixels[i],
                g = pixels[i + 1],
                b = pixels[i + 2];

            //using Microsoft's recommended values for Sepia
            let newRed = 0.393 * r + 0.769 * g + 0.189 * b;
            let newGreen = 0.349 * r + 0.686 * g + 0.168 * b;
            let newBlue = 0.272 * r + 0.534 * g + 0.131 * b;
            pixels[i]     =  newRed < 255 ? newRed : 255;
            pixels[i + 1] = newGreen < 255 ? newGreen : 255;
            pixels[i + 2] = newBlue < 255 ? newBlue : 255;
        }
        context.putImageData(imageData, 0, 0);
        this.saveCurrentImageState();
        console.log("Applied sepia");
    }

    applyBlur = () => {
        let canvas = document.getElementById("editableCanvas");
        let context = canvas.getContext('2d');
        let imageData = this.getImageData();
        let newImageData = this.convoluteImage(imageData,
          [ 1/9, 1/9, 1/9,
            1/9, 1/9, 1/9,
            1/9, 1/9, 1/9 ] 
        );
        context.putImageData(newImageData, 0, 0);
        this.saveCurrentImageState();
        console.log("Applied blur");
    }

    applySharpen = () => {
        let canvas = document.getElementById("editableCanvas");
        let context = canvas.getContext('2d');
        let imageData = this.getImageData();
        let newImageData = this.convoluteImage(imageData,
            [ 0,-1, 0,
             -1, 5, -1,
              0,-1, 0 ]
        );
        context.putImageData(newImageData, 0, 0);
        this.saveCurrentImageState();
        console.log("Applied sharpen");
    }

    brighten = () => {
        let canvas = document.getElementById("editableCanvas");
        let context = canvas.getContext("2d");
        let imageData = this.getImageData();
        let pixels = imageData.data;
        for (let i=0; i<pixels.length; i+=4) {
            pixels[i] += 5;
            pixels[i+1] += 5;
            pixels[i+2] += 5;
        }
        context.putImageData(imageData, 0, 0);
        this.saveCurrentImageState();
        console.log("brightened image")
    }

    darken = () => {
        let canvas = document.getElementById("editableCanvas");
        let context = canvas.getContext("2d");
        let imageData = this.getImageData();
        let pixels = imageData.data;
        for (let i=0; i<pixels.length; i+=4) {
            pixels[i] -= 5;
            pixels[i+1] -= 5;
            pixels[i+2] -= 5;
        }
        context.putImageData(imageData, 0, 0);
        this.saveCurrentImageState();
        console.log("darkened image")
    }

    resetImage = () => {
        this.loadImage();
    }

    downloadImage = () => {
        let canvas = document.getElementById("editableCanvas");
        let data = canvas.toDataURL("image/jpg");
        // download.js function to download file
        download(data, "editedImage.jpg", "image/jpg")
    }

    render() {
        if (this.state.redirect) {
            let location = {
                pathname: this.state.redirect,
            }
            return <Redirect to={location} />
        }

        return (
        <div id="editor" className="text-white">
            <h3 style={{fontSize: "2.75rem"}}>Edit your photo here!</h3>
            <canvas id="editableCanvas" style={{boxShadow: "10px 10px 10px rgba(55, 55, 55, 0.6)"}}></canvas>
            <br />
            <div id="options">
                <Button variant="outline-light" onClick={this.resetImage}>Reset Image</Button>
                <Button variant="outline-light" onClick={this.applyGreyscale}>Greyscale</Button>
                <Button variant="outline-light" onClick={this.applySepia}>Sepia</Button>
                <Button variant="outline-light" onClick={this.applyBlur}>Blur</Button>
                <Button variant="outline-light" onClick={this.applySharpen}>Sharpen</Button>
                <Button variant="outline-light" onClick={this.brighten}>Brighten</Button>
                <Button variant="outline-light" onClick={this.darken}>Darken</Button>
            </div>
            <Button variant="dark" size="sm" onClick={this.downloadImage}>Download Image</Button>
        </div>
        );
    }
}

export default Editor;