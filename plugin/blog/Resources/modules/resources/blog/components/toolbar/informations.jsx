import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import Panel from 'react-bootstrap/lib/Panel'
import {t, trans} from '#/main/core/translation'
import {actions as listActions} from '#/main/core/data/list/actions'
import {actions} from '#/plugin/blog/resources/blog/actions.js'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'
import isEmpty from 'lodash/isEmpty'

const InformationsComponent = props =>
  <div className="panel panel-default">
    <div className="panel-heading">{trans('infobar', {}, 'icap_blog')}</div>
    <HtmlText className="panel-body">{props.infos}</HtmlText>
  </div>
    
InformationsComponent.propTypes = {
  infos: T.string
}

const Informations = connect(
  state => ({
    infos: !isEmpty(state.blog.data.options.data) ? state.blog.data.options.data.infos : state.blog.data.originalOptions.infos
  })
)(InformationsComponent)

export {Informations}