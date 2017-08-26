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
      confirmNewPassword: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    const { newPassword, confirmNewPassword, passwordAttempt } = this.state

    if(newPassword !== confirmNewPassword) { return console.log('passwords must match') }

    // prepare axios post request
    const data = { passwordAttempt, newPassword }
    const token = JSON.parse(localStorage.getItem('userData')).token
    const config = { headers: { authorization: token } }

    axios.post(`${baseRoute}/api/user/password/change`, data, config)
      .then(response => console.log(response.data))
      .catch(error => console.log(error))
  }

  render() {
    return (
      <div className="uk-flex uk-flex-center">
        <div className="uk-card uk-card-default uk-width-1-2@s uk-width-1-3@m uk-animation-slide-top-medium">
          <div className="uk-card-header uk-card-primary">
            <h3 className="card-title">Change Your Password</h3>
          </div>

          <div className="uk-card-body">
            <form onSubmit={this.handleSubmit} className="uk-form-stacked">
              {this.state.invalidSubmission
                ? <div className="uk-margin uk-text-danger uk-animation-slide-bottom">{this.state.submissionError}</div> 
                : ''
              }

              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="passwordAttempt">Current Password</label>
                <input 
                  className="uk-input" 
                  type="password" 
                  name="passwordAttempt"
                  placeholder="Prove yourself!"
                  onChange={this.handleInputChange} 
                />
              </div>
      
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="newPassword">New Password</label>
                <input 
                  className="uk-input" 
                  type="password" 
                  name="newPassword"
                  placeholder="best make it better than p@ssword123"
                  onChange={this.handleInputChange} 
                />
              </div>

              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="confirmNewPassword">Confirm New Password</label>
                <input 
                  className="uk-input" 
                  type="password" 
                  name="confirmNewPassword"
                  placeholder="one more time"
                  onChange={this.handleInputChange} 
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
