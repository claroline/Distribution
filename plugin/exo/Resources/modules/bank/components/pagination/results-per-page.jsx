import React, { Component } from 'react'
import classes from 'classnames'

const T = React.PropTypes

export default class ResultsPerPages extends Component {
  render() {
    return(
      <div className="results-per-page">
        Results per page :&nbsp;

        {this.props.availableSizes.map((size, index) => (
          <button
            key={index}
            className={classes(
              'btn',
              'btn-sm',
              size === this.props.pageSize ? 'btn-primary' : 'btn-link'
            )}

            onClick={e => {
              e.stopPropagation()
              this.props.handlePageSizeUpdate(size)
            }}
          >
            {size}
          </button>
        ))}
      </div>
    )
  }
}

ResultsPerPages.propTypes = {
  availableSizes: T.arrayOf(T.number),
  pageSize: T.number,
  handlePageSizeUpdate: T.func.isRequired
}

ResultsPerPages.defaultProps = {
  availableSizes: [1, 10, 20, 50, 100],
  pageSize: 20
}