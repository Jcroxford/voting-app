import React, {Component} from 'react'
import {BrowserRouter as Router, Link} from 'react-router-dom'

class Nav extends Component {
  render() {
    return (
      <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/signin">Signin</Link></li>
            <li><Link to="/signup">SignUp</Link></li> 
            <li><Link to="/settings">settings</Link></li> 
          </ul>
      </div>
    )
  }
}

export default Nav
