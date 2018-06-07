import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {hasPermission} from '#/main/core/resource/permissions'
import {currentUser} from '#/main/core/user/current'
import {selectors as resourceSelect} from '#/main/core/resource/store'
import {Contents} from '#/plugin/wiki/resources/wiki/player/components/contents'
import {WikiSection} from '#/plugin/wiki/resources/wiki/player/components/wiki-section'
import {WikiSectionTree} from '#/plugin/wiki/resources/wiki/player/components/wiki-section-tree'

const loggedUser = currentUser()

const PlayerComponent = props =>
  <div className={'wiki-overview'}>
    <WikiSection
      id={props.sectionTree.id}
      title={props.sectionTree.activeContribution.title}
      text={props.sectionTree.activeContribution.text}
      sections={[]}
      displaySectionNumbers={false}
      num={[0]}
      canEdit={props.canEdit}
      loggedUserId={loggedUser === null ? null : loggedUser.id}
      mode={props.mode}
      visible={props.sectionTree.meta.visible}
    />
    <Contents sectionTree={props.sectionTree}/>
    <WikiSectionTree
      sectionTree={props.sectionTree}
      displaySectionNumbers={props.display.sectionNumbers}
      canEdit={props.canEdit}
      loggedUserId={loggedUser === null ? null : loggedUser.id}
      mode={props.mode}
      toggleVisibility={props.toggleVisibility}
    />
    
  </div>

PlayerComponent.propTypes = {
  'sectionTree': T.object.isRequired,
  'display': T.object.isRequired,
  'canEdit': T.bool.isRequired,
  'mode': T.string.isRequired,
  'toggleVisibility': T.func.isRequired
}

const Player = connect(
  state => ({
    canEdit: hasPermission('edit', resourceSelect.resourceNode(state)),
    sectionTree: state.sectionTree,
    display: state.wiki.display,
    mode: state.wiki.mode
  }),
  dispatch => (
    {
      toggleVisibility: (sectionId, visible) => dispatch(sectionId, visible)
    }
  )
)(PlayerComponent)

export {
  Player
}