import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {selectors as formSelectors} from '#/main/app/content/form/store/selectors'
import {ListData} from '#/main/app/content/list/containers/data'
import {DetailsData} from '#/main/app/content/details/containers/data'
// import {LinkButton} from '#/main/app/button'
import {LinkButton} from '#/main/app/buttons/link/components/button'

import {trans} from '#/main/core/translation'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections'
import {UserList} from '#/main/core/administration/user/user/components/user-list'

import {selectors} from '#/plugin/team/tools/team/store'
import {Team as TeamType} from '#/plugin/team/tools/team/prop-types'

const TeamComponent = props =>
  <div>
    {props.canEdit &&
      <LinkButton
        className="btn-link page-actions-btn pull-right"
        disabled={!props.canEdit}
        target={`/team/form/${props.team.id}`}
      >
        <span className="fa fa-fw fa-pencil" />
      </LinkButton>
    }
    <DetailsData
      name="teams.current"
      title={props.team.name}
      sections={[
        {
          id: 'general',
          icon: 'fa fa-fw fa-cogs',
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'description',
              type: 'html',
              label: trans('description')
            }, {
              name: 'maxUsers',
              type: 'number',
              label: trans('max_users', {}, 'team')
            }, {
              name: 'selfRegistration',
              type: 'boolean',
              label: trans('team_self_registration', {}, 'team')
            }, {
              name: 'selfUnregistration',
              type: 'boolean',
              label: trans('team_self_unregistration', {}, 'team')
            }
          ]
        }
      ]}
    />
    <FormSections level={3}>
      {props.team.role &&
        <FormSection
          className="embedded-list-section"
          icon="fa fa-fw fa-users"
          title={trans('team_members', {}, 'team')}
        >
          <ListData
            name="teams.current.users"
            fetch={{
              url: ['apiv2_role_list_users', {id: props.team.role.id}],
              autoload: true
            }}
            definition={UserList.definition}
            card={UserList.card}
          />
        </FormSection>
      }
      {props.team.teamManagerRole &&
        <FormSection
          className="embedded-list-section"
          icon="fa fa-fw fa-graduation-cap"
          title={trans('team_managers', {}, 'team')}
        >
          <ListData
            name="teams.current.managers"
            fetch={{
              url: ['apiv2_role_list_users', {id: props.team.teamManagerRole.id}],
              autoload: true
            }}
            definition={UserList.definition}
            card={UserList.card}
          />
        </FormSection>
      }
    </FormSections>
  </div>

TeamComponent.propTypes = {
  team: T.shape(TeamType.propTypes).isRequired,
  canEdit: T.bool.isRequired
}

const Team = connect(
  (state) => ({
    team: formSelectors.data(formSelectors.form(state, 'teams.current')),
    canEdit: selectors.canEdit(state)
  })
)(TeamComponent)


export {
  Team
}