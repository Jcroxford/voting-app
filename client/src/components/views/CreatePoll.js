import React, {Component} from 'react'
import axios from 'axios'

import {baseRoute} from '../../utils/api'

class CreatePoll extends Component {
  constructor() {
    super()

    this.state = {
      title: '',
      options: [{ pollText: '' }, { pollText: '' }, { pollText: '' }]
    }

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleOptionChange = this.handleOptionChange.bind(this)
    this.renderOptions = this.renderOptions.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleOptionChange(e) {
    // eslint-disable-next-line
    const optionIndex = parseInt(e.target.name.replace(/option/, ''))
    const options = this.state.options

    options[optionIndex].pollText = e.target.value

    // dynamically add extra poll if needed
    if(optionIndex === options.length - 1) { options.push({ pollText: '' }) }

    this.setState({ options })
  }

  renderOptions() {
    const numOfDefaultOptions = 3 // when component is first rendered

    return this.state.options.map((option, index) => (
      <div 
        className={`uk-margin ${index >= numOfDefaultOptions ? 'uk-animation-slide-top' : ''}`}
        key={index}
      >
        <input 
          className="uk-input" 
          type="text" 
          name={`option${index}`}
          value={option.pollText}
          placeholder="Enter Poll Option"
          onChange={this.handleOptionChange} 
        />
      </div>
    ))
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()

    const title = this.state.title
    const options = this.state.options.filter(option => option.pollText !== '')

    if(!title) { return alert('please provide a title for your poll')}
    if(options.length < 2) { return alert('Please provide at least 2 poll options') }

    const data = { title, options }
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
      <div className="uk-flex uk-flex-center">
        <div className="uk-card uk-card-default uk-width-1-2@s uk-width-1-3@m uk-animation-slide-top-medium">
          <div className="uk-card-header uk-card-primary">
            <h3 className="card-title">Create Poll</h3>
          </div>

          <div className="uk-card-body">
            <form onSubmit={this.handleSubmit} className="uk-form-stacked">
              {this.state.invalidSubmission
                ? <div className="uk-margin uk-text-danger uk-animation-slide-bottom">{this.state.submissionError}</div> 
                : ''
              }
              
              <div className="uk-margin">
                <input 
                  className="uk-input uk-form-large" 
                  type="text" 
                  name="title" 
                  placeholder="Poll Title"
                  onChange={this.handleTitleChange}
                />
              </div>

              {this.renderOptions()}

              <div className="uk-margin">
                <button className="uk-button uk-button-primary">Create Poll</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default CreatePoll
