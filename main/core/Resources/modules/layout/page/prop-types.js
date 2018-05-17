import {PropTypes as T} from 'prop-types'

import {Modal as ModalTypes} from '#/main/app/overlay/modal/prop-types'

const Page = {
  propTypes: {
    className: T.string,

    /**
     * Is the page displayed in full screen ?
     */
    fullscreen: T.bool,

    /**
     * Is the page embed into another ?
     *
     * Permits to know if we use a <main> or a <section> tag.
     */
    embedded: T.bool,

    // alerts management
    alerts: T.array,
    removeAlert: T.func,

    // modal management
    hasModals: T.bool,
    modal: T.shape(
      ModalTypes.propTypes
    ),
    fadeModal: T.func,
    hideModal: T.func
  },
  defaultProps: {
    fullscreen: false,
    embedded: false
  }
}

export {
  Page
}
