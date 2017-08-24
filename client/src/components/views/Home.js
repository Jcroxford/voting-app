import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = { username: '' }
  }

  componentWillMount() {
    if (!this.props.authenticated) { return }

    const userData = JSON.parse(localStorage.getItem('userData'))
    
    this.setState({ username: userData.username })
  }

  render() {
    return (
      !this.props.authenticated
        ? <div>Welcome to the home page</div>
        : <div>
            <div>Hello {this.state.username}!</div>
            <Link to={`/${this.state.username}/polls`}>View My Polls</Link>
            {/* <Link>Create New Poll</Link> */}
          </div>
    )
  }
}

export default Home
