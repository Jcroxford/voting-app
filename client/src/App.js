import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import Home from './components/views/Home'
import Signin from './components/views/Signin'
import Signup from './components/views/Signup'
import Settings from './components/views/Settings'
import UserDetail from './components/views/UserDetail'
import Polls from './components/views/Polls'
import PollDetail from './components/views/PollDetail'
import Nav from './components/partials/Nav'

class App extends Component {
  constructor() {
    super()

    this.state = {
      auth: {
        authenticated: false,
        error: ''
      }
    }

    this.updateAuth = this.updateAuth.bind(this)
  }

  updateAuth(error, authenticated) {
    console.log('update auth called');
    if(!error) { error = '' }

    this.setState({
      error,
      authenticated
    })
  }

  render () {
    return (
      <Router>
        <div>
          <Nav />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signin" render={props => <Signin updateAuth={this.updateAuth} />} />
            <Route path="/signup" render={props => <Signup updateAuth={this.updateAuth} />} /> 
            <Route path="/settings" component={Settings} /> 
            <Route path="/polls" component={Polls} /> 
            <Route exact path="/:username" component={UserDetail} /> 
            <Route path="/:username/:pollId" component={PollDetail} /> 
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
