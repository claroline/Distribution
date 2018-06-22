import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {Contents} from '#/plugin/wiki/resources/wiki/player/components/contents'
import {WikiSection} from '#/plugin/wiki/resources/wiki/player/components/wiki-section'
import {WikiSectionTree} from '#/plugin/wiki/resources/wiki/player/components/wiki-section-tree'
import {actions} from '#/plugin/wiki/resources/wiki/player/store'

class PlayerComponent extends Component {
  constructor(props) {
    super(props)
    
    this.reload()
  }
  
  reload() {
    if (this.props.sections.invalidated) {
      this.props.fetchSectionTree(this.props.wiki.id)
    }
  }
  
  render() {
    return (
      <div className={'wiki-overview'}>
        <WikiSection
          section={this.props.sections.tree}
          displaySectionNumbers={false}
          setSectionVisibility={null}
          num={[]}
        />
        {this.props.wiki.display.contents &&
        <Contents sectionTree={this.props.sections.tree}/>
        }
        <WikiSectionTree
          sections={this.props.sections}
        />
      </div>
    )
  }
}

PlayerComponent.propTypes = {
  'sections': T.object.isRequired,
  'wiki': T.object.isRequired,
  'fetchSectionTree': T.func.isRequired
}

const Player = connect(
  state => ({
    sections: state.sections,
    wiki: state.wiki
  }),
  dispatch => ({
    fetchSectionTree: wikiId => dispatch(actions.fetchSectionTree(wikiId))
  })
)(PlayerComponent)

export {
  Player
}