import { React, Component } from 'react';
import { Link } from "react-router-dom";

class Camera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 1280,
            height: 720
        };
        this.loadStream = this.loadStream.bind(this);
        this.takePhoto = this.takePhoto.bind(this);
        this.reload = this.reload.bind(this);
        this.save = this.save.bind(this);
    }

    loadStream() {
        let constraints = { audio: false, video: { width: this.state.width, height: this.state.height} };
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function(mediaStream) {
                let video = document.querySelector("video");
                video.srcObject = mediaStream;
                video.onloadedmetadata = function(e) {
                    video.play();
                };
            })
            .catch(function(err) {
                console.log(err.name + ": " + err.message);
            });
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
        context.drawImage(video, 0, 0, w, h);
        video.style.display = "none";

        let btn = document.getElementById("captureButton");
        let btn1 = document.getElementById("retakeButton");
        let btn2 = document.getElementById("acceptButton");
        btn.style.display = "none";
        btn1.style.display = "block";
        btn2.style.display = "block";
        
    }

    reload() {
        let video = document.querySelector("video");
        let canvas = document.querySelector("canvas");

        canvas.style.display = "none";
        video.style.display = "block";
        this.loadStream();
        let btn = document.getElementById("captureButton");
        let btn1 = document.getElementById("retakeButton")
        let btn2 = document.getElementById("acceptButton")

        btn.style.display = "block";
        btn1.style.display = "none";
        btn2.style.display = "none";
    }

    save() {
        console.log("saving image...");
        let canvas = document.querySelector("canvas");
        let video = document.querySelector("video");
        let image = canvas.toDataURL();
        console.log({ image });
        console.log("saved!");
        localStorage.setItem("photo", image);
        video.srcObject = null; //this removes video stream

    }

    componentDidMount() {
        this.loadStream();
    }

    render() {
        const hiddenSyle = { display: 'none'};

        return (
            <div id="camera">
                <p>Take your image here!</p>
                <video autoPlay={true} id="video"></video>
                <button id="captureButton" onClick={this.takePhoto}>Take Photo</button>
                <button id="retakeButton" onClick={this.reload} style={hiddenSyle}>Retry</button>
                <button id="acceptButton" onClick={this.save} style={hiddenSyle}>✔️</button>
                <Link to="editor">Next!</Link>


                <canvas id="canvas"></canvas>
            </div>
        );
    }
}

export default Camera;