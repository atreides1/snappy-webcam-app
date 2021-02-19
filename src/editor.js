// blox shadow on image, download button, more filters
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
    }

    loadImage = () => {
        // loads the 
        console.log("loading")

        if (localStorage.length > 0) //is greater than 0
        {
            console.log("finding previously taken images");
            let dataURL = localStorage.getItem("photo");
            let canvas = document.getElementById("editableCanvas");
            let context = canvas.getContext("2d");
            // let image = document.getElementById("display");
            // image.src = dataURL;
            // image.onload = () => {
            //     image.style.objectFit = "contain";
            // }
            let image = document.createElement("img");
            image.src = dataURL;
            // console.log(dataURL);
            image.onload = () => {
                console.log("putting image on canvas")
                // console.log(image.width, image.height)
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, image.width, image.height);
                // console.log(context)
            }
        }
    }

    // displayImg() {
    //     let image = document.getElementById("display");
    //     let width = this.state.width;
    //     let height = this.state.height;
    //     let canvas = document.getElementById("editableCanvas");
    //     let context = canvas.getContext('2d');
    //     canvas.width = width;
    //     canvas.height = height;
    //     context.drawImage(image, 0, 0, width, height);

    // }

    getImageData = () => {
        let canvas = document.getElementById("editableCanvas");
        let context = canvas.getContext('2d');
        let imageData = context.getImageData(0,0, canvas.width, canvas.height);
        return imageData;
    }

    applyGreyscale = () => {
        // this.loadImage()
        let canvas = document.getElementById("editableCanvas");
        let context = canvas.getContext('2d');
        let imageData = this.getImageData();
        let pixels = imageData.data;

        // for (let i = 0; i<pixels.length; i+=4) {
        //     let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
        //     pixels[i] = lightness;
        //     pixels[i+1] = lightness;
        //     pixels[i+2] = lightness;
        // }
        for (let i = 0; i < pixels.length; i += 4) {

            let r = pixels[i],
                g = pixels[i + 1],
                b = pixels[i + 2];

            let lightness = parseInt(0.2126 * r + 0.7152 * g + 0.0722 * b);
            pixels[i] = pixels[i + 1] = pixels[i + 2] = lightness;
        }
        context.putImageData(imageData, 0, 0);
        // let image = document.getElementById("display");
        // image.style.filter = "grayscale(100%)";

        console.log("Applied greyscale");
    }

    // applyGreyscale2() {
    //     this.displayImg()
    //     let canvas = document.getElementById("editableCanvas");
    //     let context = canvas.getContext('2d');
    //     let imageData = this.getImageData();
    //     let pixels = imageData.data;

    //     for (let i = 0; i < pixels.length; i += 4) {

    //         let r = pixels[i],
    //             g = pixels[i + 1],
    //             b = pixels[i + 2];

    //         let lightness = parseInt(0.2126*r + 0.7152*g + 0.0722*b);
    //         pixels[i] =  pixels[i + 1] = pixels[i + 2] = lightness;
    //     }
    //     context.putImageData(imageData, 0, 0);

    //     console.log("Applied greyscale 2");
    // }

    applySepia = () => {
        // this.loadImage()
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
        // let image = document.getElementById("display");
        // image.style.filter = "sepia(100%)";

        console.log("Applied sepia");
    }

    applyBlur = () => {
        // this.loadImage();
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
            pixels[i] = newRed < 255 ? newRed : 255;
            pixels[i + 1] = newGreen < 255 ? newGreen : 255;
            pixels[i + 2] = newBlue < 255 ? newBlue : 255;
        }
        context.putImageData(imageData, 0, 0);
        // let image = document.getElementById("display");
        // image.style.filter = "blur(6px)";

        console.log("Applied blur");
    }

    resetImage = () => {
        this.loadImage();
        // let image = document.getElementById("display");
        // image.style.filter = "none";
    }

    // editedSave() {
    //     console.log("saving image...");
    //     let canvas = document.getElementById("editableCanvas");
    //     let image = canvas.toDataURL();
    //     console.log({ image });
    //     console.log("saved!");
    //     let key = this.state.keyNum.toString();
    //     localStorage.setItem(key, image);
    //     //increment our key
    //     this.setState((prevState) => ({
    //         keyNum: prevState.keyNum + 1
    //     }));
    //     //let user know
    //     alert("Photo saved successfully!")
    // }

    downloadImage = () => {
        // this works...
        let canvas = document.getElementById("editableCanvas");
        let data = canvas.toDataURL("image/jpg");
        // if (!window.open(data)) {
        //     document.location.href = data;
        // }
        // but let me try this...
        // let data = canvas.toBlob((blob) => {
        download(data, "editedImage.jpg", "image/jpg")
        // }, 'image/jpeg', 0.95);
        // save the context as a blob...
        // download blob...
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
            <canvas id="editableCanvas"></canvas>
            {/* <img id="display" alt="your webcam output is here"></img> */}
            <br />
            <div id="options">
                <Button variant="outline-light" id="reset" onClick={this.resetImage}>Reset Image</Button>
                <Button variant="outline-light" id="greyscale" onClick={this.applyGreyscale}>Greyscale</Button>
                {/* <Button variant="outline-light" id="greyscale2" onClick={this.applyGreyscale2}>Greyscale 2</Button> */}
                <Button variant="outline-light" id="sepia" onClick={this.applySepia}>Sepia</Button>
                <Button variant="outline-light" onClick={this.applyBlur}>Blur</Button>
                {/* instead have a download as */}
                {/* <Button variant="outline-light" id="editedSave" onClick={this.editedSave}>Save</Button> */}
            </div>
            {/* <Button variant="dark" size="sm" onClick={() => { this.setState({ redirect: "/gallery" })}}>Gallery</Button> */}
            <Button variant="dark" size="sm" onClick={this.downloadImage}>Download Image</Button>
            {/* <a href="#display" download="newImage" alt="download the image">Download Image</a> */}
        </div>
        );
    }
}

export default Editor;