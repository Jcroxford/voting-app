import React, {Component} from 'react'
import axios from 'axios'

import {baseRoute} from '../../utils/api'

class UserPolls extends Component {
  constructor() {
    super()

    this.state = { polls: [] }

    this.getPolls = this.getPolls.bind(this)
    this.deletePoll = this.deletePoll.bind(this)
  }

  getPolls() {
    const self = this
    const token = JSON.parse(localStorage.getItem('userData')).token

    axios.get(`${baseRoute}/api/user/polls/`, { headers: { authorization: token } })
      .then(response => self.setState({ polls: response.data.polls }))
      .catch(error => console.log(error))
  }

  deletePoll(pollId) {
    const self = this
    const token = JSON.parse(localStorage.getItem('userData')).token

    axios.get(`${baseRoute}/api/user/poll/delete/${pollId}`, { headers: { authorization: token } })
      .then(response => {
        if(!response.data.success) { return }

        const polls = self.state.polls
        const deletedPollIndex = polls.indexOf(poll => poll.id === pollId)
        polls.splice(deletedPollIndex, 1)

        this.setState({ polls })
      })
      .catch(error => console.log(error))
    
  }

  renderPolls() {
    return this.state.polls.map(poll => (
      <div key={poll.id}>
        <div 
          className="uk-card uk-card-default uk-margin-bottom uk-card-hover uk-animation-fade" 
          onClick={() => this.props.history.push(`/poll/${poll.id}`)}
        >
          
          <div className="uk-card-body">
            {poll.title}
          </div>

          <div className="uk-card-footer">
            <button 
              className="uk-button uk-button-small uk-button-danger" 
              onClick={() => this.deletePoll(poll.id)}
            >
              Delete
            </button>
          </div>

        </div>
      </div>
    ))
  }
  
  componentWillMount() {
    // check auth
    const userData = localStorage.getItem('userData')
    if(!userData) { return this.props.history.push('/signin') }

    this.getPolls()
  }

  render() {
    return (
      this.state.polls.length === 0
      ? <div className="uk-text-center" ref="ukSpinner"></div>
      : <div>
          <div className="uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-4@l uk-grid">
            
            {this.renderPolls()}

          </div>
        </div>
    )
  }
}

export default UserPolls
