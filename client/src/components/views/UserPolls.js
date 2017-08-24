import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

import {baseRoute} from '../../utils/api'

class UserPolls extends Component {
  constructor() {
    super()

    this.state = { polls: [] }

    this.getPills = this.getPolls.bind(this)
  }

  getPolls() {
    const self = this
    const token = JSON.parse(localStorage.getItem('userData')).token
    axios.get(`${baseRoute}/api/user/polls/`, { headers: { authorization: token } })
      .then(response => self.setState({ polls: response.data.polls }))
      .catch(error => console.log(error))
  }

  renderPolls() {
    return this.state.polls.map(poll => <li key={poll.id}><strong>title</strong><Link to={`/poll/${poll.id}`}> {poll.title}</Link></li>)
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
      ? <div>user polls page</div>
      : <div>
          <ul>
            {this.renderPolls()}
          </ul>
        </div>
    )
  }
}

export default UserPolls
