import React, {Component} from 'react'

class Signup extends Component {
  constructor() {
    super()

    // state = {
    //   username: '',
    //   email: '',
    //   password: '',
    //   confirmPassword: ''
    // }

    // this.handleSubmit = this.handleSubmit.bind(this)
  }



  render() {
    return (
      <form>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" />
<br/>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" />
<br/>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" />
<br/>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" name="confirmPassword" />
<br/>
        <button>Sign Up</button>
      </form>
    )
  }
}

export default Signup
