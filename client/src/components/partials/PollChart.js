import React from 'react'
import PropTypes from 'prop-types'
import {HorizontalBar} from 'react-chartjs-2'

const PollChart = (props) => {
  const {pollOptions} = props

  const data = {
    labels: pollOptions.map(option => option.pollText),
    datasets: [
      {
        label: false,
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: pollOptions.map(option => option.voteCount)
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
