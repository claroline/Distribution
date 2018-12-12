import React from 'react'
import {connect} from 'react-redux'
import {trans} from '#/main/app/intl/translation'
import {FormData} from '#/main/app/content/form/containers/data'
import {FormSections, FormSection} from '#/main/app/content/form/components/sections'
import {ListData} from '#/main/app/content/list/containers/data'
import {EvidenceList} from '#/plugin/open-badge/badge/badges/components/evidence-list'

import {
  actions as formActions,
  selectors as formSelect
} from '#/main/app/content/form/store'

// TODO : add tools
const AssertionPageComponent = (props) => {
  return (
    <FormData
      {...props}
      name="badges.assertion"
      meta={true}
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
              url: ['apiv2_assertion_evidences', {badge: props.assertion.id}],
              autoload: props.assertion.id && !props.new
            }}
            primaryAction={EvidenceList.open}
            delete={{
              url: ['apiv2_badge_remove_users', {badge: props.assertion.id}]
            }}
            definition={EvidenceList.definition}
            card={EvidenceList.card}
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
  (dispatch, ownProps) =>({
    updateProp(propName, propValue) {
      dispatch(formActions.updateProp(ownProps.name, propName, propValue))
    }
  })
)(AssertionPageComponent)

export {
  AssertionPage as Assertion
}
