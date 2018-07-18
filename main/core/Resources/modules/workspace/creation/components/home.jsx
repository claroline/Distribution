import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {Logs} from '#/main/core/workspace/creation/components/log/components/logs.jsx'
import {FormContainer} from '#/main/core/data/form/containers/form'
import {trans} from '#/main/core/translation'

class Home extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const homeTabs = {}

    if (this.props.model.tabs) {
      this.props.model.tabs.forEach(tab => {
        homeTabs[tab.id] = tab.title
      })
    }

    return (
      <div>
        <FormContainer
          disabled={true}
          name="workspaces.creation.home"
          sections={[
            {
              title: trans('tools'),
              primary: true,
              fields: [
                {
                  name: 'tab',
                  type: 'choice',
                  label: trans('tabs'),
                  required: true,
                  options: {
                    condensed: false,
                    multiple: true,
                    choices: homeTabs
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

const ConnectedHome = connect(
  state => ({
    model: state.workspaces.creation.model
    //model: defaultModel
  }),
  dispatch => ({
  })
)(Home)

export {
  ConnectedHome as WorkspaceHome
}
