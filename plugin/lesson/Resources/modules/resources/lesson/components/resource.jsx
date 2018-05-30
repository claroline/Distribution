import React from 'react'
import {connect} from 'react-redux'

const Resource = props =>
  <p>Hello React!</p>

const LessonResource = connect(
  (state) => ({}),
  (dispatch) => ({})
)(Resource)

export {
  LessonResource
}