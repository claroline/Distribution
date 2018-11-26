import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {selectors as formSelect} from '#/main/app/content/form/store/selectors'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {FormData} from '#/main/app/content/form/containers/data'
import {FormSections, FormSection} from '#/main/app/content/form/components/sections'
// import {MODAL_DATA_LIST} from '#/main/app/modals/list'
// import {actions as modalActions} from '#/main/app/overlay/modal/store'

import {actions} from '#/main/core/administration/template/store'
import {constants} from '#/main/core/administration/template/constants'
import {Template as TemplateType} from '#/main/core/administration/template/prop-types'
import {UserList} from '#/main/core/administration/user/user/components/user-list'

const TemplateForm = props =>
  <FormData
    level={2}
    name="template"
    target={(template, isNew) => isNew ?
      ['apiv2_template_create'] :
      ['apiv2_template_update', {id: template.id}]
    }
    buttons={true}
    cancel={{
      type: LINK_BUTTON,
      target: '/',
      exact: true
    }}
    sections={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'name',
            type: 'string',
            label: trans('name'),
            required: true
          }, {
            name: 'type',
            type: 'template_type',
            label: trans('type'),
            required: true
          }, {
            name: 'subject',
            type: 'string',
            label: trans('subject'),
            required: true
          }, {
            name: 'content',
            type: 'html',
            label: trans('content'),
            required: true
          }, {
            name: 'lang',
            type: 'string',
            label: trans('lang'),
            required: true
          }
        ]
      }
    ]}
  >
    <FormSections level={3}>
      <FormSection
        icon="fa fa-fw fa-exchange-alt"
        title={trans('parameters')}
      >
        <div className="alert alert-info">
          {trans('placeholders_info', {}, 'template')}
        </div>
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>{trans('parameter', {}, 'template')}</th>
              <th>{trans('description')}</th>
            </tr>
          </thead>
          <tbody>
            {constants.DEFAULT_PLACEHOLDERS.map(placeholder =>
              <tr>
                <td>{`%${placeholder}%`}</td>
                <td>{trans(`${placeholder}_desc`, {}, 'template')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </FormSection>
    </FormSections>
  </FormData>

TemplateForm.propTypes = {
  new: T.bool.isRequired,
  template: T.shape(TemplateType.propTypes).isRequired,
}

const Template = connect(
  state => ({
    new: formSelect.isNew(formSelect.form(state, 'template')),
    template: formSelect.data(formSelect.form(state, 'template'))
  }),
  // dispatch =>({
  //   pickUsers(taskId) {
  //     dispatch(modalActions.showModal(MODAL_DATA_LIST, {
  //       icon: 'fa fa-fw fa-user',
  //       title: trans('add_users'),
  //       confirmText: trans('add'),
  //       name: 'picker',
  //       definition: UserList.definition,
  //       card: UserList.card,
  //       fetch: {
  //         url: ['apiv2_user_list'],
  //         autoload: true
  //       },
  //       handleSelect: (selected) => dispatch(actions.addUsers(taskId, selected))
  //     }))
  //   }
  // })
)(TemplateForm)

export {
  Template
}
