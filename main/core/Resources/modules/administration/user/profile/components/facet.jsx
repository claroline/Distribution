import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'

import {actions as formActions} from '#/main/core/data/form/actions'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {CheckGroup} from '#/main/core/layout/form/components/group/check-group.jsx'
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
    id={props.section.id}
    title={props.section.title}
    level={props.level}
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

    <hr/>

    <FieldList
      id={`${props.section.id}-field-list`}
      fields={props.section.fields}
      onChange={(fields) => props.updateProp('fields', fields)}
      showModal={props.showModal}
    />
  </FormSection>

FacetSection.propTypes = {
  //level: T.number.isRequired,
  section: T.shape(
    ProfileFacetSectionTypes.propTypes
  ).isRequired,
  remove: T.func.isRequired,
  updateProp: T.func.isRequired,
  showModal: T.func.isRequired
}

const ProfileFacetComponent = props =>
  <div className="profile-facet">
    <FormSections level={2}>
      <FormSection
        id="tab-parameters"
        icon="fa fa-fw fa-cog"
        title={t('parameters')}
      >
        <TextGroup
          id="tab-name"
          label={t('title')}
          value={props.facet.title}
          onChange={() => true}
        />

        <CheckGroup
          id="tab-on-create"
          label="Afficher à la création"
          value={false}
          onChange={() => true}
        />
      </FormSection>

      <FormSection
        id="tab-restrictions"
        icon="fa fa-fw fa-key"
        title={t('access_restrictions')}
      >
        Access roles
      </FormSection>
    </FormSections>

    <hr />

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
  </div>

ProfileFacetComponent.propTypes = {
  index: T.number.isRequired,
  facet: T.shape(
    ProfileFacetTypes.propTypes
  ).isRequired,
  addSection: T.func.isRequired,
  removeSection: T.func.isRequired,
  updateProp: T.func.isRequired,
  showModal: T.func.isRequired
}

const ProfileFacet = connect(
  state => ({
    index: select.currentFacetIndex(state),
    facet: select.currentFacet(state)
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
    showModal(modalType, modalProps) {
      dispatch(modalActions.showModal(modalType, modalProps))
    }
  })
)(ProfileFacetComponent)

export {
  ProfileFacet
}
