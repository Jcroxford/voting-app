import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import axios from 'axios'

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
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" onChange={this.handleInputChange} />
<br/>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" onChange={this.handleInputChange} />
<br/>
        <button>Sign in</button>
      </form>
    )
  }
}

export default withRouter(Signin)
