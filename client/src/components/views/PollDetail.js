import React, {Component} from 'react'
import axios from 'axios'

import {baseRoute} from '../../utils/api'

class PollDetail extends Component {
  constructor() {
    super()

    this.state = {
      pollOptions: []
    }

    this.renderPollOptions = this.renderPollOptions.bind(this)
    this.updateVotes = this.updateVotes.bind(this)
  }

  renderPollOptions() {
    return this.state.pollOptions.map(option => (
      <li key={option.id}>
        <strong 
          onClick={() => this.updateVotes(option.id)} 
          style={ { cursor: 'pointer' } }
        >
          Vote
        </strong>
        {` ${option.pollText}`} vote count {option.voteCount}
      </li>
    ))
  }

  updateVotes(optionId) {
    const poll = this
    const pollId = poll.props.match.params.pollId

    // stores and keeps track of a particular user's votes via localStorage
    let localVotes = JSON.parse(localStorage.getItem('localVotes'))

    // localVotes is an array of poll Ids
    if(!localVotes) { localVotes = [] }

    if(localVotes.includes(pollId)) { return alert('you have already voted on this poll!') }

    axios.get(`${baseRoute}/api/poll/vote/${optionId}`)
      .then(response => {
        const pollOptions = poll.state.pollOptions
        const pollOptionIndex = pollOptions.findIndex(option => option.id === optionId)

        pollOptions[pollOptionIndex].voteCount = response.data.updatedVoteCount

        poll.setState({ pollOptions })

        // update local storage to prevent user from voting on a poll multiple times
        localVotes.push(pollId)
        localStorage.setItem('localVotes', JSON.stringify(localVotes))
      })
      .catch(error => console.log(error))
  }

  componentWillMount() {
    const poll = this
    axios.get(`${baseRoute}/api/polls/detail/${this.props.match.params.pollId}`)
      .then(response => poll.setState({ pollOptions: response.data.pollOptions }))
      .catch(error => console.log(error))
  }

  render() {
    return (
      this.state.pollOptions.length === 0
      ? <div>poll detail page</div>
      : <div>
          <ul>
            {this.renderPollOptions()}
          </ul>
        </div>
    )
  }
}

export default PollDetail
