import React from 'react'
import {PropTypes as T} from 'prop-types'
import {WikiSection} from '#/plugin/wiki/resources/wiki/player/components/wiki-section'

const WikiSectionTree = props =>
  <div className="wiki-section-container">
    {
      props.sectionTree.children &&
      props.sectionTree.children.map(
        (section, index) =>
          <WikiSection
            id={section.id}
            key={section.id}
            num={[index + 1]}
            title={section.activeContribution.title}
            text={section.activeContribution.text}
            displaySectionNumbers={props.displaySectionNumbers}
            sections={section.children}
            canEdit={props.canEdit}
            loggedUserId={props.loggedUserId}
            mode={props.mode}
            visible={section.meta.visible}
            toggleVisibility={props.toggleVisibility}
          />
      )
    }
  </div>
  
WikiSectionTree.propTypes = {
  'sectionTree': T.object.isRequired,
  'displaySectionNumbers': T.bool.isRequired,
  'canEdit': T.bool.isRequired,
  'loggedUserId': T.oneOfType([() => null, T.string]),
  'mode': T.string.isRequired,
  'toggleVisibility': T.func.isRequired
}

WikiSectionTree.defaultProps = {
  'loggedUserId': null
}

export {
  WikiSectionTree
}