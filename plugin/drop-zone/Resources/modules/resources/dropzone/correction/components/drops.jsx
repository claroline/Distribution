import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {navigate} from '#/main/core/router'
import {t, trans} from '#/main/core/translation'
import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

import {select} from '#/plugin/drop-zone/resources/dropzone/selectors'

class Drops extends Component {
  generateColumns() {
    const columns = []

    columns.push({
      name: 'dropzone',
      label: t('resource'),
      displayed: false,
      displayable: false,
      filterable: true,
      type: 'string'
    })
    columns.push({
      name: 'dropDate',
      label: trans('submit_date', {}, 'dropzone'),
      displayed: true,
      displayable: true,
      filterable: true,
      type: 'date'
    })
    columns.push({
      name: 'user',
      label: t('user'),
      displayed: true,
      renderer: (rowData) => rowData.user ? `${rowData.user.firstName} ${rowData.user.lastName}` : '-'
    })

    return columns
  }

  generateActions() {
    const actions = []
    actions.push({
      icon: 'fa fa-w fa-eye',
      label: t('open'),
      action: (rows) => navigate(`/drop/${rows[0].id}`),
      context: 'row'
    })

    return actions
  }

  render() {
    return (
      <DataList
        name="drops"
        definition={this.generateColumns()}
        filterColumns={true}
        actions={this.generateActions()}
        card={(row) => ({
          onClick: `#/drop/${row.id}/view`,
          poster: null,
          icon: null,
          title: '',
          subtitle: '',
          contentText: '',
          flags: [].filter(flag => !!flag),
          footer:
            <span></span>,
          footerLong:
            <span></span>
        })}
      />
    )
  }
}

Drops.propTypes = {
  drops: T.object
}

function mapStateToProps(state) {
  return {
    drops: select.drops(state)
  }
}

function mapDispatchToProps() {
  return {}
}

const ConnectedDrops = connect(mapStateToProps, mapDispatchToProps)(Drops)

export {ConnectedDrops as Drops}