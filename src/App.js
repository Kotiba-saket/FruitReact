import React from 'react';
import './App.css';
import Home from './fruit';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Route,Switch } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <header >
        <Home/>
  {/* <BrowserRouter>
             <Switch>
             <Route exact path="/" component={Home} />
             <Route exact path="/Edit" component={Edit} />
             <Route exact path="/Create" component={Create} />
             </Switch>
  </BrowserRouter> */}
  
         
      </header>
      
    </div>
  );
}

export default App;
