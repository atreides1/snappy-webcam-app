import { React, Component } from 'react';
import { Link } from "react-router-dom";

class MainMenu extends Component {

  render() {
    return (
      <div id="mainMenu">
        <Link to="/camera"> <button class="menuButton">Take Photo</button></Link> 
        <br />
        <Link to="/gallery"><button class="menuButton">Photo Gallery</button></Link>
      </div>
    );
  }
}

export default MainMenu;