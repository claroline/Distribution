import React from 'react'
import {PropTypes as T} from 'prop-types'
import {WikiSection} from '#/plugin/wiki/resources/wiki/player/components/wiki-section'

const WikiSectionTree = props =>
  <div className="wiki-section-container">
    {
      props.sections.tree.children &&
      props.sections.tree.children.map(
        (section, index) =>
          <WikiSection
            key={section.id}
            num={[index + 1]}
            section={section}
            displaySectionNumbers={props.displaySectionNumbers}
            canEdit={props.canEdit}
            loggedUserId={props.loggedUserId}
            currentEditSection={props.sections.currentSection}
            mode={props.mode}
            toggleSectionVisibility={props.toggleSectionVisibility}
            editSection={props.editSection}
            addSection={props.addSection}
          />
      )
    }
  </div>
  
WikiSectionTree.propTypes = {
  'sections': T.object.isRequired,
  'displaySectionNumbers': T.bool.isRequired,
  'canEdit': T.bool.isRequired,
  'loggedUserId': T.oneOfType([() => null, T.string]),
  'mode': T.string.isRequired,
  'toggleSectionVisibility': T.func.isRequired,
  'editSection': T.func.isRequired,
  'addSection': T.func.isRequired
}

WikiSectionTree.defaultProps = {
  'loggedUserId': null
}

export {
  WikiSectionTree
}