import React from 'react'
import {connect} from 'react-redux'

const Resource = () =>
  <p>Hello React!</p>

const LessonResource = connect(
  () => ({}),
  () => ({})
)(Resource)

export {
  LessonResource
}