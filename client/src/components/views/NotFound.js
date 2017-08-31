import React from 'react'
import {withRouter} from 'react-router-dom'

const NotFound = (props) => {
  return (
    <div className="uk-grid uk-flex uk-flex-center uk-text-center">
      <div className="uk-width-1-1 uk-margin">
        <h1 className="uk-text-bold uk-margin">404</h1>
      </div>

      <div className="uk-width-1-1 uk-margin">
        <p>The Page You Requested Does Not Exist.</p>
      </div>

      <div className="uk-width-1-1 uk-margin ">
        <button
          className="uk-button uk-button-primary"
          onClick={() => props.history.push('/')}
        >
          Take Me Back Home
        </button>
      </div>
    </div>
  )
}

export default withRouter(NotFound)
