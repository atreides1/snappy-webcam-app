import { React, Component } from 'react';
import './App.css';
import { Link } from "react-router-dom";
//import ImageGallery from 'react-image-gallery';


// const images = [
//   {
//     original: 'https://picsum.photos/id/1018/1000/600/',
//     thumbnail: 'https://picsum.photos/id/1018/250/150/',
//   },
//   {
//     original: 'https://picsum.photos/id/1015/1000/600/',
//     thumbnail: 'https://picsum.photos/id/1015/250/150/',
//   },
//   {
//     original: 'https://picsum.photos/id/1019/1000/600/',
//     thumbnail: 'https://picsum.photos/id/1019/250/150/',
//   },
// ];

// class MyGallery extends React.Component {
//   render() {
//     return <ImageGallery items={images} />;
//   }
// }

class App extends Component {
  render() {
    return (
        <div id="home">
          <h1>Snappy</h1>
          <p>The place for easy-peasy webcam pics and filters. (Right in your browser!)</p>
          <Link to="/menu"> Click to continue</Link> 
        </div>
    );
  }
}

export default App;
