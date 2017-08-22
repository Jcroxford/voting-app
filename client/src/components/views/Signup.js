import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import axios from 'axios'

class Signup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit(e) {
    // this.props.updateAuth()
    e.preventDefault()
    const user = this
console.log(this);
    if(user.state.password !== user.state.confirmPassword) { return console.log('passwords do not match') }

    axios.post('http://localhost:3030/api/signup', {
        username: user.state.username,
        email: user.state.email,
        password: user.state.password
      })
      .then(response => localStorage.setItem('userData', JSON.stringify(response.data)))
      // .then(() => this.props.history.push('/'))
      .then(() => this.props.updateAuth('', true)) // FIXME: updateAuth needs a propType
      .catch(error => this.props.updateAuth('internal error, please wait a minute and try again', false))
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" onChange={this.handleInputChange} />
<br/>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" onChange={this.handleInputChange} />
<br/>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" onChange={this.handleInputChange} />
<br/>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" name="confirmPassword" onChange={this.handleInputChange} />
<br/>
        <button>Sign Up</button>
      </form>
    )
  }
}

export default Signup
