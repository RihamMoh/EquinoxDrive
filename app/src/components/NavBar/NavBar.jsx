import { Link } from "react-router-dom";
import { SmallWebsiteLogo } from "../../images";
import "bootstrap/js/dist/offcanvas";
import { Component } from "react";

export class NavBar extends Component {
  state = {
    navBarExpand: "sm",
    navItems: [
      { to: "/", classNames: ["nav-link"], content: "Home" },
      { to: "/settings", classNames: ["nav-link"], content: "Settings" },
      { to: "/account", classNames: ["nav-link"], content: "Account" },
    ],
  };
  render() {
    return (
      <nav className="navbar bg-body-tertiary navbar-expand-sm">
        <div className="container-fluid p-0 d-flex justify-content-between">
          <a className="navbar-brand d-flex align-items-baseline py-0" href="#">
            <SmallWebsiteLogo width="auto" height={26} />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="offcanvas offcanvas-start"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                <SmallWebsiteLogo width="auto" height={26} classes={"pe-2"} />
                EquinoxDrive
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-start flex-grow-1 pe-3">
                {this.state.navItems.map(
                  ({ to, classNames, content }, index) => (
                    <li className="nav-item" key={`nav-item-${index}`}>
                      <Link
                        onClick={() => {
                          this.props.setCurrentWebsitePath(to);
                        }}
                        className={[
                          ...classNames,
                          this.props.CurrentWebsitePath === to
                            ? "active"
                            : undefined,
                        ].join(" ")}
                        to={to}
                        ref={to === "/" ? this.props.homePageRef : null}
                      >
                        {content}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
