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
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="passwordAttempt">Current Password</label>
        <input type="password" name="passwordAttempt" onChange={this.handleInputChange} />
<br/>
        <label htmlFor="password">New Password</label>
        <input type="password" name="newPassword" onChange={this.handleInputChange} />
<br/>
        <label htmlFor="password">Confirm New Password</label>
        <input type="password" name="confirmNewPassword" onChange={this.handleInputChange} />
<br />
        <button>Change Password</button>
      </form>
    )
  }
}

export default RequireAuth(Settings)
