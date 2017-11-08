import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

import {actions} from '#/main/core/administration/user/role/actions'
import {select} from '#/main/core/administration/user/role/selectors'

import {RoleList} from '#/main/core/administration/user/role/components/role-list.jsx'

const RoleTabActions = props =>
  <div>
    page actions
  </div>

const RoleTab = props =>
  <DataList
    name="roles"
    actions={[]}
    definition={RoleList.definition}
    card={RoleList.card}
  />

RoleTab.propTypes = {

}

export {
  RoleTabActions,
  RoleTab
}
