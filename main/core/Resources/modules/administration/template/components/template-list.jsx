import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {TemplateCard} from '#/main/core/administration/template/data/components/template-card'

const TemplateList = {
  open: (row) => ({
    type: LINK_BUTTON,
    target: `/form/${row.id}`,
    label: trans('edit', {}, 'actions')
  }),
  definition: [
    {
      name: 'name',
      type: 'string',
      label: trans('name'),
      displayed: true,
      primary: true
    }, {
      name: 'type.name',
      alias: 'typeName',
      type: 'string',
      label: trans('type'),
      displayed: true,
      filterable: false,
      calculated: (row) => trans(row.type.name, {}, 'template')
    }, {
      name: 'subject',
      type: 'string',
      label: trans('subject'),
      displayed: true
    }, {
      name: 'content',
      type: 'html',
      label: trans('content'),
      displayed: true
    }
  ],
  card: TemplateCard
}

export {
  TemplateList
}
