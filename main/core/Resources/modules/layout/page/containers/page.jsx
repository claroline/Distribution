import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {select as alertSelect} from '#/main/core/layout/alert/selectors'

import {select as modalSelect} from '#/main/core/layout/modal/selectors'
import {actions as modalActions} from '#/main/core/layout/modal/actions'

import {Page as PageComponent} from '#/main/core/layout/page/components/page.jsx'

/**
 * Connected container for pages.
 *
 * Connects the <Page> component to a redux store.
 * If you don't use redux in your implementation @see Page functional component.
 *
 * Requires the following reducers to be registered in your store :
 *   - modal : if hasModals = true
 *   - alert : if hasAlerts = true
 *
 * @param props
 * @constructor
 */
const Page = props =>
  <PageComponent
    {...props}
  >
    {props.children}
  </PageComponent>

Page.propTypes = {
  hasModals: T.bool,
  hasAlerts: T.bool,

  /**
   * Content to display in the page.
   */
  children: T.node.isRequired
}

Page.defaultProps = {
  hasModals: false,
  hasAlerts: false
}

// connects the container to redux
const PageContainer = connect(
  (state, ownProps) => {
    const props = {}
    if (ownProps.hasModals) {
      props.modal = modalSelect.modal(state)
    }

    if (ownProps.hasAlerts) {
      props.alerts = alertSelect.alerts(state)
    }

    return props
  },
  (dispatch, ownProps) => {
    const props = {}

    if (ownProps.hasModals) {
      props.fadeModal = () => dispatch(modalActions.fadeModal())
      props.hideModal = () => dispatch(modalActions.hideModal())
    }

    return props
  })(Page)

export {
  PageContainer
}
