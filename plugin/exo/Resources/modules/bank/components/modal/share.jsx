import React, {Component, PropTypes as T} from 'react'
import classes from 'classnames'
import Modal from 'react-bootstrap/lib/Modal'

import {t, tex, trans} from './../../../utils/translate'
import {FormGroup} from './../../../components/form/form-group.jsx'

import {BaseModal} from './../../../modal/components/base.jsx'

export const MODAL_SHARE = 'MODAL_SHARE'

export class ShareModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      adminRights: false,
      users: []
    }
  }

  render() {
    return (
      <BaseModal {...this.props} className="share-modal">
        <Modal.Body>
          <FormGroup
              controlId="search-title"
              label={tex('filter_by_title')}
          >
            <input
                id="search-title"
                type="text"
                className="form-control"
                value={this.state.filters.title}
                onChange={e => this.updateFilters('title', e.target.value)}
            />
          </FormGroup>

          <div className="checkbox">
            <label htmlFor="search-self-only">
              <input
                  id="search-self-only"
                  type="checkbox"
                  name="search-self-only"
                  checked={this.state.filters.self_only}
                  onChange={() => this.updateFilters('self_only', !this.state.filters.self_only)}
              />
              {tex('filter_by_self_only')}
            </label>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button className="btn btn-default" onClick={this.props.fadeModal}>
            {t('cancel')}
          </button>
          <button className="btn btn-primary" onClick={() => this.props.handleShare(this.state)}>
            {t('share')}
          </button>
        </Modal.Footer>
      </BaseModal>
    )
  }
}

SearchModal.propTypes = {
  handleSearch: T.func.isRequired
}
