import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from '#/main/app/router'

// todo : remove me
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'

import {trans} from '#/main/app/intl/translation'
import {actions as modalActions} from '#/main/app/overlays/modal/store'
import {actions as formActions, selectors as formSelect} from '#/main/app/content/form/store'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {FormData} from '#/main/app/content/form/containers/data'
import {Button} from '#/main/app/action/components/button'

import {selectors as resourceSelectors} from '#/main/core/resource/store'

import {buildParentChapterChoices} from '#/plugin/lesson/resources/lesson/utils'
import {actions as lessonActions, selectors} from '#/plugin/lesson/resources/lesson/store'
import {MODAL_LESSON_CHAPTER_DELETE} from '#/plugin/lesson/resources/lesson/modals/chapter'

// todo : use standard form buttons

const ChapterFormComponent = props =>
  <FormData
    name={selectors.CHAPTER_EDIT_FORM_NAME}
    sections={[
      {
        id: 'chapter',
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
            name: 'move',
            type: 'boolean',
            label: trans('move_chapter', {}, 'icap_lesson'),
            displayed: !props.isNew
          },
          {
            name: 'parentSlug',
            type: 'choice',
            label: trans('move_destination', {}, 'icap_lesson'),
            required: true,
            displayed: props.isNew || props.chapterWillBeMoved,
            options: {
              multiple: false,
              condensed: true,
              choices: buildParentChapterChoices(props.tree, props.chapter)
            },
            onChange: value => props.positionChange(value)
          },
          {
            name: 'position',
            type: 'choice',
            label: trans('move_relation', {}, 'icap_lesson'),
            required: false,
            displayed: props.hasParentSlug && (props.isNew || props.chapterWillBeMoved) && !props.isRootSelected,
            disabled: false,
            options: {
              condensed: false,
              multiple: false,
              choices: {
                subchapter: trans('subchapter', {}, 'icap_lesson'),
                sibling: trans('sibling', {}, 'icap_lesson')
              }
            }
          },
          {
            name: 'order.subchapter',
            type: 'choice',
            label: trans('options'),
            required: false,
            displayed: props.hasParentSlug && (props.isNew ||props.chapterWillBeMoved) && props.isSubchapterSelected,
            options: {
              condensed: false,
              multiple: false,
              choices: {
                first: trans('first', {}, 'icap_lesson'),
                last: trans('last', {}, 'icap_lesson')
              }
            }
          },
          {
            name: 'order.sibling',
            type: 'choice',
            label: trans('options'),
            required: false,
            displayed: props.hasParentSlug && (props.isNew || props.chapterWillBeMoved) && props.isSiblingSelected,
            options: {
              condensed: false,
              multiple: false,
              choices: {
                before: trans('before', {}, 'icap_lesson'),
                after: trans('after', {}, 'icap_lesson')
              }
            }
          },
          {
            name: 'text',
            type: 'html',
            label: trans('text'),
            required: true,
            options: {
              workspace: props.workspace
            }
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
        icon="fa fa-save"
        type={CALLBACK_BUTTON}
        className="btn"
        callback={() => {
          props.save(props.isNew, props.lesson.id, props.isNew ? props.parentSlug : props.chapter.slug, props.history, props.path)
        }}
      />
      <Button
        label={trans('cancel')}
        title={trans('cancel')}
        type={CALLBACK_BUTTON}
        className="btn"
        callback={() => {props.cancel(props.history, props.chapter.slug || props.lesson.firstChapterSlug || '', props.path)}}
      />
      {!props.isNew && <Button
        label={trans('delete')}
        title={trans('delete')}
        dangerous={true}
        icon="fa fa-trash-o"
        type={CALLBACK_BUTTON}
        className="btn float-right"
        callback={() => {props.delete(props.lesson.id, props.chapter.slug, props.chapter.title, props.history, props.path)}}
      />}
    </ButtonToolbar>
  </FormData>

const ChapterForm = withRouter(connect(
  state => ({
    path: resourceSelectors.path(state),
    workspace: resourceSelectors.workspace(state),
    lesson: selectors.lesson(state),
    chapter: selectors.chapter(state),
    tree: selectors.treeData(state),
    mode: selectors.mode(state),
    saveEnabled: formSelect.saveEnabled(formSelect.form(state, selectors.CHAPTER_EDIT_FORM_NAME)),
    isNew: formSelect.isNew(formSelect.form(state, selectors.CHAPTER_EDIT_FORM_NAME)),
    parentSlug: formSelect.data(formSelect.form(state, selectors.CHAPTER_EDIT_FORM_NAME)).parentSlug || null,
    hasParentSlug: !!formSelect.data(formSelect.form(state, selectors.CHAPTER_EDIT_FORM_NAME)).parentSlug,
    isRootSelected: formSelect.data(formSelect.form(state, selectors.CHAPTER_EDIT_FORM_NAME)).parentSlug === selectors.treeData(state).slug,
    isSubchapterSelected: formSelect.data(formSelect.form(state, selectors.CHAPTER_EDIT_FORM_NAME)).position === 'subchapter',
    isSiblingSelected: formSelect.data(formSelect.form(state, selectors.CHAPTER_EDIT_FORM_NAME)).position === 'sibling',
    chapterWillBeMoved: !!formSelect.data(formSelect.form(state, selectors.CHAPTER_EDIT_FORM_NAME)).move
  }),
  dispatch => ({
    save: (isNew, lessonId, slug, history, path) => {
      dispatch(formActions.saveForm(selectors.CHAPTER_EDIT_FORM_NAME, [isNew ? 'apiv2_lesson_chapter_create' : 'apiv2_lesson_chapter_update', {lessonId, slug}]))
        .then(
          (success) => {
            history.push(`${path}/${success['slug']}`)
          }
        )
    },
    cancel: (history, slug, path) => {
      dispatch(formActions.cancelChanges(selectors.CHAPTER_EDIT_FORM_NAME))
      history.push(`${path}/${slug}`)
    },
    positionChange: value => {
      dispatch(lessonActions.positionChange(value))
    },
    delete: (lessonId, chapterSlug, chapterTitle, history, path) => {
      dispatch(modalActions.showModal(MODAL_LESSON_CHAPTER_DELETE, {
        deleteChapter: (deleteChildren) => dispatch(lessonActions.deleteChapter(lessonId, chapterSlug, deleteChildren)).then((success) => {
          history.push(success.slug ? `${path}/${success.slug}` : path)
        }),
        chapterTitle: chapterTitle
      }))
    }
  })
)(ChapterFormComponent))

export {
  ChapterForm
}
