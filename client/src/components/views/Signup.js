import React, {Component} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

// also includes withRouter
import RequireNoAuth from '../hoc/RequireNoAuth'
import {baseRoute} from '../../utils/api'

class Signup extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      invalidSubmission: false,
      submissionError: ''
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

    if(user.state.password !== user.state.confirmPassword) { return console.log('passwords do not match') }

    axios.post(`${baseRoute}/api/signup`, {
        username: user.state.username,
        email: user.state.email,
        password: user.state.password // FIXME: validate that it conforms to specific params
      })
      .then(response => localStorage.setItem('userData', JSON.stringify(response.data)))
      .then(() => this.props.updateAuth('', true))
      .then(() => this.props.history.push('/'))
      .catch(error => this.props.updateAuth('internal error, please wait a minute and try again', false))
  }

  render() {
    return (
      <div className="uk-card uk-card-default uk-width-1-2@m uk-width-1-3@l uk-animation-slide-top-medium">
        <div className="uk-card-header uk-card-primary">
          <h3 className="card-title">Sign Up</h3>
        </div>

        <div className="uk-card-body">
          <form onSubmit={this.handleSubmit} className="uk-form-stacked">
            {this.state.invalidSubmission
              ? <div className="uk-margin uk-text-danger uk-animation-slide-bottom">{this.state.submissionError}</div> 
              : ''
            }
            
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="username">Username</label>
              <input 
                className="uk-input" 
                type="text" 
                name="username" 
                placeholder="urAvgVoter" 
                onChange={this.handleInputChange}
              />
            </div>

            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="email">Email</label>
              <input
                className="uk-input" 
                type="email" 
                name="email" 
                placeholder="example@email.com"
                onChange={this.handleInputChange}
              />
            </div>

            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="password">Password</label>
              <input 
                className="uk-input" 
                type="password" 
                name="password"
                placeholder="Don't worry, I wont tell anyone"
                onChange={this.handleInputChange} 
              />
            </div>

            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                className="uk-input"
                type="password"
                name="confirmPassword"
                placeholder="One more time!"
                onChange={this.handleInputChange}
              />
            </div>
    
            <div className="uk-margin">
              <button className="uk-button uk-button-primary">Create Account</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

Signup.propTypes = {
  updateAuth: PropTypes.func.isRequired
}

export default RequireNoAuth(Signup)
