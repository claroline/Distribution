import React, {Component} from 'react'
import ListHeader from '#/main/core/layout/list/components/header.jsx'
//import { PageActions, PageAction } from '#/main/core/layout/page/components/page-actions.jsx'

export class Workspaces extends Component {
  constructor(props) {
    super(props)
    this.filters = {
      available: ['code', 'name'],
      active: [],
      onChange: this.updateFilters()
    }
    this.columns = {
      available: ['code', 'name'],
      active: []
    }
  }

  updateFilters() {

  }

  render() {
    return (
      <div>

        <ListHeader
          filter={this.filters}
          columns={this.columns}
        >
        </ListHeader>
      </div>
    )
  }
}
