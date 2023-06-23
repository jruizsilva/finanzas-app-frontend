import React from "react";
import "./NotFound.css";
import { NavLink } from "react-router-dom";

function NotFound() {
  return (
    <div id="notfound">
      <div class="notfound">
        <div class="notfound-bg">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h1>oops!</h1>
        <h2>Error 404 : Page Not Found</h2>
        <NavLink to="/">go back</NavLink>
      </div>
    </div>
  );
}

export default NotFound;
