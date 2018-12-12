import React from 'react'
import {connect} from 'react-redux'
import {trans} from '#/main/app/intl/translation'

import {FormData} from '#/main/app/content/form/containers/data'
import {FormSections, FormSection} from '#/main/app/content/form/components/sections'
import {ListData} from '#/main/app/content/list/containers/data'
import {MODAL_BUTTON} from '#/main/app/buttons'

import {EvidenceList} from '#/plugin/open-badge/tools/badges/evidence/components/evidence-list'
import {MODAL_BADGE_EVIDENCE} from '#/plugin/open-badge/tools/badges/modals/evidence'

import {
  selectors as formSelect
} from '#/main/app/content/form/store'

// TODO : add tools
const AssertionPageComponent = (props) => {
  return (
    <FormData
      {...props}
      name="badges.assertion"
      meta={false}
      buttons={true}
      target={(assertion, isNew) => isNew ?
        ['apiv2_assertion_create'] :
        ['apiv2_assertion_update', {id: assertion.id}]
      }
      sections={[
        {
          title: trans('assertion'),
          primary: true,
          fields: [
            {
              name: 'user.username',
              type: 'string',
              readOnly: true,
              disabled: true
            },
            {
              name: 'badge.name',
              type: 'string',
              label: trans('name'),
              readOnly: true,
              disabled: true
            },
            {
              name: 'badge.image',
              type: 'file',
              label: trans('image'),
              readOnly: true,
              disabled: true
            }
          ]
        }
      ]}
    >
      <FormSections
        level={3}
      >
        <FormSection
          className="embedded-list-section"
          icon="fa fa-fw fa-user"
          title={trans('evidences')}
          disabled={props.new}
        >
          <ListData
            name="badges.assertion.evidences"
            fetch={{
              url: ['apiv2_assertion_evidences', {assertion: props.assertion.id}],
              autoload: props.assertion.id && !props.new
            }}
            primaryAction={EvidenceList.open}
            delete={{
              url: ['apiv2_evidence_delete_bulk']
            }}
            definition={EvidenceList.definition}
            card={EvidenceList.card}
            actions={[
              {
                type: MODAL_BUTTON,
                icon: 'fa fa-fw fa-plus',
                label: trans('add_evidence'),
                modal: [MODAL_BADGE_EVIDENCE, {
                  assertion: props.assertion
                }]
              }
            ]}
          />
        </FormSection>
      </FormSections>
    </FormData>)
}

const AssertionPage = connect(
  (state) => ({
    context: state.context,
    new: formSelect.isNew(formSelect.form(state, 'badges.assertion')),
    assertion: formSelect.data(formSelect.form(state, 'badges.assertion'))
  }),
  null
)(AssertionPageComponent)

export {
  AssertionPage as Assertion
}
