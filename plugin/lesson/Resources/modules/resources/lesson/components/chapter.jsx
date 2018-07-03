import React from 'react'
import {connect} from 'react-redux'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

const Chapter = props =>
  <HtmlText>
    {props.chapter.text ? props.chapter.text : ''}
  </HtmlText>

const ChapterResource = connect(
  state => ({
    chapter: state.chapter
  }),
  () => ({})
)(Chapter)

export {
  ChapterResource
}