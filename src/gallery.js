import { React, Component } from 'react';
import { Link } from 'react-router-dom';

class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 960,
            height: 540,
        };
        this.loadPhotos = this.loadPhotos.bind(this);
        this.clearAll = this.clearAll.bind(this);
    }

    componentDidMount() {
        this.loadPhotos();
    }

    loadPhotos() {
        console.log("loading")

        if (localStorage.length > 0) 
        {
            console.log("finding previously taken images")
            //for item in local storage
            Object.keys(localStorage).forEach(function (key) {
                let dataURL = localStorage.getItem(key);
                //make sure the stored item is an image
                if (dataURL.startsWith("data:image/png;base64"))
                { 
                    //create image tag
                    let image = new Image();
                    image.className = "galleryDisplay";
                    //set source
                    image.src = dataURL;
                    image.alt = "Output from webcam.";
                    document.getElementById("photos").appendChild(image);
                }

            });
        }
    }

    clearAll() {
        localStorage.clear();
        let photos = document.querySelectorAll(".galleryDisplay");
        console.log(photos);
        if (photos !== null) {
            photos.forEach(function(photo){
                photo.remove();
            });
        }
        
    }

    render() {
        return (
            <div id="gallery">
                <h3>Image gallery</h3>
                <div id="photos"></div>
                <button onClick={this.clearAll}>Clear Gallery (Delete All)</button>
                <Link to="camera">Take Photo</Link>
            </div>
        );
    }
}

export default Gallery;