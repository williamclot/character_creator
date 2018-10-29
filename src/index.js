import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ThreeContainer from './ThreeContainer';
import registerServiceWorker from './registerServiceWorker';

// needed to polyfill THREE global object with the class FindMinGeometry
import './FindMinGeometry';

ReactDOM.render(
    <React.Fragment>
        <ThreeContainer />
        <App />
    </React.Fragment>
    ,
    document.getElementById('app')
);

registerServiceWorker();
