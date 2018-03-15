
import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makePageReducer} from '#/main/core/layout/page/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'
import {url} from '#/main/core/api/router'
import {FORM_SUBMIT_SUCCESS} from '#/main/core/data/form/actions'
import {LIST_TOGGLE_SELECT, LIST_TOGGLE_SELECT_ALL} from '#/main/core/data/list/actions'
import cloneDeep from 'lodash/cloneDeep'

const getRoleCollaboratorRole = (workspace) => workspace.roles.find(role => role.name.indexOf('COLLABORATOR') > -1)

export const reducer = makePageReducer({}, {
  workspaces: makeListReducer('workspaces',
    {filters: [{property: 'displayable', value: true}, {property: 'selfRegistration', value: true}]}
  ),
  termOfService: (state = null) => state,
  facets: (state = []) => state,
  options: makeReducer({}, {
    /**
     * Redirects user after successful registration.
     * (It seems a little bit hacky to do it here but it's the simplest way to handle it).
     *
     * @param state
     */
    [FORM_SUBMIT_SUCCESS+'/user']: (state) => {
      if (state.redirectAfterLoginUrl) {
        window.location = state.redirectAfterLoginUrl
      } else {
        switch (state.redirectAfterLoginOption) {
          case 'DESKTOP':
            window.location = url(['claro_desktop_open'])
        }
      }
    }
  }),
  user: makeFormReducer('user', {
    new: true,
    data: {roles: []}
  }, {
    data: makeReducer({}, {
      [LIST_TOGGLE_SELECT+'/workspaces']: (state, action) => {
        const user = cloneDeep(state)

        action.selected ?
          user.roles.push(getRoleCollaboratorRole(action.row)):
          user.roles.splice(user.roles.indexOf(role => role.id === getRoleCollaboratorRole(action.row).id))

        return user
      },
      [LIST_TOGGLE_SELECT_ALL+'workspaces']: (state) => {
        const user = cloneDeep(state)
        //console.log(action)
        return user
      }
    })
  })
})
