import { React, Component } from 'react';
import { Link } from "react-router-dom";

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 960,
            height: 540,
            keyNum: 1
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
        this.displayImg()
        let canvas = document.getElementById("editableCanvas");
        let context = canvas.getContext('2d');
        let imageData = this.getImageData();
        let pixels = imageData.data;

        for (let i = 0; i<pixels.length; i+=4) {
            let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
            pixels[i] = lightness;
            pixels[i+1] = lightness;
            pixels[i+2] = lightness;
        }
        context.putImageData(imageData, 0, 0);

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
        this.displayImg()
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

        console.log("Applied sepia");
    }

    resetImage() {
        this.loadPhoto();
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
        return (
        <div id="editor">
            <h3>Edit your photo here!</h3>
            <canvas id="editableCanvas"></canvas>
            <img id="display" alt="your webcam output is here" onLoad={this.displayImg}></img>
            <br />
            <div id="options">
                <button id="reset" onClick={this.resetImage}>Reset Image</button>
                <button id="greyscale" onClick={this.applyGreyscale}>Greyscale 1</button>
                <button id="greyscale2" onClick={this.applyGreyscale2}>Greyscale 2</button>
                <button id="sepia" onClick={this.applySepia}>Sepia</button>
                <button id="editedSave" onClick={this.editedSave}>Save</button>
            </div>
            <Link to="gallery">Go to Gallery</Link>

        </div>
        );
    }
}

export default Editor;