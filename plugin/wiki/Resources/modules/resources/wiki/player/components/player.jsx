import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {Contents} from '#/plugin/wiki/resources/wiki/player/components/contents'
import {WikiSection} from '#/plugin/wiki/resources/wiki/player/components/wiki-section'
import {WikiSectionTree} from '#/plugin/wiki/resources/wiki/player/components/wiki-section-tree'

const PlayerComponent = props =>
  <div className={'wiki-overview'}>
    <WikiSection
      section={props.sections.tree}
      displaySectionNumbers={false}
      setSectionVisibility={null}
      num={[]}
    />
    <Contents sectionTree={props.sections.tree}/>
    <WikiSectionTree
      sections={props.sections}
    />
    
  </div>

PlayerComponent.propTypes = {
  'sections': T.object.isRequired
}

const Player = connect(
  state => ({
    sections: state.sections
  })
)(PlayerComponent)

export {
  Player
}