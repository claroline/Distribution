import React from 'react'
import {PropTypes as T} from 'prop-types'
import {DropdownButton, MenuItem} from 'react-bootstrap'

import {t, transChoice} from '#/main/core/translation'
import {constants} from '#/main/core/layout/pagination/constants'

const ResultsPerPage = props =>
  <div className="results-per-page">
    <DropdownButton
      id="page-sizes-dropdown"
      title={
        <span>
          {-1 !== props.pageSize ? props.pageSize: t('all')}
          <span className="fa fa-sort" />
        </span>
      }
      bsStyle="link"
      noCaret={true}
      dropup={true}
      pullRight={true}
    >
      <MenuItem header>{t('results_per_page')}</MenuItem>
      {props.availableSizes.map((size, index) =>
        <MenuItem
          key={index}
          onClick={() => props.pageSize !== size ? props.updatePageSize(size) : false}
          className={props.pageSize === size ? 'active' : ''}
        >
          {transChoice('list_results_count', size, {count: size}, 'platform')}
        </MenuItem>
      )}
    </DropdownButton>
  </div>

ResultsPerPage.propTypes = {
  totalResults: T.number.isRequired,
  availableSizes: T.arrayOf(T.number),
  pageSize: T.number,
  updatePageSize: T.func.isRequired
}

ResultsPerPage.defaultProps = {
  availableSizes: constants.AVAILABLE_PAGE_SIZES,
  pageSize: constants.DEFAULT_PAGE_SIZE
}

export {
  ResultsPerPage
}
