import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {navigate} from '#/main/core/router'
import {t, trans} from '#/main/core/translation'
import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

import {DropzoneType} from '#/plugin/drop-zone/resources/dropzone/prop-types'
import {select} from '#/plugin/drop-zone/resources/dropzone/selectors'
import {actions} from '#/plugin/drop-zone/resources/dropzone/correction/actions'
import {constants} from '#/plugin/drop-zone/resources/dropzone/constants'

class Correctors extends Component {
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

    if (props.dropzone.parameters.dropType === constants.DROP_TYPE_USER) {
      columns.push({
        name: 'user',
        label: t('user'),
        displayed: true,
        renderer: (rowData) => {
          const link = <a href={`#/corrector/${rowData.id}`}>{rowData.user.firstName} {rowData.user.lastName}</a>

          return link
        }
      })
    }
    if (props.dropzone.parameters.dropType === constants.DROP_TYPE_TEAM) {
      columns.push({
        name: 'team',
        label: t('team'),
        displayed: true,
        renderer: (rowData) => {
          const link = <a href={`#/corrector/${rowData.id}`}>{t(rowData.teamName)}</a>

          return link
        }
      })
    }
    columns.push({
      name: 'nbCorrections',
      label: trans('started_corrections', {}, 'dropzone'),
      displayed: true,
      filterable: false,
      sortable: false,
      renderer: (rowData) => {
        const currentKey = props.dropzone.parameters.dropType === constants.DROP_TYPE_USER ? rowData.user.id : rowData.teamId

        return props.corrections && props.corrections[currentKey] ?
          props.corrections[currentKey].length :
          0
      }
    })
    columns.push({
      name: 'nbFinishedCorrections',
      label: trans('finished_corrections', {}, 'dropzone'),
      displayed: true,
      filterable: false,
      sortable: false,
      renderer: (rowData) => {
        const nbExpectedCorrections = props.dropzone.parameters.expectedCorrectionTotal
        const currentKey = props.dropzone.parameters.dropType === constants.DROP_TYPE_USER ? rowData.user.id : rowData.teamId
        const nbCorrections = props.corrections && props.corrections[currentKey] ?
          props.corrections[currentKey].filter(c => c.finished).length :
          0

        return `${nbCorrections} / ${nbExpectedCorrections}`
      }
    })
    columns.push({
      name: 'nbDeniedCorrections',
      label: trans('denied_corrections', {}, 'dropzone'),
      displayed: true,
      filterable: false,
      sortable: false,
      renderer: (rowData) => {
        const currentKey = props.dropzone.parameters.dropType === constants.DROP_TYPE_USER ? rowData.user.id : rowData.teamId

        return props.corrections && props.corrections[currentKey] ?
          props.corrections[currentKey].filter(c => c.correctionDenied).length :
          0
      }
    })
    columns.push({
      name: 'unlockedUser',
      label: trans('unlocked', {}, 'dropzone'),
      displayed: true,
      type: 'boolean'
    })

    return columns
  }

  generateActions(props) {
    const actions = []
    actions.push({
      icon: 'fa fa-fw fa-eye',
      label: t('open'),
      action: (rows) => navigate(`/corrector/${rows[0].id}`),
      context: 'row'
    })
    actions.push({
      icon: 'fa fa-fw fa-unlock',
      label: trans('unlock_user', {}, 'dropzone'),
      action: (rows) => props.unlockUser(rows[0].id),
      context: 'row'
    })

    return actions
  }

  render() {
    return (
      <div id="correctors-list">
        <h2>{trans('correctors_list', {}, 'dropzone')}</h2>
        {!this.props.corrections ?
          <span className="fa fa-fw fa-circle-o-notch fa-spin"></span> :
          <DataList
            name="drops"
            definition={this.generateColumns(this.props)}
            filterColumns={true}
            actions={this.generateActions(this.props)}
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
        }
      </div>
    )
  }
}

Correctors.propTypes = {
  dropzone: T.shape(DropzoneType.propTypes).isRequired,
  drops: T.object,
  corrections: T.oneOfType([T.object, T.array]),
  unlockUser: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    dropzone: select.dropzone(state),
    drops: select.drops(state),
    corrections: select.corrections(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    unlockUser: (dropId) => dispatch(actions.unlockDropUser(dropId))
  }
}

const ConnectedCorrectors = connect(mapStateToProps, mapDispatchToProps)(Correctors)

export {ConnectedCorrectors as Correctors}