import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t, tex, trans, transChoice} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'
import {localeDate} from '#/main/core/layout/data/types/date/utils'
import {MODAL_CONFIRM, MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'

import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {actions} from '#/plugin/exo/bank/actions'

import {
  PageContainer as Page,
  PageHeader,
  PageContent,
  PageActions,
  PageAction
} from '#/main/core/layout/page'

import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

import {getDefinition} from '#/plugin/exo/items/item-types'
import {Icon as ItemIcon} from '#/plugin/exo/items/components/icon.jsx'

const QuestionsPage = props =>
  <Page id="question-bank">
    <PageHeader title={tex('questions_bank')} />

    <PageContent>
      <DataList
        name="questions"
        definition={[
          {
            name: 'type',
            label: tex('type'),
            displayed: true,
            renderer: (rowData) => <ItemIcon name={getDefinition(rowData.type).name} />,
            //type: 'enum' // todo get the one from Nico
          }, {
            name: 'title',
            label: tex('question'),
            type: 'html',
            renderer: (rowData) => rowData.title || rowData.content,
            displayed: true
          }, {
            name: 'selfOnly',
            label: tex('filter_by_self_only'),
            type: 'boolean',
            displayable: false
          }
        ]}

        actions={[
          {
            icon: 'fa fa-fw fa-copy',
            label: t('duplicate'),
            action: (rows) => props.duplicateQuestions(rows, false)
          }, {
            icon: 'fa fa-fw fa-clone',
            label: t('duplicate_model'),
            action: (rows) => props.duplicateQuestions(rows, true)
          }, {
            icon: 'fa fa-fw fa-share',
            label: tex('question_share'),
            action: (rows) => props.shareQuestions(rows),
          }, {
            icon: 'fa fa-fw fa-trash-o',
            label: t('delete'),
            action: (rows) => props.removeQuestions(rows),
            isDangerous: true
          }
        ]}

        card={(row) => ({
          poster: null,
          icon: 'fa fa-book',
          title: row.title,
          subtitle: trans(getDefinition(row.type).name, {}, 'question_types'),
//          contentText: row.meta.description,
//          flags: [
//            row.meta.model && ['fa fa-object-group', t('model')]
//          ].filter(flag => !!flag),
          footer:
            <span>
              created by <b>{row.meta.creator ? row.meta.creator.name : t('unknown')}</b>
            </span>,
          footerLong:
            <span>
              created at <b>{localeDate(row.meta.created)}</b>,
              by <b>{row.meta.creator ? row.meta.creator.name: t('unknown')}</b>
            </span>
        })}
      />
    </PageContent>
  </Page>

QuestionsPage.propTypes = {
  removeQuestions: T.func.isRequired,
  duplicateQuestions: T.func.isRequired,
  shareQuestions: T.func.isRequired
}

function mapDispatchToProps(dispatch) {
  return {
    removeQuestions(questions) {
      dispatch(
        modalActions.showModal(MODAL_DELETE_CONFIRM, {
          title: transChoice('remove_questions', questions.length, {count: questions.length}, 'ujm_exo'),
          question: tex('remove_questions_confirm', {
            workspace_list: questions.map(question => question.title || question.content.substr(0, 40)).join(', ')
          }),
          handleConfirm: () => dispatch(actions.removeQuestions(questions))
        })
      )
    },

    duplicateQuestions(questions, asModel = false) {
      dispatch(
        modalActions.showModal(MODAL_CONFIRM, {
          title: transChoice(asModel ? 'copy_model_questions' : 'copy_questions', questions.length, {count: questions.length}, 'ujm_exo'),
          question: tex(asModel ? 'copy_model_questions_confirm' : 'copy_questions_confirm', {
            workspace_list: questions.map(question => question.title || question.content.substr(0, 40)).join(', ')
          }),
          handleConfirm: () => dispatch(actions.duplicateQuestions(questions, asModel))
        })
      )
    },

    shareQuestions(questions) {
      dispatch(
        modalActions.showModal(MODAL_CONFIRM, {

        })
      )
    }
  }
}

const Questions = connect(null, mapDispatchToProps)(QuestionsPage)

export {
  Questions
}
