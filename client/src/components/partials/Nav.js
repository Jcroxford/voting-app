import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link, withRouter} from 'react-router-dom'

class Nav extends Component {
  constructor(props) {
    super(props)

    this.handleSignout = this.handleSignout.bind(this)
  }

  handleSignout() {
    localStorage.removeItem('userData')
    this.props.updateAuth('', false)

    this.props.history.push('/')
  }

  render() {
    const authenticated = this.props.authenticated

    return (
      <div>
        <nav className="uk-navbar uk-navbar-container uk-box-shadow-medium" uk-navbar>
          <div className="uk-navbar-right">
            <ul className="uk-navbar-nav">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/polls">All Polls</Link></li>
              {authenticated ? '' : <li><Link to="/signin">Signin</Link></li>}
              {authenticated ? '' : <li className="uk-margin-right"><Link to="/signup">Signup</Link></li>}
              {authenticated ? <li><Link to="/settings">Settings</Link></li> : ''}
              {authenticated ? <li className="uk-margin-right"><a onClick={this.handleSignout}>Sign Out</a></li> : ''}
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

Nav.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  updateAuth: PropTypes.func.isRequired
}

export default withRouter(Nav)
