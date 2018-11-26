import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {selectors as formSelect} from '#/main/app/content/form/store/selectors'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {FormData} from '#/main/app/content/form/containers/data'
import {FormSections, FormSection} from '#/main/app/content/form/components/sections'

import {actions, selectors} from '#/main/core/administration/template/store'
import {constants} from '#/main/core/administration/template/constants'
import {Template as TemplateType} from '#/main/core/administration/template/prop-types'

const TemplateForm = (props) =>
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
            type: 'choice',
            label: trans('lang'),
            required: true,
            options: {
              noEmpty: true,
              condensed: true,
              choices: props.locales.reduce((acc, locale) => {
                acc[locale] = locale

                return acc
              }, {})
            }
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
            {props.template.type && props.template.type.placeholders && props.template.type.placeholders.map(placeholder =>
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
  locales: T.arrayOf(T.string)
}

const Template = connect(
  state => ({
    new: formSelect.isNew(formSelect.form(state, 'template')),
    template: formSelect.data(formSelect.form(state, 'template')),
    locales: selectors.locales(state)
  })
)(TemplateForm)

export {
  Template
}
