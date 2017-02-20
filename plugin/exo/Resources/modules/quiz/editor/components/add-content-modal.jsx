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
      currentType: contentMimeTypes[0],
      currentName: trans(getContentDefinition(contentMimeTypes[0]).name, {}, 'question_types'),
      input: {}
    }
  }

  handleItemMouseOver(type) {
    const name = trans(getContentDefinition(type).name, {}, 'question_types')
    this.setState({
      currentType: type,
      currentName: name
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
                onClick={() => getContentDefinition(type).browseFiles ?
                  this.state.input[getContentDefinition(type).browseFiles].click() :
                  this.props.handleSelect(type)
                }
              >
                {getContentDefinition(type).browseFiles &&
                  <input
                    type="file"
                    accept={getContentDefinition(type).browseFiles + '/*'}
                    style={{display: 'none'}}
                    ref={input => this.state.input[getContentDefinition(type).browseFiles] = input}
                    onChange={() => {
                      if (this.state.input[getContentDefinition(type).browseFiles].files[0]) {
                        const item = this.props.handleSelect(type)
                        getContentDefinition(type).onFileSelect(item, this.state.input[getContentDefinition(type).browseFiles].files[0])
                      }
                    }}
                  />
                }
                <span className="item-icon item-icon-lg">
                  <span className={classes(getContentDefinition(type).icon)}></span>
                </span>
              </div>
            )}
          </div>
          <div className="modal-item-desc">
            <span className="modal-item-name">
              {this.state.currentName}
            </span>
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
