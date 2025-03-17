import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import { userStore } from "./store/UserStore";
import { observer } from "mobx-react-lite";

const Root = observer(() => <App />);

ReactDOM.render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>,
    document.getElementById("root")
);
