import {trans} from '#/main/app/intl/translation'

import {FieldsGroup} from '#/main/app/data/types/fields/components/group'

// todo add validation

const dataType = {
  name: 'fields',
  meta: {
    icon: 'fa fa-fw fa-dot',
    label: trans('fields'),
    description: trans('fields_desc')
  },
  components: {
    form: FieldsGroup
  }
}

export {
  dataType
}
