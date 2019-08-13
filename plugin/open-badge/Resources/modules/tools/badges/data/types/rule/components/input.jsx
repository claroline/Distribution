import React, {Component} from 'react'
import classes from 'classnames'

import merge from 'lodash/merge'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {FormField as FormFieldTypes} from '#/main/core/layout/form/prop-types'

import {Select} from '#/main/app/input/components/select'

import {InGroupInput} from '#/plugin/open-badge/tools/badges/data/types/rule/type/in-group/components/input'
import {InRoleInput} from '#/plugin/open-badge/tools/badges/data/types/rule/type/in-role/components/input'
import {ResourceCompletedAboveInput} from '#/plugin/open-badge/tools/badges/data/types/rule/type/resource-completed-above/components/input'
import {ResourceParticipatedInput} from '#/plugin/open-badge/tools/badges/data/types/rule/type/resource-participated/components/input'
import {ResourcePassedInput} from '#/plugin/open-badge/tools/badges/data/types/rule/type/resource-passed/components/input'
import {ResourceScoreAboveInput} from '#/plugin/open-badge/tools/badges/data/types/rule/type/resource-score-above/components/input'
import {WorkspaceCompletedAboveInput} from '#/plugin/open-badge/tools/badges/data/types/rule/type/workspace-completed-above/components/input'
import {WorkspacePassedInput} from '#/plugin/open-badge/tools/badges/data/types/rule/type/workspace-passed/components/input'
import {WorkspaceScoreAboveInput} from '#/plugin/open-badge/tools/badges/data/types/rule/type/workspace-score-above/components/input'

import {
  RULE_RESOURCE_PASSED,
  RULE_RESOURCE_SCORE_ABOVE,
  RULE_RESOURCE_COMPLETED_ABOVE,
  RULE_WORKSPACE_PASSED,
  RULE_WORKSPACE_SCORE_ABOVE,
  RULE_WORKSPACE_COMPLETED_ABOVE,
  RULE_RESOURCE_PARTICIPATED,
  IN_ROLE,
  IN_GROUP,
  RULE_PROFILE_COMPLETED
} from '#/plugin/open-badge/tools/badges/data/types/rule/constants'

import {trans} from '#/main/app/intl/translation'

// todo : fix responsive (incorrect margin bottom)
// todo : manages errors

class RuleInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: null
    }
  }

  render() {
    return (
      <div className={classes('row', this.props.className)}>
        <div className="col-md-6 col-xs-12">
          <Select
            multiple={false}
            choices={
              {
                [RULE_RESOURCE_PASSED]: trans(RULE_RESOURCE_PASSED),
                [RULE_RESOURCE_SCORE_ABOVE]: trans(RULE_RESOURCE_SCORE_ABOVE),
                [RULE_RESOURCE_COMPLETED_ABOVE]: trans(RULE_RESOURCE_COMPLETED_ABOVE),
                [RULE_WORKSPACE_PASSED]: trans(RULE_WORKSPACE_PASSED),
                [RULE_WORKSPACE_SCORE_ABOVE]: trans(RULE_WORKSPACE_SCORE_ABOVE),
                [RULE_WORKSPACE_COMPLETED_ABOVE]: trans(RULE_WORKSPACE_COMPLETED_ABOVE),
                [RULE_RESOURCE_PARTICIPATED]: trans(RULE_RESOURCE_PARTICIPATED),
                [IN_GROUP]: trans(IN_GROUP),
                [IN_ROLE]: trans(IN_ROLE),
                [RULE_PROFILE_COMPLETED]: trans(RULE_PROFILE_COMPLETED)
              }
            }
            onChange={(value) => {
              this.props.onChange({
                type: value
              })
              this.setState({
                type: value
              })
            }}
            value={this.props.value.type}
          />
        </div>
        <div>
          {(() => {
            switch(this.state.type) {
              case RULE_RESOURCE_PASSED:
                return <ResourcePassedInput
                  value={this.props.value.data}
                  onChange={(value) => {this.props.onChange({type: this.state.type, data: value})}}
                />
              case RULE_RESOURCE_SCORE_ABOVE:
                return <ResourceScoreAboveInput
                  value={this.props.value.data}
                  onChange={(value) => {this.props.onChange({type: this.state.type, data: merge(this.props.value.data, value)})}}
                />
              case RULE_RESOURCE_COMPLETED_ABOVE:
                return <ResourceCompletedAboveInput
                  value={this.props.value.data}
                  onChange={(value) => {this.props.onChange({type: this.state.type, data: merge(this.props.value.data, value)})}}
                />
              case RULE_WORKSPACE_PASSED:
                return <WorkspacePassedInput
                  value={this.props.value.data}
                  onChange={(value) => {this.props.onChange({type: this.state.type, data: value})}}
                />
              case RULE_WORKSPACE_SCORE_ABOVE:
                return <WorkspaceScoreAboveInput
                  value={this.props.value.data}
                  onChange={(value) => {this.props.onChange({type: this.state.type, data: merge(this.props.value.data, value)})}}
                />
              case RULE_WORKSPACE_COMPLETED_ABOVE:
                return <WorkspaceCompletedAboveInput
                  value={this.props.value.data}
                  onChange={(value) => {this.props.onChange({type: this.state.type, data: merge(this.props.value.data, value)})}}
                />
              case RULE_RESOURCE_PARTICIPATED:
                return <ResourceParticipatedInput
                  value={this.props.value.data}
                  onChange={(value) => {this.props.onChange({type: this.state.type, data: value})}}
                />
              case IN_GROUP:
                return <InGroupInput
                  value={this.props.value.data}
                  onChange={(value) => {this.props.onChange({type: this.state.type, data: value})}}
                />
              case IN_ROLE:
                return <InRoleInput
                  value={this.props.value.data}
                  onChange={(value) => {this.props.onChange({type: this.state.type, data: value})}}
                />
              case RULE_PROFILE_COMPLETED:
                return <div> RULE_PROFILE_COMPLETED </div>
            }
          }).bind(this)()}
        </div>
      </div>
    )
  }
}

implementPropTypes(RuleInput, FormFieldTypes, {
  // more precise value type
  value: T.object
}, {
  value: {
    type: '',
    data: {

    }
  }
})

export {
  RuleInput
}
