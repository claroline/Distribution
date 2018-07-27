import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'

import {Team as TeamType} from '#/plugin/team/tools/team/prop-types'

const TeamComponent = props =>
  <div>
    Team
  </div>

TeamComponent.propTypes = {
  team: T.shape(TeamType.propTypes).isRequired
}

const Team = connect(
  (state) => ({
    team: formSelect.data(formSelect.form(state, 'teams.current'))
  })
)(TeamComponent)


export {
  Team
}