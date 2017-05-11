import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {t} from '#/main/core/translation'
import {getType} from '#/main/core/layout/data'
import {getPropDefinition} from '#/main/core/layout/list/utils'

import {TooltipElement} from '#/main/core/layout/components/tooltip-element.jsx'

const CurrentFilter = props =>
  <div className="search-filter">
    <span className="search-filter-prop">
      {props.label}
    </span>

    <span className="search-filter-value">
      {props.value}

      <button type="button" className="btn btn-link" onClick={props.remove}>
        <span className="fa fa-times" />
        <span className="sr-only">{t('list_remove_filter')}</span>
      </button>
    </span>
  </div>

CurrentFilter.propTypes = {
  label: T.string.isRequired,
  value: T.any.isRequired,
  remove: T.func.isRequired
}

const AvailableFilterActive = props =>
  <a
    className="available-filter available-filter-active"
    role="button"
    href=""
    onClick={(e) => {
      e.preventDefault()
      props.onSelect()
    }}
  >
    {props.children}
  </a>

AvailableFilterActive.propTypes = {
  children: T.node.isRequired,
  onSelect: T.func.isRequired
}

const AvailableFilterDisabled = props =>
  <span className="available-filter available-filter-disabled">
    {props.children}
  </span>

AvailableFilterDisabled.propTypes = {
  children: T.node.isRequired
}

const AvailableFilterFlag = props => props.isValid ?
  <span className="fa fa-fw" />
  :
  <TooltipElement
    id={props.id}
    tip="This filter can not be used with you current search"
    position="right"
  >
    <span className="cursor-help fa fa-fw fa-warning" />
  </TooltipElement>

AvailableFilterFlag.propTypes = {
  id: T.string.isRequired,
  isValid: T.bool.isRequired
}

const AvailableFilter = props => {
  const typeDef = getType(props.type)
  const isValidSearch = !typeDef || !typeDef.validate || typeDef.validate(props.currentSearch)

  return (
    <li role="presentation">
      {React.createElement(
        isValidSearch ? AvailableFilterActive : AvailableFilterDisabled,
        isValidSearch ? {onSelect: props.onSelect} : {}, [
          <span className="available-filter-prop">
            <AvailableFilterFlag id={`${props.name}-filter-flag`} isValid={isValidSearch} />
            {props.label} <small>({props.type})</small>
          </span>,
          <span className="available-filter-form">
            {(!typeDef || !typeDef.components.search) &&
              <span className="available-filter-value">{isValidSearch ? props.currentSearch : '-'}</span>
            }

            {(typeDef && typeDef.components.search) &&
              React.createElement(typeDef.components.search, {
                search: props.currentSearch,
                isValid: isValidSearch,
                updateSearch: props.updateSearch
              })
            }
          </span>
        ]
      )}
    </li>
  )
}

AvailableFilter.propTypes = {
  name: T.string.isRequired,
  label: T.string.isRequired,
  type: T.string.isRequired,
  currentSearch: T.any,
  onSelect: T.func.isRequired,
  updateSearch: T.func.isRequired
}

const FiltersList = props =>
  <menu className="search-available-filters">
    {props.available.map((filter, idx) =>
      <AvailableFilter
        key={idx}
        name={filter.name}
        label={filter.label}
        type={filter.type}
        currentSearch={props.currentSearch}
        onSelect={() => props.onSelect(filter.name)}
        updateSearch={props.updateSearch}
      />
    )}
  </menu>

FiltersList.propTypes = {
  available: T.arrayOf(T.shape({
    name: T.string.isRequired,
    type: T.string.isRequired,
    label: T.string.isRequired
  })).isRequired,
  currentSearch: T.any,
  onSelect: T.func.isRequired,
  updateSearch: T.func.isRequired
}

FiltersList.defaultProps = {
  currentSearch: ''
}

/**
 * Data list search box.
 *
 * @param props
 * @constructor
 */
class ListSearch extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentSearch: ''
    }
  }

  componentDidMount() {
    this.searchInput.focus()
  }

  addFilter(filter) {
    const currentSearch = this.state.currentSearch
    this.setState({currentSearch: ''})

    this.searchInput.focus()
    this.props.addFilter(filter, currentSearch)

    this.updateSearch = this.updateSearch.bind(this)
  }

  updateSearch(search) {
    this.setState({currentSearch: search})
  }

  render() {
    return (
      <div className="list-search">
        <div className="search-filters">
          {this.props.current.map(activeFilter =>
            <CurrentFilter
              key={activeFilter.property}
              label={getPropDefinition(activeFilter.property, this.props.available).label}
              value={activeFilter.value}
              remove={() => this.props.removeFilter(activeFilter)}
            />
          )}

          <input
            ref={(input) => this.searchInput = input}
            type="text"
            className="form-control search-control"
            placeholder="Search in the list"
            value={this.state.currentSearch}
            onChange={(e) => this.updateSearch(e.target.value)}
          />
        </div>

        <span className="search-icon" aria-hidden="true" role="presentation">
          <span className="fa fa-fw fa-search" />
        </span>

        {this.state.currentSearch &&
          <FiltersList
            available={this.props.available}
            currentSearch={this.state.currentSearch}
            onSelect={this.addFilter.bind(this)}
            updateSearch={this.updateSearch}
          />
        }
      </div>
    )
  }
}

ListSearch.propTypes = {
  available: T.arrayOf(T.shape({
    name: T.string.isRequired
  })).isRequired,
  current: T.arrayOf(T.shape({
    property: T.string.isRequired,
    value: T.any.isRequired
  })).isRequired,
  addFilter: T.func.isRequired,
  removeFilter: T.func.isRequired
}

export {ListSearch}
