import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {TreeData} from '#/main/app/content/tree/containers/data'

import {FrameworkList} from '#/plugin/competency/administration/competency/framework/components/framework-list'

const FrameworkComponent = () =>
  <TreeData
    name="frameworks.current"
    delete={{
      url: ['apiv2_competency_delete_bulk']
    }}
    definition={FrameworkList.definition}
    actions={(rows) => [
      {
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-pencil',
        label: trans('edit'),
        displayed: rows[0].parent,
        scope: ['object'],
        target: rows[0].parent ? `/frameworks/${rows[0].parent.id}/competency/${rows[0].id}` : '/frameworks'
      }, {
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-plus',
        label: trans('competency.create_sub', {}, 'competency'),
        scope: ['object'],
        target: `/frameworks/${rows[0].id}/competency`
      }, {
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-plus-square',
        label: trans('ability.create', {}, 'competency'),
        displayed: 0 === rows[0].children.length,
        scope: ['object'],
        target: `/frameworks/${rows[0].id}/ability`
      }
    ]}
    card={(row) => ({
      icon: 'fa fa-graduation-cap',
      title: row.name,
      subtitle: row.abilities.map(competencyAbility => competencyAbility.ability.name).join(', '),
      flags: [
        row.abilities && 0 < row.abilities.length && ['fa fa-graduation-cap', trans('ability.contains', {}, 'competency')]
      ].filter(flag => !!flag)
    })}
  />

FrameworkComponent.propTypes = {
}

const Framework = connect(
  null,
  (dispatch) => ({
  })
)(FrameworkComponent)

export {
  Framework
}
