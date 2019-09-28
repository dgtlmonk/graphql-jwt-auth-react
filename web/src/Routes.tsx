import React from 'react';
import {Switch, BrowserRouter, Link, Route} from 'react-router-dom';
import {Home, Login, Register} from './components';

export default () => (
  <BrowserRouter>
    <div style={{padding: `1em`}}>
      {' '}
      <header style={{marginBottom: `1em`}}>
        <div style={{display: `inline`, margin: `1em`}}>
          <Link to="/">Home</Link>
        </div>
        <div style={{display: `inline`, margin: `1em`}}>
          <Link to="/register">Register</Link>
        </div>
        <div style={{display: `inline`, margin: `1em`}}>
          <Link to="/login">Login</Link>
        </div>
      </header>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </div>
  </BrowserRouter>
);
