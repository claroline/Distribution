import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import omit from 'lodash/omit'

import {t} from '#/main/core/translation'

import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'

import {actions as formActions} from '#/main/core/data/form/actions'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {Form} from '#/main/core/data/form/components/form.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {TextGroup} from '#/main/core/layout/form/components/group/text-group.jsx'
import {FieldList} from '#/main/core/data/form/generator/components/field-list.jsx'

import {
  ProfileFacet as ProfileFacetTypes,
  ProfileFacetSection as ProfileFacetSectionTypes
} from '#/main/core/user/profile/prop-types'

import {actions} from '#/main/core/administration/user/profile/actions'
import {select} from '#/main/core/administration/user/profile/selectors'

// todo manage differences between main / default / plugin facets

const FacetSection = props =>
  <FormSection
    {...omit(props, ['key', 'section', 'remove', 'updateProp', 'showModal'])}
    id={props.section.id}
    title={props.section.title}
    actions={[
      {
        icon: 'fa fa-fw fa-trash-o',
        label: t('delete'),
        action: props.remove,
        dangerous: true
      }
    ]}
  >
    <TextGroup
      id={`section-${props.section.id}-name`}
      label={t('title')}
      value={props.section.title}
      onChange={() => true}
    />

    <div className="form-group">
      <label className="control-label">
        Liste des champs
      </label>

      <FieldList
        id={`${props.section.id}-field-list`}
        fields={props.section.fields}
        onChange={(fields) => props.updateProp('fields', fields)}
        showModal={props.showModal}
      />
    </div>

  </FormSection>

FacetSection.propTypes = {
  section: T.shape(
    ProfileFacetSectionTypes.propTypes
  ).isRequired,
  remove: T.func.isRequired,
  updateProp: T.func.isRequired,
  showModal: T.func.isRequired
}

const ProfileFacetComponent = props =>
  <Form
    level={2}
    className="profile-facet"
    data={props.facet}
    errors={props.errors}
    pendingChanges={props.pendingChanges}
    validating={props.validating}
    sections={[
      {
        id: 'profile-facet-parameters',
        icon: 'fa fa-fw fa-cog',
        title: t('parameters'),
        fields: [
          {
            name: 'title',
            type: 'string',
            label: t('name'),
            required: true
          }, {
            name: 'display.creation',
            type: 'boolean',
            label: t('display_on_create')
          }
        ]
      }, {
        id: 'profile-facet-restrictions',
        icon: 'fa fa-fw fa-key',
        title: t('access_restrictions'),
        fields: [

        ]
      }
    ]}
    updateProp={(propName, propValue) => props.updateProp(`[${props.index}].${propName}`, propValue)}
    setErrors={props.setErrors}
  >
    {0 < props.facet.sections.length &&
      <FormSections level={2}>
        {props.facet.sections.map((section, sectionIndex) =>
          <FacetSection
            key={section.id}
            section={section}
            remove={() => props.removeSection(props.facet.id, section.id)}
            updateProp={(propName, propValue) => props.updateProp(`[${props.index}].sections[${sectionIndex}].${propName}`, propValue)}
            showModal={props.showModal}
          />
        )}
      </FormSections>
    }

    {0 === props.facet.sections.length &&
      <div className="no-section-info">Aucune section n'est associée à cet onglet.</div>
    }

    <div className="text-center">
      <button
        type="button"
        className="add-section btn btn-primary"
        onClick={() => props.addSection(props.facet.id)}
      >
        Créer une nouvelle section
      </button>
    </div>
  </Form>

ProfileFacetComponent.propTypes = {
  index: T.number.isRequired,
  facet: T.shape(
    ProfileFacetTypes.propTypes
  ).isRequired,
  errors: T.object,
  validating: T.bool.isRequired,
  pendingChanges: T.bool.isRequired,
  addSection: T.func.isRequired,
  removeSection: T.func.isRequired,
  updateProp: T.func.isRequired,
  setErrors: T.func.isRequired,
  showModal: T.func.isRequired
}

const ProfileFacet = connect(
  state => ({
    index: select.currentFacetIndex(state),
    facet: select.currentFacet(state),
    // form
    errors: formSelect.errors(formSelect.form(state, select.formName)),
    pendingChanges: formSelect.pendingChanges(formSelect.form(state, select.formName)),
    validating: formSelect.validating(formSelect.form(state, select.formName))
  }),
  dispatch => ({
    addSection(facetId) {
      dispatch(actions.addSection(facetId))
    },
    removeSection(facetId, sectionId) {
      dispatch(
        modalActions.showModal(MODAL_DELETE_CONFIRM, {
          title: t('profile_remove_section'),
          question: t('profile_remove_section_question'),
          handleConfirm: () => dispatch(actions.removeSection(facetId, sectionId))
        })
      )
    },
    updateProp(propName, propValue) {
      dispatch(formActions.updateProp(select.formName, propName, propValue))
    },
    setErrors(errors) {
      dispatch(formActions.setErrors(select.formName, errors))
    },
    showModal(modalType, modalProps) {
      dispatch(modalActions.showModal(modalType, modalProps))
    }
  })
)(ProfileFacetComponent)

export {
  ProfileFacet
}
