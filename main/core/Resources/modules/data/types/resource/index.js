import {ResourceGroup} from '#/main/core/data/types/resource/components/resource-group'

const RESOURCE_TYPE = 'resource'

const resourceDefinition = {
  meta: {
    type: RESOURCE_TYPE
  },
  components: {
    form: ResourceGroup
  }
}

export {
  RESOURCE_TYPE,
  resourceDefinition
}
