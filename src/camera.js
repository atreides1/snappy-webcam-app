import { React, Component } from 'react';
import { Link } from "react-router-dom";

class Camera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 960,
            height: 540,
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
        let btn2 = document.getElementById("savePhoto");
        btn.style.display = "none";
        btn1.style.display = "block";
        btn2.style.visibility = "visible";
        
    }

    reload() {
        let video = document.querySelector("video");
        let canvas = document.querySelector("canvas");

        canvas.style.display = "none";
        video.style.display = "block";
        this.loadStream();
        let btn = document.getElementById("captureButton");
        let btn1 = document.getElementById("retakeButton")
        let btn2 = document.getElementById("savePhoto")

        btn.style.display = "block";
        btn1.style.display = "none";
        btn2.style.visibility = "hidden";
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
        //alert user save was successful
        alert("Photo was saved successfully!");

    }

    componentDidMount() {
        this.loadStream();
    }

    render() {
        const hiddenSyle = { display: 'none'};

        return (
            <div id="camera">
                <h3>Take your image here!</h3>
                <video autoPlay={true} id="video"></video>
                
                <button id="captureButton" onClick={this.takePhoto}>Take Photo</button>
                <button id="retakeButton" onClick={this.reload} style={hiddenSyle}>Retry</button>
                <div id="savePhoto"><Link to="editor" onClick={this.save}>✔️ Save and Edit </Link></div>
                <canvas id="canvas"></canvas>
            </div>
        );
    }
}

export default Camera;