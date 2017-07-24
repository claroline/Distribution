import {connect} from 'react-redux'
import React, {Component, PropTypes as T} from 'react'
import moment from 'moment'
import classes from 'classnames'
import ReactDOM from 'react-dom'

class OrganizationPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: {}
    }
  }

  render() {
    return (
      <div>
          yololololol
      </div>
    )
  }
}

OrganizationPicker.propTypes = {
}

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const ConnectedOrganizationPicker = connect(mapStateToProps, mapDispatchToProps)(OrganizationPicker)

export {ConnectedOrganizationPicker as OrganizationPicker}
