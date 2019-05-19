import React from 'react';
import './App.css';
import Employees from './employees/employees-page';

function App() {
  return (
      <div>
          <div className="container shadow-wrapper">
              <div className="row">
                  <div className="col-sm-12 header-container">
                      <div className="logo-wrapper">
                          <img src={window.location.origin + "/assets/logo.png"} className="logo" alt="myLogo" />
                      </div>
                  </div>
              </div>
          </div>
          <div className="container shadow-wrapper">
              <div className="row">
                  <div className="col-sm-12">
                      <Employees/>
                  </div>
              </div>
          </div>
          <div className="container shadow-wrapper">
              <div className="row">
                  <div className="col-sm-12 footer-container">
                      <img src={window.location.origin + "/assets/by-alex.png"}  alt="myLogo" />
                  </div>
              </div>
          </div>
      </div>
  );
}

export default App;
