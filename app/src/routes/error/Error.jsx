import { React, Component } from "react";
import "../../stylesheets/error/main.css";

export default class Error extends Component {
  render() {
    return (
      <div
        id="error-elm"
        className="d-flex align-items-center flex-column justify-content-center h-100 w-100"
      >
        <div id="big-text">OOPS!</div>
        <div id="small-text">something went wrong</div>
        <div id="back-to-home " className="pt-4 mt-4">
          <button
            id="back-to-home-btn"
            className="btn btn-outline-secondary"
            onClick={() => this.props.homePageRef.current.click()}
          >
            BACK TO HOME
          </button>
        </div>
      </div>
    );
  }
}
