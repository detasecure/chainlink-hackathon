import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import * as fcl from "@blocto/fcl"

fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org") // connect to Flow testnet
  .put("discovery.wallet", `https://wallet-v2-dev.blocto.app/35ca2e44-f546-400a-bdee-84776c0282a9/flow/authn`) // use Blocto testnet wallet


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <RootLayout/> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
