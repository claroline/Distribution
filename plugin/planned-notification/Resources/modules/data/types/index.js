import {registerType} from '#/main/core/data'

import {MESSAGE_TYPE, messageDefinition} from '#/plugin/planned-notification/data/types/message'

function registerPlannedNotificationTypes() {
  registerType(MESSAGE_TYPE,  messageDefinition)
}

export {
  registerPlannedNotificationTypes
}