import difference from 'lodash/difference'

import {trans, tval} from '#/main/app/intl/translation'

import {ChoiceGroup} from '#/main/core/layout/form/components/group/choice-group'
import {ChoiceSearch} from '#/main/app/data/choice/components/search'

const dataType = {
  name: 'choice',
  meta: {
    creatable: true,
    icon: 'fa fa-fw fa fa-list',
    label: trans('choice'),
    description: trans('choice_desc')
  },

  /**
   * The list of configuration fields.
   */
  configure: () => [
    {
      name: 'multiple',
      type: 'boolean',
      label: trans('allow_multiple_responses')
    }, {
      name: 'condensed',
      type: 'boolean',
      label: trans('condensed_display')
    }, {
      name: 'choices',
      type: 'enum',
      label: trans('choices_list'),
      options: {
        placeholder: trans('no_choice'),
        addButtonLabel: trans('add_a_choice'),
        unique: true
      },
      required: true
    }
  ],
  parse: (display, options) => Object.keys(options.choices).find(enumValue => display === enumValue || display === options.choices[enumValue]),
  render: (raw, options) => {
    if (Array.isArray(raw)) {
      return raw.map(value => options.choices[value]).join(', ')
    } else {
      return options.choices[raw]
    }
  },
  validate: (value, options) => {
    const choices = options.choices || {}

    if (options.multiple) {
      const unknown = difference(value, Object.keys(choices))
      if (0 !== unknown.length) {
        return tval('This value is invalid.')
      }
    } else if (!choices.hasOwnProperty(value)) {
      return tval('This value is invalid.')
    }
  },
  components: {
    search: ChoiceSearch,
    form: ChoiceGroup
  }
}

export {
  dataType
}
