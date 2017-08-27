import React, {Component} from 'react'
import axios from 'axios'

import {baseRoute} from '../../utils/api'

class Polls extends Component {
  constructor() {
    super()

    this.state = {
      polls: [],
      page: 1,
      totalPages: 1,
      fetchingPolls: false
    }

    this.handleScroll = this.handleScroll.bind(this)
    this.getPolls = this.getPolls.bind(this)
  }

  getPolls() {
    const self = this
    axios.get(`${baseRoute}/api/polls/${this.state.page}`)
      .then(response => {
        const polls = self.state.polls
        for(const poll of response.data.polls) {
          polls.push(poll)
        }
        
        self.setState({ polls, totalPages: Math.ceil(response.data.totalPolls / 36), fetchingPolls: false })
      })
      .catch(error => console.log(error))
  }

  renderPolls() {
    return this.state.polls.map(poll => {
      return (
        <div key={poll.id}>
          <div 
            className="uk-card uk-card-default uk-margin-bottom uk-card-hover uk-animation-fade" 
            onClick={() => this.props.history.push(`/poll/${poll.id}`)}
          >
            <div className="uk-card-body">
              {poll.title}
            </div>    
          </div>
        </div>
      )
    })
  }

  handleScroll() {
    const clientHeight = document.documentElement.clientHeight
    const amountScrolled = document.body.scrollTop
    const closeToPageBottom = document.body.scrollHeight - 150
    const { page, totalPages } = this.state

    if(clientHeight + amountScrolled >= closeToPageBottom && page < totalPages && !this.state.fetchingPolls) {
      this.setState({ page: page + 1, fetchingPolls: true })
      this.getPolls()
    }
  }

  componentWillMount() {
    this.getPolls()
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    return (
      this.state.polls.length === 0
      ? <div className="uk-spinner"></div>
      : <div>
          <div className="uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-4@l uk-grid">
            {this.renderPolls()}
          </div>
          {/* {this.state.fetchingPolls ? <div className="uk-spinner uk-center-text">uk spinner should be here</div> : ''} FIXME: uk-spinner can't be added */}
        </div>
    )
  }
}

export default Polls
