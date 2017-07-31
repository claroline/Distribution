import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {DataList} from '#/main/core/layout/list/components/data-list.jsx'

const DataListContainer = props =>
  <DataList

  />

DataListContainer.propTypes = {
  filterable: T.bool,
  sortable: T.bool,
  pageable: T.bool,
  selectAction: T.arrayOf(T.object),
}

function mapStateToProps(state) {
  return {
    modal: modalSelect.modal(state),
    resourceNode: resourceSelect.resourceNode(state)
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {

  }
}

// connects the container to redux
const ConnectedResource = connect(
  mapStateToProps,
  mapDispatchToProps
)(Resource)

export {ConnectedResource as Resource}