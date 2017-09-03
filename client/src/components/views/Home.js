import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'

import UserPolls from './UserPolls'

import '../../styles/Home.css'

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = { username: '' }

    this.updatePageAttributes = this.updatePageAttributes.bind(this)
  }

  updatePageAttributes() {
    if(!this.props.authenticated) {
      this.refs.ukScrollspy.setAttribute('uk-scrollspy', 'target: > div; cls:uk-animation-scale-up uk-transform-origin-bottom-right; delay: 100')
      this.refs.ukIconBolt.setAttribute('uk-icon', 'icon: bolt; ratio: 5;')
      this.refs.ukGithub.setAttribute('uk-icon', 'icon: github; ratio: 5;')
      this.refs.ukDatabase.setAttribute('uk-icon', 'icon: database; ratio: 5;')
    } else {
      this.refs.ukGrid.setAttribute('uk-grid', '')
    }
  }

  componentWillMount() {
    if (!this.props.authenticated) { return }

    const userData = JSON.parse(localStorage.getItem('userData'))
    
    this.setState({ username: userData.username })
  }

  componentDidMount() {
    this.updatePageAttributes()
  }

  componentDidUpdate() {
    this.updatePageAttributes()
  }

  render() {
    return (
      !this.props.authenticated
        ? <div>

             <div className="uk-section uk-section-large uk-section-media uk-background-cover banner-image">
              <div className="uk-container banner-info">

                <div className="uk-flex uk-flex-center uk-light">
                  <h3>VoteHub</h3>
                </div>

                <div className="uk-flex uk-flex-center uk-light uk-padding-left uk-padding-right">
                  <p>The free and easy to use voting app</p>
                </div>

                <div className="uk-flex uk-flex-center">
                  <button 
                    className="uk-button uk-button-primary uk-margin-right"
                    onClick={() => this.props.history.push('/signup')}
                  >
                    Signup
                  </button>
                </div>                  

              </div>
            </div>

            <div className="uk-child-width-1-3@s uk-grid uk-text-center uk-margin" ref="ukScrollspy">

              <div className="uk-margin-top">
                <div><span className="bolt-icon" ref="ukIconBolt"></span></div>
                <h3>Fast Results</h3>
                <p>Poll owner or not, get the most recent poll results the moment you cast your vote or view the poll.</p>
              </div>
              
              <div className="uk-margin-top">
                <div><span className="github-icon" ref="ukGithub"></span></div>
                <h3>Open Source</h3>
                <p>This app is open source and free to use! No monthly subscriptions to hold you back here.</p>
              </div>

              <div className="uk-margin-top">
                <div><span className="database-icon" ref="ukDatabase"></span></div>
                <h3>Persistant Storage</h3>
                <p>Results for all polls are stored on our database and can be accessed at any time. For free!</p>
              </div>

            </div>
            
          </div>
        : <div>

            <div className="uk-flex uk-flex-center uk-text-center">
              <div className="uk-section uk-section-muted uk-margin">
                <div className="uk-container">
                  
                  <h3 className="">Hello {this.state.username}</h3>

                  <div className="uk-grid-match uk-child-width-1-1@m uk-text-center" ref="ukGrid">
                    <div>
                      <button 
                        className="uk-button uk-button-primary"
                        onClick={() => this.props.history.push('/createPoll')}
                      >
                        Create New Poll
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <UserPolls />
          </div>
    )
  }
}

export default withRouter(Home)
