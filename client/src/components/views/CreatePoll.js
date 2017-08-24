import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import axios from 'axios'

import {baseRoute} from '../../utils/api'

class CreatePoll extends Component {
  constructor() {
    super()

    this.state = {
      title: '',
      options: [{ pollText: '' }]
    }

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleOptionChange = this.handleOptionChange.bind(this)
    this.renderOptions = this.renderOptions.bind(this)
    this.addOption = this.addOption.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleOptionChange(e) {
    const optionIndex = parseInt(e.target.name.replace(/option/, ''))
    const options = this.state.options

    options[optionIndex].pollText = e.target.value

    this.setState({ options })
  }

  removeOption(index) {
    const options = this.state.options

    options.splice(index, 1)

    this.setState({ options })
  }

  addOption() {
    const options = this.state.options
    options.push({ pollText: '' })

    this.setState({ options })
  }

  renderOptions() {
    return this.state.options.map((option, index) => (
      <div key={index}>
        <label htmlFor="option"><strong>option </strong></label>
        <input type="text" name={`option${index}`} value={option.pollText} onChange={this.handleOptionChange} />
        <button type="button" onClick={() => this.removeOption(index)}>remove</button>
        <br />
      </div>
    ))
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()

    const options = this.state.options.filter(option => option !== '')

    const data = { title: this.state.title, options }
    const token = JSON.parse(localStorage.getItem('userData')).token
    const config = { headers: { authorization: token } }

    axios.post(`${baseRoute}/api/user/createPoll`, data, config)
      .then(response => this.props.history.push('/'))
      .catch(error => console.log(error))
  }

  componentWillMount() {
    // check auth
    const userData = localStorage.getItem('userData')

    if(!userData) { this.props.history.push('/signin') }
  }
  
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="title"><strong>title </strong></label>
          <input type="text" name="title" onChange={this.handleTitleChange} />
<br />
          {this.renderOptions()}
          <button type="button" onClick={this.addOption}>Add Another Option</button>
<br />
          <button>Create Poll</button>
        </form>
      </div>
    )
  }
}

export default CreatePoll
