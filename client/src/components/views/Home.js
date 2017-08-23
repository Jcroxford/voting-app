import React, {Component} from 'react'

class Home extends Component {
  constructor() {
    super()

    this.state = {
      username: '',
      authorized: false
    }
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userData'))
    
    if(!userData) { return }

    this.setState({ username: userData.username, authorized: true })
  }

  render() {
    return (
      this.state.authorized
        ? <div>Hello {this.state.username} welcome to the home page!</div>
        : <div>Welcome to the home page</div>
    )
  }
}

export default Home
