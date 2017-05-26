import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {Date} from '#/plugin/exo/components/form/date.jsx'
import moment from 'moment'

class DateSearch extends Component {
  constructor(props) {
    super(props)
    this.state = {open: true}
  }

  openPicker() {
    this.setState({open: true})
  }

  closePicker() {
    this.setState({open: false})
  }

  render() {
    return(
      <span className="date-filter">
        {this.props.isValid &&
          <span className="available-filter-value">{this.props.search}</span>
        }
        &nbsp;
        <Date
          className="input-hide"
          showCalendarButton={true}
          onChange={(date) => {
            return this.props.updateSearch(date)
          }}
          minDate={moment.utc('1970')}
          name="filter-date"
          onBlur={() => alert('blur')}
          open={this.state.open}
        >
        </Date>
      </span>
    )
  }
}

DateSearch.propTypes = {
  search: T.string.isRequired,
  isValid: T.bool.isRequired,
  updateSearch: T.func.isRequired
}

export {DateSearch}
