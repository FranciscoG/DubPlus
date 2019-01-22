"use strict";
import { h, render, Component } from "preact";
import polyfills from "./utils/polyfills";
import DubPlusMenu from "./menu/index.js";
import Modal from "./components/modal.js";
import WaitFor from "./utils/waitFor.js";
import Loading from "./components/loading.js";
import cssHelper from "./utils/css.js";
import MenuIcon from "./components/MenuIcon.js";
import getScript from "./utils/getScript.js";
import track from "./utils/analytics.js";

polyfills();

setTimeout(function() {
  // start the loading of the CSS asynchronously
  cssHelper.load("/css/dubplus.css");
  cssHelper.loadExternal(
    "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
  );

  if (typeof Promise === "undefined") {
    // load Promise polyfill for IE because we are still supporting it
    getScript(
      "https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"
    );
  }
}, 1);

class DubPlusContainer extends Component {
  state = {
    loading: true,
    error: false,
    errorMsg: "",
    failed: false
  };

  componentDidMount() {
    /* globals Dubtrack */
    if (!window.DubPlus) {
      // checking to see if these items exist before initializing the script
      // instead of just picking an arbitrary setTimeout and hoping for the best
      var checkList = [
        "Dubtrack.session.id",
        "Dubtrack.room.chat",
        "Dubtrack.Events",
        "Dubtrack.room.player",
        "Dubtrack.helpers.cookie",
        "Dubtrack.room.model",
        "Dubtrack.room.users"
      ];

      var _dubplusWaiting = new WaitFor(checkList, { seconds: 120 });

      _dubplusWaiting
        .then(() => {
          this.setState({
            loading: false,
            error: false
          });
        })
        .fail(() => {
          if (!Dubtrack.session.id) {
            this.showError("You're not logged in. Please login to use Dub+.");
          } else {
            this.showError("Something happed, refresh and try again");
            track.event("Dub+ lib", "load", "failed");
          }
        });
    } else {
      if (!Dubtrack.session.id) {
        this.showError("You're not logged in. Please login to use Dub+.");
      } else {
        this.showError("Dub+ is already loaded");
      }
    }
  }

  showError(msg) {
    this.setState({
      loading: false,
      error: true,
      errorMsg: msg
    });
  }

  render(props, state) {
    if (state.loading) {
      return <Loading />;
    }

    if (state.error) {
      return (
        <Modal
          title="Dub+ Error"
          onClose={() => {
            this.setState({ failed: true, error: false });
          }}
          content={state.errorMsg}
        />
      );
    }

    if (state.failed) {
      return null;
    }

    return <DubPlusMenu />;
  }
}

render(<DubPlusContainer />, document.body);
render(<MenuIcon />, document.querySelector(".header-right-navigation"));

// _PKGINFO_ is inserted by the rollup build process
export default _PKGINFO_;