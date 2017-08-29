import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link, withRouter} from 'react-router-dom'

import '../../styles/Nav.css'

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
    const currentPath = this.props.location.pathname

    return (
      <div>
        <nav className="uk-navbar uk-navbar-container">
          <div className="uk-navbar-left">
            
          </div>
          <div className="uk-navbar-right">
            <ul className="uk-navbar-nav">
              <li className={currentPath === '/' ? 'uk-active' : ''}><Link to="/">Home</Link></li>
              <li className={currentPath === '/polls' ? 'uk-active' : ''}><Link to="/polls">All Polls</Link></li>
              {authenticated ? '' : <li className={currentPath === '/signin' ? 'uk-active' : ''}><Link to="/signin">Signin</Link></li>}
              {authenticated ? '' : <li className={`uk-margin-right ${currentPath === '/signup' ? 'uk-active' : ''}`}><Link to="/signup">Signup</Link></li>}
              {authenticated ? <li className={currentPath === '/settings' ? 'uk-active' : ''}><Link to="/settings">Settings</Link></li> : ''}
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
