import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as workspaceSelect} from '#/main/core/workspace/selectors'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {MODAL_DATA_PICKER} from '#/main/core/data/list/modals'
import {FormContainer} from '#/main/core/data/form/containers/form'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections'
import {DataListContainer} from '#/main/core/data/list/containers/data-list'
import {UserList} from '#/main/core/administration/user/user/components/user-list'

import {Team as TeamType} from '#/plugin/team/tools/team/prop-types'

const TeamFormComponent = props =>
  <section className="tool-section">
    <h2>{props.isNew ? trans('team_creation', {}, 'team') : trans('team_edition', {}, 'team')}</h2>
    <FormContainer
      level={3}
      name="teams.current"
      buttons={true}
      target={(team, isNew) => isNew ?
        ['apiv2_team_create'] :
        ['apiv2_team_update', {id: team.id}]
      }
      save={{
        type: 'callback',
        target: `/teams/${props.team.id}`,
        callback: () => props.history.push(`/teams/${props.team.id}`)
      }}
      cancel={{
        type: 'link',
        target: '/',
        exact: true
      }}
      sections={[
        {
          id: 'general',
          icon: 'fa fa-fw fa-cogs',
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'name',
              type: 'string',
              label: trans('name'),
              required: true
            }, {
              name: 'description',
              type: 'html',
              label: trans('description')
            // },{
            //   name: 'defaultResource',
            //   type: 'resource',
            //   label: trans('default_resource', {}, 'team'),
            //   disabled: !props.isNew,
            //   displayed: !props.isNew
            }, {
              name: 'maxUsers',
              type: 'number',
              label: trans('max_users', {}, 'team')
            }, {
              name: 'publicDirectory',
              type: 'boolean',
              label: trans('team_directory_public_access', {}, 'team'),
              required: true
            }, {
              name: 'deletableDirectory',
              type: 'boolean',
              label: trans('delete_team_directory', {}, 'team'),
              required: true
            }, {
              name: 'selfRegistration',
              type: 'boolean',
              label: trans('team_self_registration', {}, 'team'),
              required: true
            }, {
              name: 'selfUnregistration',
              type: 'boolean',
              label: trans('team_self_unregistration', {}, 'team'),
              required: true
            }
          ]
        }
      ]}
    >
      <FormSections level={3}>
        {props.team.role &&
          <FormSection
            className="embedded-list-section"
            icon="fa fa-fw fa-users"
            title={trans('team_members', {}, 'team')}
            disabled={props.isNew}
            actions={[
              {
                type: 'callback',
                icon: 'fa fa-fw fa-plus',
                label: trans('add_members', {}, 'team'),
                callback: () => props.pickUsers(props.team.role.id, props.workspaceId)
              }
            ]}
          >
            <DataListContainer
              name="teams.current.users"
              fetch={{
                url: ['apiv2_role_list_users', {id: props.team.role.id}],
                autoload: !props.isNew
              }}
              delete={{
                url: ['apiv2_role_remove_users', {id: props.team.role.id}]
              }}
              definition={UserList.definition}
              card={UserList.card}
            />
          </FormSection>
        }
        {props.team.teamManagerRole &&
          <FormSection
            className="embedded-list-section"
            icon="fa fa-fw fa-users"
            title={trans('team_managers', {}, 'team')}
            disabled={props.isNew}
            actions={[
              {
                type: 'callback',
                icon: 'fa fa-fw fa-plus',
                label: trans('add_managers', {}, 'team'),
                callback: () => props.pickUsers(props.team.teamManagerRole.id, props.workspaceId, true)
              }
            ]}
          >
            <DataListContainer
              name="teams.current.managers"
              fetch={{
                url: ['apiv2_role_list_users', {id: props.team.teamManagerRole.id}],
                autoload: !props.isNew
              }}
              delete={{
                url: ['apiv2_role_remove_users', {id: props.team.teamManagerRole.id}]
              }}
              definition={UserList.definition}
              card={UserList.card}
            />
          </FormSection>
        }
      </FormSections>
    </FormContainer>
  </section>

TeamFormComponent.propTypes = {
  team: T.shape(TeamType.propTypes).isRequired,
  workspaceId: T.string.isRequired,
  isNew: T.bool.isRequired,
  history: T.shape({
    push: T.func.isRequired
  }).isRequired
}

const TeamForm = connect(
  (state) => ({
    team: formSelect.data(formSelect.form(state, 'teams.current')),
    workspaceId: workspaceSelect.workspace(state).uuid,
    isNew: formSelect.isNew(formSelect.form(state, 'teams.current'))
  }),
  (dispatch) => ({
    pickUsers(roleId, workspaceId, pickManagers = false) {
      dispatch(modalActions.showModal(MODAL_DATA_PICKER, {
        icon: 'fa fa-fw fa-user',
        title: pickManagers ? trans('add_managers', {}, 'team') : trans('add_members', {}, 'team'),
        confirmText: trans('add'),
        name: 'teams.current.usersPicker',
        definition: UserList.definition,
        card: UserList.card,
        fetch: {
          url: ['apiv2_workspace_list_users', {id: workspaceId}],
          autoload: true
        },
        handleSelect: (selected) => console.log(selected)
      }))
    }
  })
)(TeamFormComponent)

export {
  TeamForm
}