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
      password: '',
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

    // check that user has provided valid input
    if(!this.state.email || !this.state.password) { 
      return this.setState({ 
        invalidSubmission: true, 
        submissionError: 'please enter an email and password to proceed'
      })
    }

    const user = this
    
    axios.post(`${baseRoute}/api/signin`, {
        email: user.state.email,
        password: user.state.password
      })
      .then(response => localStorage.setItem('userData', JSON.stringify(response.data)))
      .then(() => this.props.updateAuth(null, true))
      .then(() => this.props.history.push('/'))
      .catch(error => {
        this.props.updateAuth('internal error, please wait a minute and try again', false)

        this.setState({ invalidSubmission: true, submissionError: 'invalid username or password' })
      })
  }
  
  render() {
    return (
      <div className="uk-flex uk-flex-center">
        <div className="uk-card uk-card-default uk-width-1-2@s uk-width-1-3@m uk-animation-slide-top-medium">
          <div className="uk-card-header uk-card-primary">
            <h3 className="card-title">Sign In</h3>
          </div>

          <div className="uk-card-body">
            <form onSubmit={this.handleSubmit} className="uk-form-stacked">
              {this.state.invalidSubmission
                ? <div className="uk-margin uk-text-danger uk-animation-slide-bottom">{this.state.submissionError}</div> 
                : ''
              }
              
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
                <button className="uk-button uk-button-primary">Sign In</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

Signin.propTypes = {
  updateAuth: PropTypes.func.isRequired
}

export default RequireNoAuth(Signin)
