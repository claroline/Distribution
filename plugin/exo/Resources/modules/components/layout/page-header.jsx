import React, { Component } from 'react'

const T = React.PropTypes

export default class PageHeader extends Component {
  render() {
    return (
      <div className="page-header">
        <h1>{this.props.title}</h1>

        {this.props.children}
      </div>
    )
  }
}

PageHeader.propTypes = {
  title: T.string.isRequired,
  children: T.node
}
