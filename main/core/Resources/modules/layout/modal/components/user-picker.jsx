import React from 'react'
import {PropTypes as T} from 'prop-types'
import Modal from 'react-bootstrap/lib/Modal'

import {t} from '#/main/core/translation'
import {BaseModal} from './base.jsx'
import {UserTypeahead} from '#/main/core/layout/typeahead/users/typeahead.jsx'

const UserPickerModal = props =>
  <BaseModal {...props}>
    <Modal.Body>
      {props.content &&
        <div dangerouslySetInnerHTML={{__html: props.content}}></div>
      }
      <UserTypeahead {...props}/>
    </Modal.Body>
    {props.showFooter &&
      <Modal.Footer>
        <button
          className="btn btn-primary"
          onClick={() => props.fadeModal()}
        >
          {t('Ok')}
        </button>
      </Modal.Footer>
    }
  </BaseModal>

UserPickerModal.propTypes = {
  bsStyle: T.oneOf(['info', 'warning', 'success', 'danger']).isRequired,
  handleSelect: T.func.isRequired,
  handleRemove: T.func.isRequired,
  fadeModal: T.func.isRequired,
  selected: T.array.isRequired,
  showFooter: T.bool.isRequired,
  content: T.string
}

UserPickerModal.defaultProps = {
  bsStyle: 'info',
  title: t('add_user'),
  selected: [],
  showFooter: true
}

export {UserPickerModal}
