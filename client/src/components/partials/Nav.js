import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link, withRouter} from 'react-router-dom'

class Nav extends Component {
  constructor(props) {
    super(props)

    this.handleSignout = this.handleSignout.bind(this)
  }
  
  handleSignout() {
    console.log('handle signout clicked')
    localStorage.removeItem('userData')
    this.props.updateAuth('', false)

    this.props.history.push('/')
  }

  render() {
    return (
      <div>
        <nav className="uk-navbar uk-navbar-container" uk-navbar>
          <div className="uk-navbar-right">
            <ul className="uk-navbar-nav">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/signin">Signin</Link></li>
              <li><Link to="/signup">Signup</Link></li>
              <li><Link to="/settings">Settings</Link></li>
              <li><Link to="/polls">Polls</Link></li>
              <li><a onClick={this.handleSignout}>Sign Out</a></li>
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

Nav.propTypes = {
  updateAuth: PropTypes.func.isRequired
}

export default withRouter(Nav)
