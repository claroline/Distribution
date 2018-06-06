import React from 'react'
import {connect} from 'react-redux'
import {t, trans} from '#/main/core/translation'
import {url} from '#/main/app/api'

const Exporters = props =>
  <div className="panel panel-default">
    <div className="panel-heading">
      <a target="_blank" href={url(['icap_blog_rss', {blogId: props.blogId}])} className="label label-warning white export-links">
        <span className="fa fa-rss"></span> {trans('rss', {}, 'icap_blog')}
      </a>
      <a target="_blank" href={url(['icap_blog_pdf', {blogId: props.blogId}])} className="label label-pdf white export-links">
        <span className="fa fa-file-pdf-o"></span> {trans('pdf_export', {}, 'platform')}
      </a>
    </div>
  </div>

export {Exporters}