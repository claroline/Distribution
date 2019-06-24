import React from 'react'
import {PropTypes as T} from 'prop-types'

const SearchMenu = props =>
  <div className="app-header-search">
    <input
      type="search"
      className="form-control input-lg"
      placeholder="Rechercher"
    />
  </div>

SearchMenu.propTypes = {

}

export {
  SearchMenu
}
