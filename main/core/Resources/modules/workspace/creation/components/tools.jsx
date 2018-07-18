import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {FormContainer} from '#/main/core/data/form/containers/form'
import {trans} from '#/main/core/translation'
import {Logs} from '#/main/core/workspace/creation/components/log/components/logs.jsx'

class Tools extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const toolOptions = {}

    if (this.props.model.tools) {
      this.props.model.orderedTools.forEach(tool => {
        toolOptions[tool.id] = tool.tool.name
      })
    }

    return (
      <div>
        <FormContainer
          disabled={true}
          name="workspaces.creation.tools"
          sections={[
            {
              title: trans('tools'),
              primary: true,
              fields: [
                {
                  name: 'tool',
                  type: 'choice',
                  label: trans('tools'),
                  required: true,
                  options: {
                    condensed: false,
                    multiple: true,
                    choices: toolOptions
                  }
                }
              ]
            }
          ]}
        />
        <Logs/>
      </div>
    )
  }
}

const ConnectedTools = connect(
  state => ({
    model: state.workspaces.creation.model
    //model: defaultModel
  }),
  dispatch => ({
  })
)(Tools)

export {
  ConnectedTools as WorkspaceTools
}
