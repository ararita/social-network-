import React from "react";
import ReactDOM from "react-dom";
import { Welcome } from "./welcome";
import App from "./app";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer } from "./reducers.js";
import { Provider } from "react-redux";

// import { initSocket } from "./socket";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
let renderStuff;

if (location.pathname == "/welcome") {
    renderStuff = <Welcome />;
} else {
    renderStuff = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(
    renderStuff,
    document.querySelector("main")
    //ovaj main je main iz htmla, to je root
);
