import {trans} from '#/main/core/translation'

import {CascadeGroup} from '#/main/core/layout/form/components/group/cascade-group'
import {CascadeSearch} from '#/main/core/data/types/cascade/components/search'

const CASCADE_TYPE = 'cascade'

const cascadeDefinition = {
  meta: {
    type: CASCADE_TYPE,
    creatable: true,
    icon: 'fa fa-fw fa fa-indent',
    label: trans('cascade_list'),
    description: trans('cascade_desc')
  },

  /**
   * The list of configuration fields.
   */
  configure: () => [
    {
      name: 'choices',
      type: 'cascade-enum',
      label: trans('choices_list'),
      options: {
        placeholder: trans('no_choice'),
        addButtonLabel: trans('add_a_choice'),
        addChildButtonLabel: trans('add_a_sub_choice'),
        unique: true
      },
      required: true
    }
  ],
  parse: (display, options) => Object.keys(options.choices).find(enumValue => display === options.choices[enumValue]),
  render: (raw) => {
    if (Array.isArray(raw)) {
      return raw.join(', ')
    } else {
      return raw
    }
  },
  validate: (value, options) => !!options.choices[value],
  components: {
    search: CascadeSearch,
    form: CascadeGroup
  }
}

export {
  CASCADE_TYPE,
  cascadeDefinition
}
