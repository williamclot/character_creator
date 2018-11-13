import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ThreeContainer from './three';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <React.Fragment>
        <ThreeContainer />
        {/* <App /> */}
    </React.Fragment>
    ,
    document.getElementById('app')
);

registerServiceWorker();
