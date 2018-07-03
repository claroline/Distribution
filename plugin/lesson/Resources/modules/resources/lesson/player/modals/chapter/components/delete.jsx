import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'
import {trans} from '#/main/core/translation'
import {Modal} from '#/main/app/overlay/modal/components/modal'
import {Form} from '#/main/core/data/form/components/form.jsx'

class ChapterDeleteModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {children: false}
    }
    this.updateProp = this.updateProp.bind(this)
    this.save = this.save.bind(this)
  }

  updateProp(propName, propValue) {
    const newData = Object.assign({}, this.state.data)
    newData[propName] = propValue

    this.setState({
      data: newData
    })
  }

  save() {
    this.props.deleteChapter(this.state.data.children)
    this.props.fadeModal()
    this.setState({
      data: {children: false}
    })
  }

  render() {
    return (
      <Modal
        {...omit(this.props, 'deleteChapter', 'chapterTitle')}
        icon="fa fa-fw fa-trash-o"
        title={trans('delete_confirmation', {'chapterTitle': this.props.chapterTitle}, 'icap_lesson')}
      >
        <Form
          level={5}
          data={this.state.data}
          setErrors={() => {}}
          updateProp={this.updateProp}
          sections={[
            {
              id: 'general',
              title: '',
              primary: true,
              fields: [
                {
                  name: 'children',
                  type: 'boolean',
                  label: trans('icap_lesson_delete_chapter_children', {}, 'icap_lesson')
                }
              ]
            }
          ]}
        />
        <button
          className="modal-btn btn btn-danger"
          onClick={this.save}
        >
          {trans('confirm')}
        </button>
      </Modal>
    )}
}

ChapterDeleteModal.propTypes = {
  'deleteChapter': T.func.isRequired,
  'chapterTitle': T.string.isRequired,
  'fadeModal': T.func.isRequired
}

export {
  ChapterDeleteModal
}