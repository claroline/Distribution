import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from '#/main/app/router'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {actions as formActions} from '#/main/core/data/form/actions'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {Button} from '#/main/app/action/components/button'
import {trans} from '#/main/core/translation'
import {constants} from '#/plugin/lesson/resources/lesson/constants'

const ChapterFormComponent = props =>
  <FormContainer
    name={constants.CHAPTER_EDIT_FORM_NAME}
    sections={[
      {
        id: 'Chapter',
        title: 'Chapter form',
        primary: true,
        fields: [
          {
            name: 'title',
            type: 'string',
            label: trans('title'),
            required: true
          },
          {
            name: 'text',
            type: 'html',
            label: trans('text'),
            required: true
          }
        ]
      }
    ]}
  >
    <ButtonToolbar>
      <Button
        disabled={!props.saveEnabled}
        primary={true}
        label={trans(props.isNew ? 'create' : 'save')}
        type="callback"
        className="btn"
        callback={() => {
          props.save(props.isNew, props.lesson.id, props.mode, props.chapter.slug, props.history)
        }}
      />
      <Button
        label={trans('cancel')}
        title={trans('cancel')}
        type="callback"
        className="btn"
        callback={() => {
          props.cancel()
        }}
      />
    </ButtonToolbar>

  </FormContainer>

const ChapterForm = withRouter(connect(
  state => ({
    lesson: state.lesson,
    chapter: state.chapter_edit.data,
    tree: state.tree.data,
    mode: state.mode,
    saveEnabled: formSelect.saveEnabled(formSelect.form(state, constants.CHAPTER_EDIT_FORM_NAME)),
    isNew: formSelect.isNew(formSelect.form(state, constants.CHAPTER_EDIT_FORM_NAME))
  }),
  dispatch => ({
    save: (isNew, lessonId, mode, chapterSlug, history) => {
      dispatch(formActions.saveForm(constants.CHAPTER_EDIT_FORM_NAME, [isNew ? 'apiv2_lesson_chapter_create' : 'apiv2_lesson_chapter_update', {lessonId, chapterSlug}]))
        .then(
          (success) => {
            history.push('/' + success.slug)
          }
        )
    },
    cancel: () => {
      dispatch(
        formActions.cancelChanges(constants.CHAPTER_EDIT_FORM_NAME)
      )
    }
  })
)(ChapterFormComponent))

export {
  ChapterForm
}
