import { React, Component } from 'react';
import './App.css';
import { Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
        <div id="home">
          <h1>Snappy</h1>
          <p>The place for easy-peasy webcam pics and filters.</p>
          <p>(Right in your browser!)</p>
          <Link to="/menu"> Click to continue</Link> 
        </div>
    );
  }
}

export default App;
