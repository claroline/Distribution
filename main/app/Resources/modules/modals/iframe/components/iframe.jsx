import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {Modal} from '#/main/app/overlay/modal/components/modal'

const IframeModal = props =>
  <Modal
    {...omit(props, 'src', 'width', 'height')}
  >
    <iframe
      className="modal-body"
      width={props.width}
      height={props.height}
      src={props.src}
    />
  </Modal>

IframeModal.propTypes = {
  src: T.string.isRequired,
  width: T.number.isRequired,
  height: T.number.isRequired
}

export {
  IframeModal
}