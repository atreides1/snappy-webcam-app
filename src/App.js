import { React, Component } from 'react';
import './App.css';
import { Redirect } from "react-router-dom";
import { Button } from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
    }
  }
  render() {
    if (this.state.redirect) {
      let location = {
        pathname: this.state.redirect,
      }
      return (
        <Redirect to={location} />
      )
    }
    return (
        <div id="home" className="text-white">
          <h1 style={{fontSize: "5.5rem"}}>Snappy</h1>
        <p>The place for easy-peasy 👍 webcam pics and filters. 📸 </p>
          <p>(Right in your browser!)</p>
          <Button variant="outline-light" onClick={() => {this.setState({ redirect: '/camera' })}}>Continue</Button> 
        </div>
    );
  }
}

export default App;
