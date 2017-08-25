import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class Nav extends Component {
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
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

export default Nav
