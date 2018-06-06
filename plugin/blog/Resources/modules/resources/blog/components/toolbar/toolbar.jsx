import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import PanelGroup from 'react-bootstrap/lib/PanelGroup'
import Panel from 'react-bootstrap/lib/Panel'
import {t, trans, transChoice} from '#/main/core/translation'
import {BlogCalendar} from '#/plugin/blog/resources/blog/components/toolbar/calendar.jsx'
import {Redactors} from '#/plugin/blog/resources/blog/components/toolbar/redactors.jsx'
import {Informations} from '#/plugin/blog/resources/blog/components/toolbar/informations.jsx'
import {Exporters} from '#/plugin/blog/resources/blog/components/toolbar/exporters.jsx'
import {Tags} from '#/plugin/blog/resources/blog/components/toolbar/tags.jsx'

const ToolsComponent = props =>
  <PanelGroup>
    <Exporters />
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