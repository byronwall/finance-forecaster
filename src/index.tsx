import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./Components/App";
import registerServiceWorker from "./registerServiceWorker";

// import Bootstrap
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
