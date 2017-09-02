import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link, withRouter} from 'react-router-dom'

import '../../styles/Nav.css'

class Nav extends Component {
  constructor(props) {
    super(props)

    this.handleSignout = this.handleSignout.bind(this)
    this.renderNavLinks = this.renderNavLinks.bind(this)
  }

  handleSignout() {
    localStorage.removeItem('userData')
    this.props.updateAuth('', false)

    this.props.history.push('/')
  }

  componentDidMount() {
    this.refs.ukToggle.setAttribute('uk-toggle', 'target: #offcanvas-usage')
    this.refs.ukMenu.setAttribute('uk-icon', 'icon: menu')
    this.refs.ukOffcanvas.setAttribute('uk-offcanvas', '')
  }

  render() {
    const authenticated = this.props.authenticated
    const currentPath = this.props.location.pathname

    return (
      <div>

        {/* 
          * ==============================
          * web(non mobile) nav 
          * ==============================
          */}          
        <nav className="uk-navbar uk-navbar-container">

          <div className="uk-navbar-left">

            <strong><Link to="/" className="uk-navbar-item uk-logo uk-margin-left">VoteHub</Link></strong>

          </div>

          <div className="uk-navbar-right">

            <ul className="uk-navbar-nav">
              <li className={currentPath === '/' ? 'uk-active' : ''}><Link to="/">Home</Link></li>
              <li className={currentPath === '/polls' ? 'uk-active' : ''}><Link to="/polls">All Polls</Link></li>
              {
                authenticated 
                  ? '' 
                  : <li 
                      className={currentPath === '/signin' ? 'uk-active' : ''}
                    >
                      <Link to="/signin">Signin</Link>
                    </li>
              }
              {
                authenticated 
                  ? '' 
                  : <li
                      className={`uk-margin-right ${currentPath === '/signup' ? 'uk-active' : ''}`}
                    >
                      <Link to="/signup">Signup</Link>
                    </li>
              }
              {
                authenticated
                  ? <li 
                      className={currentPath === '/settings' ? 'uk-active' : ''}
                    >
                      <Link to="/settings">Settings</Link>
                    </li>
                  : ''
              }
              {
                authenticated
                  ? <li className="uk-margin-right">
                      <a onClick={this.handleSignout}>Sign Out</a>
                    </li>
                  : ''
              }
            </ul>

            {/* toggles mobile nav */}
            <a 
              className="uk-margin-small-right display-mobile-nav"
              type="button"
              ref="ukToggle"
            >
              <span ref="ukMenu" className="mobile-menu-hamburger"></span>
            </a>

          </div>
        </nav>

        {/* 
          * ==============================
          * mobile nav 
          * ==============================
          *
          * mobile nav uses a tags instead of Link tags to make page referesh
          * (this is done to remove mobile menu tray) 
          */}
        <div className="uk-offcanvas-content">

          <div id="offcanvas-usage" ref="ukOffcanvas">
            <div className="uk-offcanvas-bar">

              <ul className="uk-nav uk-nav-default">
                  <li className={currentPath === '/' ? 'uk-active' : ''}><a href="/">Home</a></li>
                <li className={currentPath === '/polls' ? 'uk-active' : ''}><a href="/polls">All Polls</a></li>
                {
                  authenticated 
                    ? '' 
                    : <li 
                        className={currentPath === '/signin' ? 'uk-active' : ''}
                      >
                        <a href="/signin">Signin</a>
                      </li>
                }
                {
                  authenticated 
                    ? '' 
                    : <li
                        className={`uk-margin-right ${currentPath === '/signup' ? 'uk-active' : ''}`}
                      >
                        <a href="/signup">Signup</a>
                      </li>
                }
                {
                  authenticated
                    ? <li 
                        className={currentPath === '/settings' ? 'uk-active' : ''}
                      >
                        <a href="/settings">Settings</a>
                      </li>
                    : ''
                }
                {
                  authenticated
                    ? <li className="uk-margin-right">
                        <a onClick={this.handleSignout}>Sign Out</a>
                      </li>
                    : ''
                }
              </ul>

            </div>
          </div>

        </div>

      </div>
    )
  }
}

Nav.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  updateAuth: PropTypes.func.isRequired
}

export default withRouter(Nav)
