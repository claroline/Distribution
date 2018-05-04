import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import PanelGroup from 'react-bootstrap/lib/PanelGroup'
import Panel from 'react-bootstrap/lib/Panel'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'
import {Link} from '#/main/core/layout/button/components/link.jsx'
import {t, trans, transChoice} from '#/main/core/translation'
import isEmpty from 'lodash/isEmpty'
import {getUrl} from '#/main/core/api/router'


const ToolsComponent = props =>
  <PanelGroup>
    <div className="panel panel-default">
      <div className="panel-heading">
        <Link target={getUrl(['apiv2_blog_rss', {blogId: props.blogId}])} className="label label-warning white">
          <span className="fa fa-rss"></span> {trans('rss', {}, 'icap_blog')}
        </Link>
      </div>
    </div>
    <div className="panel panel-default">
      <div className="panel-heading">{trans('infobar', {}, 'icap_blog')}</div>
      <HtmlText className="panel-body">{props.infos}</HtmlText>
    </div>
    <Panel  header="Nuage de tags">
    </Panel>
    <Panel header="Rédacteurs">
    </Panel>
    <Panel header="Calendrier">
    </Panel>
    <Panel header="Archives">
    </Panel>
  </PanelGroup>

const Tools = connect(
  state => ({
    blogId: state.blog.data.id,
    infos: !isEmpty(state.blog.data.options.data) ? state.blog.data.options.data.infos : state.blog.data.originalOptions.infos
  })
  )(ToolsComponent)

export {Tools}