import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import Home from './components/views/Home'
import Signin from './components/views/Signin'
import Signup from './components/views/Signup'
import Settings from './components/views/Settings'
import CreatePoll from './components/views/CreatePoll'
import Polls from './components/views/Polls'
import PollDetail from './components/views/PollDetail'
import NotFound from './components/views/NotFound'
import Nav from './components/partials/Nav'

import './styles/App.css'

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

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userData'))
    
    if(!userData) { return }

    const auth = this.state.auth
    auth.authenticated = true

    this.setState({ auth })
  }

  updateAuth(error, authenticated) {
    if(!error) { error = '' }

    const auth = { error, authenticated }

    this.setState({ auth })
  }

  render () {
    return (
      <Router>
        <div>
          <Nav authenticated={this.state.auth.authenticated} updateAuth={this.updateAuth} />

          <div className="uk-container uk-container-expand uk-margin-top">
            <Switch>
              <Route exact path="/" render={props => <Home authenticated={this.state.auth.authenticated} />} />
              <Route path="/signin" render={props => <Signin updateAuth={this.updateAuth} />} />
              <Route path="/signup" render={props => <Signup updateAuth={this.updateAuth} />} />
              <Route path="/settings" component={Settings} />
              <Route path="/CreatePoll" component={CreatePoll} />
              <Route path="/polls" component={Polls} />
              <Route path="/poll/:pollId/:pollTitle" component={PollDetail} />
              <Route path="*" component={NotFound} />
            </Switch>
          </div>

        </div>
      </Router>
    )
  }
}

export default App
