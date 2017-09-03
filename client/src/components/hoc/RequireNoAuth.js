import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'

export default (ComposedComponent) => {
  class RequireNoAuth extends Component {
    
    checkAuth() {
      const userData = localStorage.getItem('userData')

      if(userData) { this.props.history.push('/') }
    }
    
    componentWillMount() {
      this.checkAuth()
    }
    
    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  return withRouter(RequireNoAuth)
}
