import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {navigate} from '#/main/core/router'
import {t, trans} from '#/main/core/translation'
import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

import {DropzoneType} from '#/plugin/drop-zone/resources/dropzone/prop-types'
import {select} from '#/plugin/drop-zone/resources/dropzone/selectors'

class Drops extends Component {
  generateColumns(props) {
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
    columns.push({
      name: 'score',
      label: t('score'),
      displayed: true,
      renderer: (rowData) => rowData.score !== null ? `${rowData.score} / ${props.dropzone.parameters.scoreMax}` : ''
    })
    columns.push({
      name: 'finished',
      label: trans('submitted', {}, 'dropzone'),
      displayed: true,
      type: 'boolean'
    })
    columns.push({
      name: 'complete',
      label: trans('complete', {}, 'dropzone'),
      displayed: true,
      filterable: false,
      sortable: false,
      renderer: (rowData) => {
        const nbExpectedCorrections = props.dropzone.parameters.peerReview ? 1 : props.dropzone.parameters.expectedCorrectionTotal
        const nbValidCorrections = rowData.corrections.filter(c => c.finished && c.valid).length
        const element = nbValidCorrections >= nbExpectedCorrections ?
          <span className="fa fa-w fa-check true"/> :
          <span className="fa fa-w fa-times false"/>

        return element
      }
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
      <div id="corrections-management">
        <h2>{trans('corrections_management', {}, 'dropzone')}</h2>
        <DataList
          name="drops"
          definition={this.generateColumns(this.props)}
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
      </div>
    )
  }
}

Drops.propTypes = {
  dropzone: T.shape(DropzoneType.propTypes).isRequired,
  drops: T.object
}

function mapStateToProps(state) {
  return {
    dropzone: select.dropzone(state),
    drops: select.drops(state)
  }
}

function mapDispatchToProps() {
  return {}
}

const ConnectedDrops = connect(mapStateToProps, mapDispatchToProps)(Drops)

export {ConnectedDrops as Drops}