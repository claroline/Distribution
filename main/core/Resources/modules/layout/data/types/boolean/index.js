import {parseBool, translateBool} from '#/main/core/layout/data/types/boolean/utils'
import {CheckGroup} from '#/main/core/layout/form/components/group/check-group.jsx'
import {BooleanSearch} from '#/main/core/layout/data/types/boolean/components/search.jsx'
import {BooleanCell} from '#/main/core/layout/data/types/boolean/components/table.jsx'

const BOOLEAN_TYPE = 'boolean'

const booleanDefinition = {
  parse: (display) => parseBool(display),
  render: (raw) => translateBool(raw),

  validate: (value) => {
    try {
      parseBool(value)

      return true
    } catch (e) {
      return false
    }
  },
  components: {
    table: BooleanCell,
    search: BooleanSearch,
    form: CheckGroup
  }
}

export {
  BOOLEAN_TYPE,
  booleanDefinition
}
