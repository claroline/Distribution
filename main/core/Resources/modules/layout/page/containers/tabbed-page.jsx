import React from 'react'
import {connect} from 'react-redux'

import {select as modalSelect} from '#/main/core/layout/modal/selectors'
import {actions as modalActions} from '#/main/core/layout/modal/actions'

import {TabbedPage as TabbedPageComponent} from '#/main/core/layout/page/components/tabbed-page.jsx'

/**
 * Connected container for tabbed pages.
 *
 * Connects the <Page> component to a redux store.
 * If you don't use redux in your implementation @see TabbedPage functional component.
 *
 * Requires the following reducers to be registered in your store :
 *   - modal
 *
 * @param props
 * @constructor
 */
const TabbedPage = props =>
  <TabbedPageComponent
    {...props}
  />

function mapStateToProps(state) {
  return {
    modal: modalSelect.modal(state)
  }
}

// connects the container to redux
const TabbedPageContainer = connect(mapStateToProps, Object.assign({}, modalActions))(TabbedPage)

export {
  TabbedPageContainer
}
