import React, {Component, PropTypes as T} from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import classes from 'classnames'
import {trans} from './../../../utils/translate'
import {listContentTypes, getContentDefinition} from './../../../contents/content-types'
import {BaseModal} from './../../../modal/components/base.jsx'

export const MODAL_ADD_CONTENT = 'MODAL_ADD_CONTENT'

class AddContentModal extends Component {
  constructor(props) {
    super(props)
    const contentTypes = listContentTypes()

    this.state = {
      contentTypes: contentTypes,
      currentType: contentTypes[0],
      currentName: trans(getContentDefinition(contentTypes[0]).type, {}, 'question_types'),
      input: {}
    }
  }

  handleItemMouseOver(type) {
    const name = trans(getContentDefinition(type).type, {}, 'question_types')
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
            {this.state.contentTypes.map(type =>
              <div
                key={type}
                className={classes('modal-content-entry', {'selected': this.state.currentType === type})}
                role="option"
                onMouseOver={() => this.handleItemMouseOver(type)}
                onClick={() => getContentDefinition(type).browseFiles ?
                  this.state.input[getContentDefinition(type).browseFiles].click() :
                  this.props.handleSelect(getContentDefinition(type).mimeType)
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
                        this.props.handleFileUpload(
                          this.state.input[getContentDefinition(type).browseFiles].files[0],
                          'exo_content_item_' + type
                        )
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
  handleSelect: T.func.isRequired,
  handleFileUpload: T.func
}

export {AddContentModal}
