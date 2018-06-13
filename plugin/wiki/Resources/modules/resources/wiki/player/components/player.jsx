import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {hasPermission} from '#/main/core/resource/permissions'
import {currentUser} from '#/main/core/user/current'
import {selectors as resourceSelect} from '#/main/core/resource/store'
import {Contents} from '#/plugin/wiki/resources/wiki/player/components/contents'
import {WikiSection} from '#/plugin/wiki/resources/wiki/player/components/wiki-section'
import {WikiSectionTree} from '#/plugin/wiki/resources/wiki/player/components/wiki-section-tree'
import {actions} from '#/plugin/wiki/resources/wiki/player/store'

const loggedUser = currentUser()

const PlayerComponent = props =>
  <div className={'wiki-overview'}>
    <WikiSection
      section={props.sections.tree}
      displaySectionNumbers={false}
      num={[]}
      canEdit={props.canEdit}
      loggedUserId={loggedUser === null ? null : loggedUser.id}
      currentEditSection={props.sections.currentSection}
      mode={props.mode}
      editSection={props.editSection}
      addSection={props.addSection}
      
    />
    <Contents sectionTree={props.sections.tree}/>
    <WikiSectionTree
      sections={props.sections}
      displaySectionNumbers={props.display.sectionNumbers}
      canEdit={props.canEdit}
      loggedUserId={loggedUser === null ? null : loggedUser.id}
      currentEditSection={props.sections.currentSection}
      mode={props.mode}
      toggleSectionVisibility={props.toggleSectionVisibility}
      editSection={props.editSection}
      addSection={props.addSection}
    />
    
  </div>

PlayerComponent.propTypes = {
  'sections': T.object.isRequired,
  'display': T.object.isRequired,
  'canEdit': T.bool.isRequired,
  'mode': T.string.isRequired,
  'toggleSectionVisibility': T.func.isRequired,
  'editSection': T.func.isRequired,
  'addSection': T.func.isRequired,
  'deleteSection': T.func.isRequired
}

const Player = connect(
  state => ({
    canEdit: hasPermission('edit', resourceSelect.resourceNode(state)),
    sections: state.sections,
    display: state.wiki.display,
    mode: state.wiki.mode
  }),
  dispatch => (
    {
      toggleSectionVisibility: (sectionId, visible) => dispatch(sectionId, visible),
      currentSection: (sectionId) => dispatch(actions.updateEditSection(sectionId)),
      addSection: (parentId) => dispatch(actions.addSection(parentId)),
      editSection: (parentId) => dispatch(parentId),
      deleteSection: (sectionId) => dispatch(sectionId)
    }
  )
)(PlayerComponent)

export {
  Player
}