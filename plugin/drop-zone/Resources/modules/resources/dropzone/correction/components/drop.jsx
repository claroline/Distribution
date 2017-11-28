import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {DropzoneType, DropType} from '#/plugin/drop-zone/resources/dropzone/prop-types'
import {select} from '#/plugin/drop-zone/resources/dropzone/selectors'
import {actions} from '#/plugin/drop-zone/resources/dropzone/correction/actions'
import {Documents} from '#/plugin/drop-zone/resources/dropzone/components/documents.jsx'
import {Corrections} from '#/plugin/drop-zone/resources/dropzone/correction/components/corrections.jsx'
import {CorrectionCreation} from '#/plugin/drop-zone/resources/dropzone/correction/components/correction-creation.jsx'

const Drop = props =>
  <div id="drop-container">
    <Documents
      documents={props.drop.documents || []}
      showTools={true}
      tools={props.tools}
      executeTool={props.executeTool}
    />
    {props.drop.corrections && props.drop.corrections.length > 0 &&
      <Corrections
        corrections={props.drop.corrections || []}
      />
    }
    <CorrectionCreation {...props}/>
  </div>

Drop.propTypes = {
  currentUser: T.object,
  dropzone: T.shape(DropzoneType.propTypes),
  drop: T.shape(DropType.propTypes),
  tools: T.array,
  saveCorrection: T.func.isRequired,
  executeTool: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    currentUser: select.user(state),
    dropzone: select.dropzone(state),
    drop: select.currentDrop(state),
    tools: select.tools(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveCorrection: (correction) => dispatch(actions.saveCorrection(correction)),
    executeTool: (toolId, documentId) => dispatch(actions.executeTool(toolId, documentId))
  }
}

const ConnectedDrop = connect(mapStateToProps, mapDispatchToProps)(Drop)

export {ConnectedDrop as Drop}