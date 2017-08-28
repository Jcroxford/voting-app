import React, {Component} from 'react'
import axios from 'axios'
import {HorizontalBar} from 'react-chartjs-2'

import {baseRoute} from '../../utils/api'

class PollDetail extends Component {
  constructor() {
    super()

    this.state = {
      pollOptions: [],
      selectedOptionId: 0,
      userHasVoted: false
    }

    this.handleSelectedOptionChange = this.handleSelectedOptionChange.bind(this)
    this.updateVotes = this.updateVotes.bind(this)
  }

  // *** render html ***
  renderVoteForm() {
    return (
      <form className="uk-form-stacked">

        <div className="uk-margin">
          <div className="uk-form-controls">
            {this.renderPollOptions()}
          </div>
        </div>

        <div className="uk-margin">
          <button className="uk-button uk-button-primary" onClick={this.updateVotes}>Vote</button>
        </div>

      </form>
    )
  }
  renderPollOptions() {
    return this.state.pollOptions.map(option => (
      <div className="uk-margin" key={option.id}>
        <label onClick={() => this.handleSelectedOptionChange(option.id)}>
          <input
            className="uk-radio" 
            type="radio"
            name="pollOption"
          />
          {` ${option.pollText}`}
        </label>
      </div>
      
    ))
  }

  renderPollResults() {
    const {pollOptions} = this.state
    const labels = pollOptions.map(option => option.pollText)
    const voteData = pollOptions.map(option => option.voteCount)
    const data = {
      labels,
      datasets: [
        {
          label: false,
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: voteData
        }
      ]
    }
    const options = {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            drawOnChartArea: false
          }
        }],
        yAxes: [{
          gridLines: {
            drawOnChartArea: false
          }
        }]
      }
    }

    return (
      <div>
        <HorizontalBar data={data} options={options} />
      </div>
    )
  }

  // *** event handlers & react functions ***
  handleSelectedOptionChange(optionId) {
    this.setState({ selectedOptionId: optionId })
  }

  updateVotes(e) {
    e.preventDefault()

    const poll = this
    const pollId = poll.props.match.params.pollId
    const {selectedOptionId, pollOptions} = this.state

    // stores and keeps track of a particular user's votes via localStorage
    // localVotes is an array of poll Ids
    let localVotes = JSON.parse(localStorage.getItem('localVotes')) || []

    if(localVotes.includes(pollId)) { return alert('you have already voted on this poll!') }

    axios.get(`${baseRoute}/api/poll/vote/${selectedOptionId}`)
      .then(response => {
        const pollOptionIndex = pollOptions.findIndex(option => option.id === selectedOptionId)

        pollOptions[pollOptionIndex].voteCount = response.data.updatedVoteCount

        poll.setState({ pollOptions, userHasVoted: true })

        // update local storage to prevent user from voting on a poll multiple times
        localVotes.push(pollId)
        localStorage.setItem('localVotes', JSON.stringify(localVotes))
      })
      .catch(error => console.log(error))
  }

  componentWillMount() {
    const poll = this
    const {pollId} = this.props.match.params

     // populate pollOptions
    axios.get(`${baseRoute}/api/polls/detail/${pollId}`)
      .then(response => poll.setState({ pollOptions: response.data.pollOptions }))
      .catch(error => console.log(error))

    // check localVotes for confirming wether or not use has voted
    const localVotes = JSON.parse(localStorage.getItem('localVotes')) || []

    const userHasVoted = ~localVotes.findIndex(votedPollId => votedPollId === pollId)
    
    this.setState({ userHasVoted })
  }

  render() {
    return (
      this.state.pollOptions.length === 0
      ? <div>Loading</div>
      : <div className="uk-flex uk-flex-center">
          <div className="uk-card uk-card-default uk-width-1-2@s uk-width-1-3@m uk-animation-slide-top">
            <div className="uk-card-header uk-card-primary">
              <h3 className="uk-card-title">{this.props.match.params.pollTitle}</h3>
            </div>
            
            <div className="uk-card-body">
              {this.state.userHasVoted ? this.renderPollResults() : this.renderVoteForm()}
            </div>
          </div>
        </div>
    )
  }
}

export default PollDetail
