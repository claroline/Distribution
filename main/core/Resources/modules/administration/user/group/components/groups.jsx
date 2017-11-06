import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

const GroupsActions = props =>
  <PageActions>
    <PageAction
      id="group-add"
      icon="fa fa-plus"
      title={t('add_group')}
      action="#/groups/add"
      primary={true}
    />

    <PageAction
      id="group-import"
      icon="fa fa-download"
      title={t('add_group')}
      action="#/groups/import"
    />
  </PageActions>

const Groups = props =>
  <DataList
    name="groups.list"
    definition={[
      {
        name: 'name',
        type: 'string',
        label: t('name'),
        renderer: (rowData) => {
          // variable is used because React will use it has component display name (eslint requirement)
          const groupLink = <a href={`#/groups/${rowData.id}`}>{rowData.name}</a>

          return groupLink
        },
        displayed: true
      }
    ]}
    actions={[]}
    card={(row) => ({
      onClick: '#',
      poster: null,
      icon: 'fa fa-users',
      title: row.name,
      subtitle: row.name,
      contentText: '',
      flags: [],
      footer: <span>footer</span>,
      footerLong: <span>footerLong</span>
    })}
  />

Groups.propTypes = {

}

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

const ConnectedGroups = connect(mapStateToProps, mapDispatchToProps)(Groups)

export {
  GroupsActions,
  ConnectedGroups as Groups
}
