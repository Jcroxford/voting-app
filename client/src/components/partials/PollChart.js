import React from 'react'
import PropTypes from 'prop-types'
import {HorizontalBar} from 'react-chartjs-2'

const PollChart = (props) => {
  const {pollOptions} = props

  const voteCounts = pollOptions.map(option => option.voteCount)
  const totalVotes = voteCounts.reduce((sum, voteCount) => sum += voteCount)
  const labels = pollOptions.map(option => `${option.pollText} ${Math.round((option.voteCount / totalVotes) * 100)}%`)
  
  const data = {
    labels,
    datasets: [
      {
        label: false,
        backgroundColor: 'rgba(30,135,240,0.2)',
        borderColor: 'rgba(30,135,240,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(30,135,240,0.4)',
        hoverBorderColor: 'rgba(30,135,240,1)',
        data: voteCounts
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
          },
          ticks: {
            beginAtZero: true,
            userCallback: (label) => Math.floor(label) === label ? label : null
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
    <HorizontalBar data={data} options={options} />
  )
}

PollChart.PropTypes ={
  pollOptions: PropTypes.array.isRequired
}

export default PollChart
