import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import PanelGroup from 'react-bootstrap/lib/PanelGroup'
import Panel from 'react-bootstrap/lib/Panel'
import {Link} from '#/main/core/layout/button/components/link.jsx'
import {t, trans, transChoice} from '#/main/core/translation'
import {getUrl} from '#/main/core/api/router'
import {BlogCalendar} from '#/plugin/blog/resources/blog/components/toolbar/calendar.jsx'
import {Redactors} from '#/plugin/blog/resources/blog/components/toolbar/redactors.jsx'
import {Informations} from '#/plugin/blog/resources/blog/components/toolbar/informations.jsx'
import {Tags} from '#/plugin/blog/resources/blog/components/toolbar/tags.jsx'

const ToolsComponent = props =>
  <PanelGroup>
    <div className="panel panel-default">
      <div className="panel-heading">
        <a target="_blank" href={getUrl(['icap_blog_rss', {blogId: props.blogId}])} className="label label-warning white export-links">
          <span className="fa fa-rss"></span> {trans('rss', {}, 'icap_blog')}
        </a>
        <a target="_blank" href={getUrl(['icap_blog_pdf', {blogId: props.blogId}])} className="label label-pdf white export-links">
          <span className="fa fa-file-pdf-o"></span> {trans('pdf_export', {}, 'platform')}
        </a>
      </div>
    </div>
    <Informations />
    <Tags />
    <Redactors />
    <BlogCalendar />
  </PanelGroup>
      
ToolsComponent.propTypes = {
  blogId: T.string
}

const Tools = connect(
  state => ({
    blogId: state.blog.data.id
  })
  )(ToolsComponent)

export {Tools}