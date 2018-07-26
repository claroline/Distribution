import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {actions as formActions} from '#/main/core/data/form/actions'
import {
  PageContainer,
  PageHeader,
  PageActions,
  PageAction,
  MoreAction
} from '#/main/core/layout/page'
import {RoutedPageContent} from '#/main/core/layout/router/components/page'

import {selectors} from '#/plugin/team/tools/team/store'
import {TeamParams as TeamParamsType} from '#/plugin/team/tools/team/prop-types'
import {Editor} from '#/plugin/team/tools/team/components/editor'
import {Teams} from '#/plugin/team/tools/team/components/teams'
import {Team} from '#/plugin/team/tools/team/components/team'
import {TeamForm} from '#/plugin/team/tools/team/components/team-form'

const TeamToolComponent = props =>
  <PageContainer>
    <PageHeader title={trans('team', {}, 'team')}>
      <PageActions>
        <PageAction
          id="team-add"
          type="link"
          icon="fa fa-fw fa-plus"
          primary={true}
          label={trans('create_a_team', {}, 'team')}
          target="/team/form"
        />
        <PageAction
          id="team-params"
          type="link"
          icon="fa fa-fw fa-cog"
          label={trans('configure')}
          target="/edit"
        />
        <MoreAction
          actions={[
            {
              type: 'link',
              icon: 'fa fa-fw fa-home',
              label: trans('home'),
              target: '/',
              exact: true
            }
          ]}
        />
      </PageActions>
    </PageHeader>
    <RoutedPageContent
      key="team-tool-content"
      headerSpacer={true}
      redirect={[
        {from: '/', exact: true, to: '/teams'}
      ]}
      routes={[
        {
          path: '/edit',
          component: Editor,
          // disabled: !props.editable,
          onLeave: () => props.resetForm(),
          onEnter: () => props.resetForm(props.teamParams)
        }, {
          path: '/teams',
          component: Teams
        }, {
          path: '/teams/:id',
          component: Team,
          // onEnter: (params) => {
          //   props.openEntryForm(params.id, props.clacoForm.id)
          //   props.loadEntryUser(params.id)
          // },
          // onLeave: () => {
          //   props.resetEntryForm()
          //   props.resetEntryUser()
          // }
        }, {
          path: '/team/form/:id?',
          component: TeamForm,
          // onEnter: () => {
          //   props.openEntryForm(params.id, props.clacoForm.id, props.clacoForm.fields)
          //
          //   if (params.id) {
          //     props.loadEntryUser(params.id)
          //   }
          // },
          // onLeave: () => {
          //   props.resetEntryForm()
          //   props.resetEntryUser()
          // }
        }
      ]}
    />
  </PageContainer>

TeamToolComponent.propTypes = {
  teamParams: T.shape(TeamParamsType.propTypes).isRequired,
  resetForm: T.func.isRequired
}

const TeamTool = connect(
  (state) => ({
    teamParams: selectors.teamParams(state)
  }),
  (dispatch) => ({
    resetForm(formData) {
      dispatch(formActions.resetForm('teamParamsForm', formData))
    },
    // openTeamForm(id, clacoFormId, fields = []) {
    //   const defaultValue = {
    //     id: makeId(),
    //     values: {},
    //     clacoForm: {
    //       id: clacoFormId
    //     },
    //     user: authenticatedUser,
    //     categories: [],
    //     keywords: []
    //   }
    //   fields.forEach(f => {
    //     if (f.type === 'date') {
    //       defaultValue.values[f.id] = now()
    //     }
    //   })
    //
    //   dispatch(entryActions.openForm('entries.current', id, defaultValue))
    // },
    // resetTeamForm() {
    //   dispatch(formActions.resetForm('entries.current', {}, true))
    // }
  })
)(TeamToolComponent)

export {
  TeamTool
}