import React, { Component } from 'react'
import ResultsPerPage from './results-per-page.jsx'

const T = React.PropTypes

const PaginationLink = props =>
  <li className={props.className}>
    <a
      href="#"
      onClick={props.handleClick}
    >
      {props.children}
    </a>
  </li>

PaginationLink.propTypes = {
  handleClick: T.func.isRequired,
  className: T.node,
  children: T.node.isRequired
}

PaginationLink.defaultProps = {
  className: ''
}

const PageLink = props =>
  <PaginationLink
    className={props.current ? 'active' : ''}
    handleClick={e => {
      e.stopPropagation()
      props.handlePageChange(props.page)
    }}
  >
    {props.page + 1}
  </PaginationLink>

PageLink.propTypes = {
  page: T.number.isRequired,
  handlePageChange: T.func.isRequired,
  current: T.bool
}

PageLink.defaultProps = {
  current: false
}

// TODO : find a way to add the `aria-label`
const PreviousLink = props =>
  <PaginationLink
    className={props.disabled ? 'disabled' : ''}
    handleClick={e => {
      e.stopPropagation()
      if (!props.disabled) {
        props.handlePagePrevious()
      }
    }}
  >
    <span aria-hidden="true">&laquo;</span>
  </PaginationLink>

PreviousLink.propTypes = {
  disabled: T.bool,
  handlePagePrevious: T.func.isRequired
}

PreviousLink.defaultProps = {
  disabled: false
}

// TODO : find a way to add the `aria-label`
const NextLink = props =>
  <PaginationLink
    className={props.disabled ? 'disabled' : ''}
    handleClick={e => {
      e.stopPropagation()
      if (!props.disabled) {
        props.handlePageNext()
      }
    }}
  >
    <span aria-hidden="true">&raquo;</span>
  </PaginationLink>

NextLink.propTypes = {
  disabled: T.bool,
  handlePageNext: T.func.isRequired
}

NextLink.defaultProps = {
  disabled: false
}

export default class Pagination extends Component {
  render() {
    const PageLinks = []
    for (let i = 0; i < this.props.pages; i++) {
      PageLinks.push(
        <PageLink
          key={i}
          page={i}
          current={i === this.props.current}
          handlePageChange={this.props.handlePageChange}
        />
      )
    }

    return (
      <nav className="pagination-container" aria-label="Page navigation">
        <ResultsPerPage
          pageSize={this.props.pageSize}
          handlePageSizeUpdate={this.props.handlePageSizeUpdate}
        />

        <ul className="pagination">
          <PreviousLink
            disabled={0 === this.props.current}
            handlePagePrevious={this.props.handlePagePrevious}
          />

          {PageLinks}

          <NextLink
            disabled={this.props.pages - 1 === this.props.current}
            handlePageNext={this.props.handlePageNext}
          />
        </ul>
      </nav>
    )
  }
}

Pagination.propTypes = {
  current: T.number.isRequired,
  pageSize: T.number.isRequired,
  pages: T.number.isRequired,
  handlePagePrevious: T.func.isRequired,
  handlePageNext: T.func.isRequired,
  handlePageChange: T.func.isRequired,
  handlePageSizeUpdate: T.func.isRequired
}