import React, {PropTypes as T} from 'react'
import Modal from 'react-bootstrap/lib/Modal'

import {t, tex} from '#/main/core/translation'
import {FormGroup} from './../../../components/form/form-group.jsx'

export const MODAL_RESOURCE_PROPERTIES = 'MODAL_RESOURCE_PROPERTIES'

const EditPropertiesModal = props =>
  <BaseModal {...this.props} className="search-modal">
    <Modal.Body>
      <FormGroup
        controlId="resource-title"
        label={tex('name')}
      >
        <input
          id="resource-title"
          type="text"
          className="form-control"
          value={null}
          onChange={e => true}
        />
      </FormGroup>

      <div className="checkbox">
        <label htmlFor="resource-published">
          <input
            id="resource-published"
            type="checkbox"
            checked={true}
            onChange={() => true}
          />
          {tex('Resource is published')}
        </label>
      </div>

    </Modal.Body>

    <Modal.Footer>
      <button className="btn btn-default" onClick={props.fadeModal}>
        {t('cancel')}
      </button>
      <button className="btn btn-primary" onClick={() => true}>
        {t('save')}
      </button>
    </Modal.Footer>
  </BaseModal>

EditPropertiesModal.propTypes = {

}

export {EditPropertiesModal}
