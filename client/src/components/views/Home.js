import React, {Component} from 'react'

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
      this.props.authenticated
        ? <div>Hello {this.state.username} welcome to the home page!</div>
        : <div>Welcome to the home page</div>
    )
  }
}

export default Home
