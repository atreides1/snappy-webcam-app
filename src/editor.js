// blox shadow on image, download button, more filters
import { React, Component } from 'react';
import { Redirect } from "react-router-dom";
import { Button } from 'react-bootstrap';

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
        };
        this.loadPhoto = this.loadPhoto.bind(this);
        this.displayImg = this.displayImg.bind(this);
        this.getImageData = this.getImageData.bind(this);
        this.applyGreyscale = this.applyGreyscale.bind(this);
        this.applyGreyscale2 = this.applyGreyscale2.bind(this);
        this.applySepia = this.applySepia.bind(this);
        this.resetImage = this.resetImage.bind(this);
        this.editedSave = this.editedSave.bind(this);
    }

    componentDidMount() {
        this.loadPhoto();
    }

    loadPhoto() {
        console.log("loading")

        if (localStorage.length > 0) //is greater than 0
        {
            console.log("finding previously taken images")
            let dataURL = localStorage.getItem("photo");
            let image = document.getElementById("display");
            image.src = dataURL;
            image.onload = () => {
                image.style.objectFit = "contain";
            }
        }

    }

    displayImg() {
        let image = document.getElementById("display");
        let width = this.state.width;
        let height = this.state.height;
        let canvas = document.getElementById("editableCanvas");
        let context = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);

    }

    getImageData() {
        let canvas = document.getElementById("editableCanvas");
        let context = canvas.getContext('2d');
        let imageData = context.getImageData(0,0, canvas.width, canvas.height);
        return imageData;
    }

    applyGreyscale() {
        // this.displayImg()
        // let canvas = document.getElementById("editableCanvas");
        // let context = canvas.getContext('2d');
        // let imageData = this.getImageData();
        // let pixels = imageData.data;

        // for (let i = 0; i<pixels.length; i+=4) {
        //     let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
        //     pixels[i] = lightness;
        //     pixels[i+1] = lightness;
        //     pixels[i+2] = lightness;
        // }
        // context.putImageData(imageData, 0, 0);
        let image = document.getElementById("display");
        image.style.filter = "grayscale(100%)";

        console.log("Applied greyscale");
    }

    applyGreyscale2() {
        this.displayImg()
        let canvas = document.getElementById("editableCanvas");
        let context = canvas.getContext('2d');
        let imageData = this.getImageData();
        let pixels = imageData.data;

        for (let i = 0; i < pixels.length; i += 4) {

            let r = pixels[i],
                g = pixels[i + 1],
                b = pixels[i + 2];

            let lightness = parseInt(0.2126*r + 0.7152*g + 0.0722*b);
            pixels[i] =  pixels[i + 1] = pixels[i + 2] = lightness;
        }
        context.putImageData(imageData, 0, 0);

        console.log("Applied greyscale 2");
    }

    applySepia() {
        // this.displayImg()
        // let canvas = document.getElementById("editableCanvas");
        // let context = canvas.getContext('2d');
        // let imageData = this.getImageData();
        // let pixels = imageData.data;

        // for (let i = 0; i < pixels.length; i += 4) {

        //     let r = pixels[i],
        //         g = pixels[i + 1],
        //         b = pixels[i + 2];

        //         //using Microsoft's recommended values for Sepia
        //     let newRed = 0.393 * r + 0.769 * g + 0.189 * b;
        //     let newGreen = 0.349 * r + 0.686 * g + 0.168 * b;
        //     let newBlue = 0.272 * r + 0.534 * g + 0.131 * b;
        //     pixels[i]     =  newRed < 255 ? newRed : 255;
        //     pixels[i + 1] = newGreen < 255 ? newGreen : 255;
        //     pixels[i + 2] = newBlue < 255 ? newBlue : 255;
        // }
        // context.putImageData(imageData, 0, 0);
        let image = document.getElementById("display");
        image.style.filter = "sepia(100%)";

        console.log("Applied sepia");
    }

    applyBlur = () => {
        let image = document.getElementById("display");
        image.style.filter = "blur(6px)";

        console.log("Applied blur");
    }

    // applyFilter = (filter) => {
    //     let image = document.getElementById("display");
    //     if (image) {
    //         switch (filter) {
    //             case "grayscale":
    //                 image.style.filter = "grayscale(100%)";
    //                 break;
    //             case "sepia":
    //                 image.style.filter = "sepia(100%)";
    //                 break;
    //             case "blur":
    //                 image.style.filter = "blur(6px)";
    //                 break;
    //             case "none":
    //                 image.style.filter = "none";
    //                 break;
    //             default:
    //                 image.style.filter = "none"
    //         }
    //     }
    // }

    resetImage() {
        let image = document.getElementById("display");
        image.style.filter = "none";
    }

    editedSave() {
        console.log("saving image...");
        let canvas = document.getElementById("editableCanvas");
        let image = canvas.toDataURL();
        console.log({ image });
        console.log("saved!");
        let key = this.state.keyNum.toString();
        localStorage.setItem(key, image);
        //increment our key
        this.setState((prevState) => ({
            keyNum: prevState.keyNum + 1
        }));
        //let user know
        alert("Photo saved successfully!")
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
            <h3>Edit your photo here!</h3>
            {/* <canvas id="editableCanvas"></canvas> */}
            <img id="display" alt="your webcam output is here"></img>
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
            <Button variant="dark" size="sm" onClick={() => { }}>Download Image</Button>

        </div>
        );
    }
}

export default Editor;