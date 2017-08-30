import React, {Component} from 'react'
import axios from 'axios'

import RequireAuth from '../hoc/RequireAuth'
import {baseRoute} from '../../utils/api'

class Settings extends Component {
  constructor() {
    super()

    this.state = {
      passwordAttempt: '',
      newPassword: '',
      confirmNewPassword: '',
      invalidSubmission: false,
      submissionError: '',
      newPasswordsMatch: true,
      currentPasswordIsCorrect: true,
      passwordChanged: false
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  // *** form checking methods ***
  confirmPasswordsMatch(e) {
    // event value is used instead of state confirmPassword to avoid issues with set state async execution
    if(this.state.newPassword !== e.target.value) {
      return this.setState({ newPasswordsMatch: false }, () => this.updateSubmissionStatus())
    }

    this.setState({ newPasswordsMatch: true }, () => this.updateSubmissionStatus())
  }

  // only returns true when all form values are true. This prevents error message from going away on invalid input
  updateSubmissionStatus() {
    const {
      newPasswordsMatch,
      currentPasswordIsCorrect,
    } = this.state

    let submissionError = ''
    if(!newPasswordsMatch) { submissionError = 'Expected Passwords to Match' }
    else if (!currentPasswordIsCorrect) { submissionError = 'Current Password Entered is Incorrect' }

    // the only time submission error will be an empty string is if there are no invalid inputs
    const invalidSubmission = Boolean(submissionError)

    this.setState({ invalidSubmission, submissionError })
  }

  // *** event handlers ***
  handleInputChange(e) {
    const maxInputSize = 72

    if(e.target.value.length > maxInputSize) { return }

    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    const self = this
    const { newPassword, confirmNewPassword, passwordAttempt } = this.state

    if(newPassword !== confirmNewPassword) { return console.log('passwords must match') }

    // prepare axios post request
    const data = { passwordAttempt, newPassword }
    const token = JSON.parse(localStorage.getItem('userData')).token
    const config = { headers: { authorization: token } }

    axios.post(`${baseRoute}/api/user/password/change`, data, config)
      .then(response => {
        // settings currentPasswordIsCorrect to true resets error message if a successful change 
        // attempt happens after a failed attempt
        this.setState(
          { passwordChanged: true, currentPasswordIsCorrect: true },
          () => self.updateSubmissionStatus()
        )
      })
      // at this time, errors are assumed to mean invalid password has been entered
      .catch(error => this.setState({ currentPasswordIsCorrect: false }, () => self.updateSubmissionStatus()))
  }

  render() {
    return (
      <div className="uk-flex uk-flex-center">
        <div className="uk-card uk-card-default uk-width-1-2@s uk-width-1-3@m uk-animation-slide-top-small">
          <div className="uk-card-header uk-card-primary">
            <h3 className="card-title">Change Your Password</h3>
          </div>

          <div className="uk-card-body">
            <form onSubmit={this.handleSubmit} className="uk-form-stacked">
              {
                this.state.invalidSubmission
                  ? <div 
                      className="uk-margin uk-text-danger uk-animation-slide-bottom"
                    >
                      {this.state.submissionError}
                    </div>
                  : ''
              }

              {
                this.state.passwordChanged
                  ? <div 
                      className="uk-margin uk-text-success uk-animation-slide-bottom"
                    >
                      Password Updated Successfully
                    </div> 
                  : ''
              }

              <div className="uk-margin">
                <label 
                  className="uk-form-label" 
                  htmlFor="passwordAttempt"
                >
                  Current Password
                </label>
                <input 
                  className="uk-input" 
                  type="password" 
                  name="passwordAttempt"
                  placeholder="Prove yourself!"
                  value={this.state.passwordAttempt}
                  onChange={this.handleInputChange} 
                />
              </div>
      
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="newPassword">New Password</label>
                <input 
                  className={`uk-input ${this.state.newPasswordsMatch ? '' : 'uk-form-danger'}`}
                  type="password" 
                  name="newPassword"
                  placeholder="best make it better than p@ssword123"
                  value={this.state.newPassword}
                  onChange={this.handleInputChange} 
                />
              </div>

              <div className="uk-margin">
                <label 
                  className="uk-form-label" 
                  htmlFor="confirmNewPassword"
                >
                  Confirm New Password
                </label>
                <input 
                  className={`uk-input ${this.state.newPasswordsMatch ? '' : 'uk-form-danger'}`}
                  type="password" 
                  name="confirmNewPassword"
                  placeholder="one more time"
                  value={this.state.confirmNewPassword}
                  onChange={(e) => { this.handleInputChange(e); this.confirmPasswordsMatch(e) }} 
                />
              </div>
      
              <div className="uk-margin">
                <button className="uk-button uk-button-primary">Change Password</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default RequireAuth(Settings)
