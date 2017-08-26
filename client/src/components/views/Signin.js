import React, {Component} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

// also includes withRouter
import RequireNoAuth from '../hoc/RequireNoAuth'
import {baseRoute} from '../../utils/api'

class Signin extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()

    const user = this
    
    axios.post(`${baseRoute}/api/signin`, {
        email: user.state.email,
        password: user.state.password
      })
      .then(response => localStorage.setItem('userData', JSON.stringify(response.data)))
      .then(() => this.props.updateAuth(null, true))
      .then(() => this.props.history.push('/'))
      .catch(error => this.props.updateAuth('internal error, please wait a minute and try again', false))
  }
  
  render() {
    return (
      <div className="uk-card uk-card-default uk-card-body uk-width-1-2">
        <h3 className="card-title">Sign In</h3>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="email">Email</label>
          <input className="uk-input" type="email" name="email" onChange={this.handleInputChange} />
  <br/>
          <label htmlFor="password">Password</label>
          <input className="uk-input" type="password" name="password" onChange={this.handleInputChange} />
  <br/>
          <button className="uk-button uk-button-primary uk-margin-top">Sign in</button>
        </form>
      </div>
    )
  }
}

Signin.propTypes = {
  updateAuth: PropTypes.func.isRequired
}

export default RequireNoAuth(Signin)
