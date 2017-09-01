import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import '../../styles/MobileNav.css'

class MobileNav extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.refs.ukOffcanvas.setAttribute('uk-offcanvas', '')
  }

  render() {
    const {currentPath, authenticated} = this.props

    return (
      <div className="uk-offcanvas-content">

        <div id="offcanvas-usage" ref="ukOffcanvas">
          <div className="uk-offcanvas-bar">

            <ul className="uk-nav uk-nav-default">
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

          </div>
        </div>

      </div>
    )
  }
}

MobileNav.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  updateAuth: PropTypes.func.isRequired
}

export default MobileNav
