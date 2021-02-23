import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Route, Switch, BrowserRouter as Router} from 'react-router-dom';
import Camera from './camera';
import Editor from './editor';
import NotFound from './404';
import 'bootstrap/dist/css/bootstrap.css'; // npm i react-bootstrap bootstrap



const routing = (
  <React.StrictMode>
  <Router basename={process.env.PUBLIC_URL}>
    {/*Switch for error handling */}
    <Switch>
      <Route exact path="/" component={App}            />
      <Route path="/menu" component={MainMenu}         />
      <Route path="/camera" component={Camera}         />
      <Route path="/gallery" component={Gallery}       />
      <Route path="/editor" component={Editor}         />
      <Route component={NotFound}                      />
    </Switch>

  </Router>
  </React.StrictMode>
)

ReactDOM.render(
  routing,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
