import {connect} from 'react-redux'
import React, {Component, PropTypes as T} from 'react'
import {select} from './selectors'
import {LazyLoadTable} from '#/main/core/layout/table/LazyLoadTable.jsx'

class Workspaces extends Component {
  constructor(props) {
    super(props)

    this.onChangePage = this.onChangePage.bind(this)

    this.columns = {
      available: ['name', 'code', 'creationDate', 'actions'],
      active: []
    }

    this.filters = {
      available: ['name', 'code'],
      active: [],
      onChange: () => alert('filter')
    }

    this.pagination = {
      totalResults: this.props.count,
      pageSize: 20,
      current: 1,
      data: this.props.workspaces
    }

    this.renderers = {
      actions: el => { return(<span> {el.id} display actions here </span>)},
      creationDate: el => { return (<span> update date here {el.creationDate} </span>)}
    }
  }

  onChangePage(page, limit) {
    alert('go to ' + page + ' ' + limit)
  }

  render() {
    return (
      <LazyLoadTable
        format="list"
        columns={this.columns}
        filters={this.filters}
        pagination={this.pagination}
        renderers={this.renderers}
        onChangePage={this.onChangePage.bind}
      />
    )
  }
}

Workspaces.propTypes = {
  count: T.number.required,
  workspaces: T.array(T.object)
}

function mapStateToProps(state) {
  return {
    workspaces: select.workspaces(state),
    count: select.count(state),
    size: select.size(state),
    page: select.page(state)
  }
}

const ConnectedWorkspaces = connect(mapStateToProps)(Workspaces)

export {ConnectedWorkspaces as Workspaces}
