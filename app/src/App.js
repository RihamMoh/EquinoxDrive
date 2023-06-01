import { Component, React } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Account from "./routes/account/Account";
import Home from "./routes/home/Home";
import Settings from "./routes/settings/Settings";
import Error from "./routes/error/Error";
import RootLayout from "./Layouts/RootLayout";
import { WsConnect, Wsclient } from "./common/Wsconnection";
import { createRef } from "react";

export default class App extends Component {
  HomePageRef = createRef();
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<RootLayout homePageRef={this.HomePageRef} />}
          >
            <Route index element={<Home />} />
            <Route path="settings" element={<Settings />} />
            <Route path="account" element={<Account />} />
            <Route
              path="*"
              element={<Error homePageRef={this.HomePageRef} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}
