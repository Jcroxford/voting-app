import React, {Component} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

// also includes withRouter
import RequireNoAuth from '../hoc/RequireNoAuth'
import {baseRoute} from '../../utils/api'

class Signup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      invalidSubmission: false,
      invalidUsername: false,
      usernameInUse: false,
      invalidEmail: false,
      passwordsMatch: true,
      submissionError: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.checkUsername = this.checkUsername.bind(this)
    this.isValidUsernameFormatting = this.isValidUsernameFormatting.bind(this)
    this.checkusernameAvailability = this.checkUsernameAvailability.bind(this)
    this.confirmPasswordsMatch = this.confirmPasswordsMatch.bind(this)
    this.checkEmailAvailability = this.checkEmailAvailability.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  // *** form input and availability checking methods ***
  // only returns true when all form values are true. This prevents error message from going away on invalid input
  updateSubmissionStatus() {
    const {
      invalidUsername, 
      usernameInUse,
      invalidEmail,
      passwordsMatch
    } = this.state

    let submissionError = ''
    if (usernameInUse) { submissionError = 'Username Is Already In Use' }
    else if(invalidUsername) { submissionError = 'Use Only Letters or Numbers'}
    else if (invalidEmail) { submissionError = 'Email Is Already In Use' }
    else if(!passwordsMatch) { submissionError = 'Expected Passwords to Match' }

    // the only time submission error will be an empty string is if there are no invalid inputs
    const invalidSubmission = Boolean(submissionError)

    this.setState({ invalidSubmission, submissionError })
  }

  checkUsername(e) {
    const newUsername = e.target.value

    if(this.isValidUsernameFormatting(newUsername)) {
      return this.checkusernameAvailability(newUsername)
    }
  }

  isValidUsernameFormatting(newUsername) {
    const validUsernameCheck = /^[a-zA-Z0-9]*$/

    const validUsername = validUsernameCheck.test(newUsername)

    this.setState({ invalidUsername: !validUsername }, () => this.updateSubmissionStatus())
    
    return validUsername
  }

  checkUsernameAvailability(newUsername) {
    const self = this

    if(newUsername === '') { return }

    axios.get(`${baseRoute}/api/signup/usernameIsused/${newUsername}`)
      .then(response => {
        const {used} = response.data

        self.setState({ usernameInUse: used }, () => self.updateSubmissionStatus())
      })
      .catch(err => console.log(err))
  }

  checkEmailAvailability(e) {
    const self = this

    if(e.target.value === '') { return }

    axios.get(`${baseRoute}/api/signup/emailIsused/${e.target.value}`)
      .then(response => {
        const {used} = response.data

        self.setState({ invalidEmail: used }, () => self.updateSubmissionStatus())
      })
      .catch(err => console.log(err))
  }

  confirmPasswordsMatch(e) {
    // event value is used instead of state confirmPassword to avoid issues with set state async execution
    const passwordsMatch = this.state.password === e.target.value

    this.setState({ passwordsMatch }, () => this.updateSubmissionStatus())
  }
  
  // *** event handlers ***
  handleInputChange(e) {
    const maxInputSize = 72

    if(e.target.value.length > maxInputSize) { return }

    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    const user = this
    const {username, email, password, confirmPassword} = user.state

    // validate user input before submit
    if(user.state.invalidSubmission) { return }
    if(!username || !email || !password || !confirmPassword) {
      return user.setState({
        invalidSubmission: true,
        submissionError: 'please fill out every form field'
      })
    }

    axios.put(`${baseRoute}/api/signup`, { username, email, password })
      .then(response => localStorage.setItem('userData', JSON.stringify(response.data)))
      .then(() => this.props.updateAuth('', true))
      .then(() => this.props.history.goBack())
      .catch(error => this.props.updateAuth('internal error, please wait a minute and try again', false))
  }

  render() {
    return (
      <div className="uk-flex uk-flex-center">
        <div className="uk-card uk-card-default uk-width-1-2@s uk-width-1-3@m uk-animation-slide-top-small">
          
          <div className="uk-card-header uk-card-primary">
            <h3 className="card-title">Sign Up</h3>
          </div>

          <div className="uk-card-body">
            <form onSubmit={this.handleSubmit} className="uk-form-stacked" autoComplete="off">
              
              {this.state.invalidSubmission
                ? <div 
                    className={`uk-margin uk-text-danger ${this.state.invalidSubmission ? 'uk-animation-slide-bottom' : 'uk-animation-slide-top uk-animation-reverse'}`}
                  >
                    {this.state.submissionError}
                  </div> 
                : ''
              }
              
              <div className="uk-margin">
                <label 
                  className={`uk-form-label ${this.state.usernameInUse ? 'uk-text-danger' : ''}`}
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  className={`uk-input ${this.state.usernameInUse ? 'uk-form-danger' : ''}`}
                  type="text"
                  name="username"
                  placeholder="can be numbers or letters"
                  value={this.state.username}
                  onChange={(e) => { this.checkUsername(e); this.handleInputChange(e) }}
                  autoFocus
                />
              </div>

              <div className="uk-margin">
                <label
                  className={`uk-form-label ${this.state.invalidEmail ? 'uk-text-danger' : ''}`}
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className={`uk-input ${this.state.invalidEmail ? 'uk-form-danger' : ''}`}
                  type="email" 
                  name="email" 
                  placeholder="example@email.com"
                  value={this.state.email}
                  onChange={(e) => { this.checkEmailAvailability(e); this.handleInputChange(e) }}
                />
              </div>

              <div className="uk-margin">
                <label
                  className={`uk-form-label ${this.state.passwordsMatch ? '' : 'uk-text-danger'}`}
                  htmlFor="password"
                >
                  Password
                </label>
                <input 
                  className={`uk-input ${this.state.passwordsMatch ? '' : 'uk-form-danger'}`}
                  type="password" 
                  name="password"
                  placeholder="Don't worry, I wont tell anyone"
                  value={this.state.password}
                  onChange={this.handleInputChange} 
                />
              </div>

              <div className="uk-margin">
                <label 
                  className={`uk-form-label ${this.state.passwordsMatch ? '' : 'uk-text-danger'}`}
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  className={`uk-input ${this.state.passwordsMatch ? '' : 'uk-form-danger'}`}
                  type="password"
                  name="confirmPassword"
                  placeholder="One more time!"
                  value={this.state.confirmPassword}
                  onChange={(e) => { this.handleInputChange(e); this.confirmPasswordsMatch(e); }}
                />
              </div>
      
              <div className="uk-margin">
                <button className="uk-button uk-button-primary">Create Account</button>
              </div>

            </form>
          </div>

        </div>
      </div>
    )
  }
}

Signup.propTypes = {
  updateAuth: PropTypes.func.isRequired
}

export default RequireNoAuth(Signup)
