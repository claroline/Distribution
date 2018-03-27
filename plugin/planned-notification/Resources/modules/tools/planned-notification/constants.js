import {trans} from '#/main/core/translation'

const WORKSPACE_REGISTRATION = 'workspace-role-subscribe_user'

const TRIGGERING_ACTIONS = {
  [WORKSPACE_REGISTRATION]: trans('workspace_registration_message_object')
}

export const constants = {
  WORKSPACE_REGISTRATION,
  TRIGGERING_ACTIONS
}
