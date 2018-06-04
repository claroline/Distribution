import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import Panel from 'react-bootstrap/lib/Panel'
import {t, trans} from '#/main/core/translation'

const TagsComponent = props =>
  <Panel header="Nuage de tags">
  </Panel>
    
TagsComponent.propTypes = {
}

const Tags = connect(
  state => ({
  })
)(TagsComponent)

export {Tags}