import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

import {actions} from '#/main/core/administration/user/role/actions'
import {select} from '#/main/core/administration/user/role/selectors'

import {enumRole} from '#/main/core//administration/user/role/constants'
import {RoleCard} from '#/main/core//administration/user/role/components/role-card.jsx'

const RoleTabActions = props =>
  <div>
    page actions
  </div>

const RoleTab = props =>
  <DataList
    name="roles"
    definition={[
      {name: 'name', type: 'string', label: t('name'), displayed: true},
      {name: 'type', type: 'enum', label: t('type'), options: {choices: enumRole}, displayed: false},
      {name: 'translationKey', type: 'string', label: t('translation'), renderer: (rowData) => t(rowData.translationKey), displayed: true}
    ]}
    actions={[]}
    card={RoleCard}
  />

RoleTab.propTypes = {

}

export {
  RoleTabActions,
  RoleTab
}
