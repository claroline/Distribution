import {connect} from 'react-redux'
import React, {Component, PropTypes as T} from 'react'
import {select} from './selectors'
import {actions} from './actions'
import {LazyLoadTable} from '#/main/core/layout/table/LazyLoadTable.jsx'
import moment from 'moment'
import {makeModal} from '#/main/core/layout/modal'

/* global Translator */
/* global Routing */

const t = key => Translator.trans(key, {}, 'platform')
const route = (name, parameter = {}) => Routing.generate(name, parameter)

class ActionBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modal: {}
    }
  }

  removeSelection() {
    this.setState({
      modal: {
        type: 'DELETE_MODAL',
        props: {
          isDangerous: true,
          question: t('remove_workspaces_confirm', {workspace_list: this.props.pagination.selected.reduce((acc, workspace) => workspace.name + ' ,')}),
          handleConfirm: () =>  {
            this.setState({modal: {fading: true}})

            return this.props.removeWorkspaces(this.props.pagination.selected)
          },
          title: t('remove_workspace')
        },
        fading: false
      }
    })
  }

  hideModal() {
    this.setState({modal: {fading: true}})
  }

  copySelection() {
    this.setState({
      displayModal: true
    })
  }

  copyAsModelSelection() {
    this.setState({
      displayModal: true
    })
  }

  render() {
    return(
      <div>
        {this.state.modal.type &&
          this.props.createModal(
            this.state.modal.type,
            this.state.modal.props,
            this.state.modal.fading,
            this.hideModal.bind(this)
          )
        }
        <button onClick={() => this.removeSelection()}> {t('delete')} </button>
        <button onClick={() => this.copySelection()}> {t('copy')} </button>
        <button onClick={() => this.copyAsModelSelection()}> {t('make_model')} </button>
      </div>
    )
  }
}

ActionBar.propTypes = {
  pagination: {
    totalResults: T.number.required,
    pageSize: T.number.required,
    current: T.number.required,
    data: T.array(T.object)
  },
  removeWorkspaces: T.func.isRequired,
  createModal: T.func.isRequired
}

class ActionCell extends Component {
  constructor(props) {
    super(props)
  }

  deleteWorkspace() {
    alert('delete')
  }

  render() {
    return (
      <span>
        <button onClick={() => this.deleteWorkspace()}> {t('delete')} </button>
      </span>
    )
  }
}

const NameCell = el => {
  return <span> <a href={route('claro_workspace_open', {workspaceId: el.id})} > {el.name} </a> </span>
}

const DateCell = el => {
  return (<span> {moment(el.createDate).format(t('date_range.js_format'))} </span>)
}

class Workspaces extends Component {
  constructor(props) {
    super(props)

    this.columns = {
      available: ['name', 'code', 'creationDate', 'actions'],
      active: []
    }

    this.filters = {
      available: ['name', 'code'],
      active: [],
      onChange: () => alert('filter')
    }

    this.renderers = {
      actions: el => <ActionCell workspace={el}/>,
      creationDate: el => DateCell(el),
      name: el => NameCell(el)
    }
  }

  render() {
    return (
      <div>
        <ActionBar
          pagination={this.props.pagination}
          createModal={this.props.createModal}
          removeWorkspaces={this.props.removeWorkspaces}
        />
        <LazyLoadTable
          format="list"
          columns={this.columns}
          filters={this.filters}
          pagination={this.props.pagination}
          renderers={this.renderers}
          onChangePage={this.props.onChangePage}
          onSelect={this.props.onSelect}
        />
      </div>
    )
  }
}

Workspaces.propTypes = {
  pagination: {
    totalResults: T.number.required,
    pageSize: T.number.required,
    current: T.number.required,
    data: T.array(T.object)
  },
  onChangePage: T.func.isRequired,
  onSelect: T.func.isRequired,
  createModal: T.func.isRequired,
  removeWorkspaces: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    pagination: {
      data: select.data(state),
      totalResults: select.totalResults(state),
      pageSize: select.pageSize(state),
      current: select.current(state),
      selected: select.selected(state)
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onChangePage: (page, size) => dispatch(actions.fetchPage(page, size)),
    onSelect: (selected) => dispatch(actions.onSelect(selected)),
    createModal: (type, props, fading, hideModal) => makeModal(type, props, fading, hideModal, hideModal),
    removeWorkspaces: (workspaces) => dispatch(actions.removeWorkspaces(workspaces))
  }
}

const ConnectedWorkspaces = connect(mapStateToProps, mapDispatchToProps)(Workspaces)

export {ConnectedWorkspaces as Workspaces}
