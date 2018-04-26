import {trans} from '#/main/core/translation'

import {ChoiceGroup} from '#/main/core/layout/form/components/group/choice-group'
import {ChoiceSearch} from '#/main/core/data/types/choice/components/search'

const CHOICE_TYPE = 'choice'

const choiceDefinition = {
  meta: {
    type: CHOICE_TYPE,
    creatable: true,
    icon: 'fa fa-fw fa fa-list',
    label: trans('choice'),
    description: trans('choice_desc')
  },

  /**
   * The list of configuration fields.
   */
  configure: (options) => [
    {
      name: 'multiple',
      type: 'boolean',
      label: trans('allow_multiple_responses')
    }, {
      name: 'condensed',
      type: 'boolean',
      label: trans('condensed_display')
    }
  ],
  parse: (display, options) => Object.keys(options.choices).find(enumValue => display === options.choices[enumValue]),
  render: (raw, options) => options.choices[raw],
  validate: (value, options) => !!options.choices[value],
  components: {
    search: ChoiceSearch,
    form: ChoiceGroup
  }
}

export {
  CHOICE_TYPE,
  choiceDefinition
}
