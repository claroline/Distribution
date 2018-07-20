import {chain, string, notBlank} from '#/main/core/validation'
import {ResourceGroup} from '#/main/core/data/types/resource/components/resource-group.jsx'

const RESOURCE_TYPE = 'resource'

const resourceDefinition = {
  meta: {
    type: RESOURCE_TYPE
  },
  validate: (value, options) => chain(value, options, [notBlank]),
  components: {
    form: ResourceGroup
  }
}

export {
  RESOURCE_TYPE,
  resourceDefinition
}
