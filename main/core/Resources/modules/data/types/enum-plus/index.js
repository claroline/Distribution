import {trans} from '#/main/core/translation'

//import {SelectGroup} from '#/main/core/layout/form/components/group/select-group.jsx'
import {EnumPlusSearch} from '#/main/core/data/types/enum-plus/components/search.jsx'
import {extractChoice, parseChoice, renderChoice} from '#/main/core/data/types/enum-plus/utils'

const ENUM_PLUS_TYPE = 'enum-plus'

const enumPlusDefinition = {
  meta: {
    type: ENUM_PLUS_TYPE,
    creatable: true,
    icon: 'fa fa-fw fa fa-list',
    label: trans('enum_plus'),
    description: trans('enum_plus_desc')
  },
  parse: (display, options) => parseChoice(display, options.choices, options.transDomain),
  render: (raw, options) => renderChoice(raw, options.choices, options.transDomain),
  validate: (value, options) => extractChoice(value, options.choices) !== null,
  components: {
    search: EnumPlusSearch
    //form: SelectGroup
  }
}

export {
  ENUM_PLUS_TYPE,
  enumPlusDefinition
}
