import { useState } from "react";
import { useEffect } from "react";
import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../components/NavBar/NavBar";

export default function RootLayout({ homePageRef }) {
  const [CurrentWebsitePath, setCurrentWebsitePath] = useState(
    window.location.pathname
  );
  return (
    <div>
      <Fragment>
        <div id="rootnav" className=" bg-f7f7f7 px-3">
          <NavBar
            homePageRef={homePageRef}
            CurrentWebsitePath={CurrentWebsitePath}
            setCurrentWebsitePath={setCurrentWebsitePath}
          />
        </div>
        <Outlet />
      </Fragment>
    </div>
  );
}
