import {SelectGroup} from '#/main/core/layout/form/components/group/select-group.jsx'
import {EnumSearch} from '#/main/core/data/types/enum/components/search.jsx'

const ENUM_TYPE = 'enum'

const enumDefinition = {
  parse: (display, options) => Object.keys(options.choices).find(enumValue => display === options.choices[enumValue]),
  render: (raw, options) => options.choices[raw],
  validate: (value, options) => !!options.choices[value],
  components: {
    search: EnumSearch,
    form: SelectGroup
  }
}

export {
  ENUM_TYPE,
  enumDefinition
}
