import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans, transChoice} from '#/main/app/intl/translation'
import {Modal} from '#/main/app/overlay/modal/components/modal'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

const ResourcesLinksModal = props =>
  <Modal
    {...omit(props)}
    icon="fa fa-fw fa-graduation-cap"
    title={trans('competency.associate', {}, 'competency')}
  >
    <div className="modal-body">
    </div>
  </Modal>

ResourcesLinksModal.propTypes = {
}

ResourcesLinksModal.defaultProps = {
}

export {
  ResourcesLinksModal
}
