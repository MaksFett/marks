import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import { StoreProvider } from "./store/StoreProvider";

ReactDOM.render(
    <StoreProvider>
        <App />
    </StoreProvider>,
    document.getElementById("root")
);