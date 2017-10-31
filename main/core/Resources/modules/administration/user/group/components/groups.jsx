import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

const Groups = props =>
  <DataList
    name="groups"
    definition={[
      {
        name: 'name',
        type: 'string',
        label: t('name'),
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
  ConnectedGroups as Groups
}
