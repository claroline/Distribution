import React, {Component, PropTypes as T} from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import classes from 'classnames'
import {trans} from './../../../utils/translate'
import {listContentItemMimeTypes, getContentDefinition} from './../../../items/item-types'
import {BaseModal} from './../../../modal/components/base.jsx'

export const MODAL_ADD_CONTENT = 'MODAL_ADD_CONTENT'

class AddContentModal extends Component {
  constructor(props) {
    super(props)
    const contentMimeTypes = listContentItemMimeTypes()

    this.state = {
      contentMimeTypes: contentMimeTypes,
      currentType: null
    }
  }

  handleItemMouseOver(type) {
    const name = trans(getContentDefinition(type).name, {}, 'question_types')
    const desc = trans(`${getContentDefinition(type).name}_desc`, {}, 'question_types')
    this.setState({
      currentType: type
    })
  }

  render() {
    return (
      <BaseModal {...this.props} className="add-content-modal">
        <Modal.Body>
          <div className="modal-content-list" role="listbox">
            {this.state.contentMimeTypes.map(type =>
              <div
                key={type}
                className={classes('modal-content-entry', {'selected': this.state.currentType === type})}
                role="option"
                onMouseOver={() => this.handleItemMouseOver(type)}
                onClick={() => this.props.handleSelect(type)}
              >
                <span className="item-icon item-icon-lg">
                  <span className={classes('fa', 'fa-' + getContentDefinition(type).icon)}></span>
                </span>
                <span className="content-item-desc">
                  {trans(getContentDefinition(type).name, {}, 'question_types')}
                </span>
              </div>
            )}
          </div>
        </Modal.Body>
      </BaseModal>
    )
  }
}

AddContentModal.propTypes = {
  handleSelect: T.func.isRequired
}

export {AddContentModal}
