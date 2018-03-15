import {trans} from '#/main/core/translation'

//import {SelectGroup} from '#/main/core/layout/form/components/group/select-group.jsx'
import {EnumPlusSearch} from '#/main/core/data/types/enum-plus/components/search.jsx'

const ENUM_PLUS_TYPE = 'enum-plus'

const enumPlusDefinition = {
  meta: {
    type: ENUM_PLUS_TYPE,
    creatable: true,
    icon: 'fa fa-fw fa fa-list',
    label: trans('enum_plus'),
    description: trans('enum_plus_desc')
  },
  parse: (display, options) => Object.keys(options.choices).find(enumValue => display === options.choices[enumValue]),
  render: (raw, options) => options.choices[raw],
  validate: (value, options) => !!options.choices[value],
  components: {
    search: EnumPlusSearch
    //form: SelectGroup
  }
}

export {
  ENUM_PLUS_TYPE,
  enumPlusDefinition
}
