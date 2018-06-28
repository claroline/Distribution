import React from 'react'
import {connect} from 'react-redux'
import {trans} from '#/main/core/translation'
import {url} from '#/main/app/api'
import {PropTypes as T} from 'prop-types'

const ExportersComponent = props =>
  <div className="panel panel-default">
    <div className="panel-heading">
      <a target="_blank" rel="noopener noreferrer" href={url(['icap_blog_rss', {blogId: props.blogId}])} className="label label-warning white export-links">
        <span className="fa fa-rss"></span> {trans('rss_label', {}, 'icap_blog')}
      </a>
      <a target="_blank" rel="noopener noreferrer" href={url(['icap_blog_pdf', {blogId: props.blogId}])} className="label label-pdf white export-links">
        <span className="fa fa-file-pdf-o"></span> {trans('pdf_export', {}, 'platform')}
      </a>
    </div>
  </div>
        
ExportersComponent.propTypes = {
  blogId: T.string.isRequired
}

const Exporters = connect(
  state => ({
    blogId: state.blog.data.id
  })
)(ExportersComponent)

export {Exporters}