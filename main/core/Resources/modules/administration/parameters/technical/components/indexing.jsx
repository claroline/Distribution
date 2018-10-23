import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

const IndexingComponent = (props) =>
  <div>
    Indexing
  </div>


IndexingComponent.propTypes = {
}

const Indexing = connect(
  null,
  dispatch => ({ })
)(IndexingComponent)

export {
  Indexing
}
