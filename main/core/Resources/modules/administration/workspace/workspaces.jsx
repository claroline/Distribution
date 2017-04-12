import {connect} from 'react-redux'
import React, {Component, PropTypes as T} from 'react'
import {select} from './selectors'
import {LazyLoadTable} from '#/main/core/layout/table/LazyLoadTable.jsx'
import {actions} from './actions'

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
      actions: el => { return(<span> {el.id} display actions here </span>)},
      creationDate: el => { return (<span> update date here {el.creationDate} </span>)}
    }
  }

  render() {
    return (
      <LazyLoadTable
        format="list"
        columns={this.columns}
        filters={this.filters}
        pagination={this.props.pagination}
        renderers={this.renderers}
        onChangePage={this.props.onChangePage}
      />
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
  onChangePage: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    pagination: {
      data: select.data(state),
      totalResults: select.totalResults(state),
      pageSize: select.pageSize(state),
      current: select.current(state)
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onChangePage(page, size) {
      dispatch(actions.fetchPage(page, size))
    }
  }
}

const ConnectedWorkspaces = connect(mapStateToProps, mapDispatchToProps)(Workspaces)

export {ConnectedWorkspaces as Workspaces}
