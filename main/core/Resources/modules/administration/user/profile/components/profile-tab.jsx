import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {CheckGroup} from '#/main/core/layout/form/components/group/check-group.jsx'
import {TextGroup} from '#/main/core/layout/form/components/group/text-group.jsx'

import {actions} from '#/main/core/administration/user/profile/actions'
import {select} from '#/main/core/administration/user/profile/selectors'

const ProfileTabActions = () =>
  <div>
    page actions
  </div>

const Tabs = props =>
  <ul className="user-profile-sections nav nav-pills nav-stacked">
    <li role="presentation" className="active">
      <a href="">Infos personnelles</a>
    </li>
    <li role="presentation">
      <a href="">Scolarité</a>
    </li>
    <li className="add-tab" role="presentation">
      <a
        role="button"
        href=""
        onClick={e => {
          e.preventDefault()
          props.addTab()
        }}
      >
        <span className="fa fa-plus" />
        Ajouter un onglet
      </a>
    </li>
  </ul>

Tabs.propTypes = {
  currentTab: T.string.isRequired,
  tabs: T.object,
  addTab: T.func.isRequired,
  removeTab: T.func.isRequired
}

const CurrentTab = props =>
  <form className="col-md-9">
    <FormSections level={2}>
      <FormSection
        id="tab-parameters"
        icon="fa fa-fw fa-cog"
        title={t('parameters')}
      >
        <TextGroup
          id="tab-name"
          label={t('title')}
          value=""
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

    {0 < props.sections.length &&
      <FormSections level={2}>
        {props.sections.map(section =>
          <FormSection
            id={section.id}
            title={section.title}
          >
            fields
          </FormSection>
        )}
      </FormSections>
    }

    {0 === props.sections.length &&
      <div className="no-section-info">Aucune section n'est associée à cet onglet.</div>
    }

    <div className="text-center">
      <button
        type="button"
        className="add-section btn btn-primary"
        onClick={props.addSection}
      >
        Créer une nouvelle section
      </button>
    </div>
  </form>

CurrentTab.propTypes = {
  sections: T.array,
  addSection: T.func.isRequired,
  removeSection: T.func.isRequired
}

const Profile = props =>
  <div className="user-profile row">
    <div className="col-md-3">
      <Tabs
        tabs={props.tabs}
        currentTab={props.currentTab}
        addTab={props.addTab}
        removeTab={props.removeTab}
      />
    </div>

    <CurrentTab
      sections={props.sections}
    />
  </div>

Profile.propTypes = {
  currentTab: T.string,
  tabs: T.arrayOf(T.shape({
    id: T.string.isRequired,
    title: T.string.isRequired
  })).isRequired,
  addTab: T.func.isRequired,
  removeTab: T.func.isRequired,
  addSection: T.func.isRequired
}

Profile.defaultProps = {
  sections: []
}

function mapStateToProps(state) {
  return {
    currentTab: select.currentTab(state),
    tabs: select.tabs(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addTab() {
      dispatch(actions.addTab())
    },
    removeTab(tabId) {
      dispatch(actions.removeTab(tabId))
    }
  }
}

const ConnectedProfile = connect(mapStateToProps, mapDispatchToProps)(Profile)

export {
  ProfileTabActions,
  ConnectedProfile as ProfileTab
}
