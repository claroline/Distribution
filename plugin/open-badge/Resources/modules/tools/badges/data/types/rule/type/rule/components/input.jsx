import React, {Component} from 'react'
import classes from 'classnames'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {FormField as FormFieldTypes} from '#/main/core/layout/form/prop-types'

import {Select} from '#/main/app/input/components/select'

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
              this.props.onChange([this.props.value.type, value])
              alert('change ' + value)
            }}
          />
        </div>
      </div>
    )
  }
}

implementPropTypes(RuleInput, FormFieldTypes, {
  // more precise value type
  value: T.object
}, {
  value: {}
})

export {
  RuleInput
}
