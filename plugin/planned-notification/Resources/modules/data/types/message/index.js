import {chain, string, notBlank} from '#/main/core/validation'

import {MessageGroup} from '#/plugin/planned-notification/data/types/message/components/message-group.jsx'

const MESSAGE_TYPE = 'message'

const messageDefinition = {
  meta: {
    type: MESSAGE_TYPE
  },

  validate: (value, options) => chain(value, options, [(value) => {
    if (value) {
      const error = chain(value.id, {isHtml: false}, [string, notBlank])

      if (error) {
        return error
      }
    }
  }]),

  components: {
    form: MessageGroup
  }
}

export {
  MESSAGE_TYPE,
  messageDefinition
}