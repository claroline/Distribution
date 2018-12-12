import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {BadgeCard} from '#/plugin/open-badge/tools/badges/badge/components/badge-card'

const BadgeList = {
  open: (row) => ({
    label: trans('open'),
    type: LINK_BUTTON,
    target: `/badges/view/${row.id}`
  }),
  definition: [
    {
      name: 'name',
      label: trans('name'),
      displayed: true,
      primary: true
    },
    {
      name: 'meta.enabled',
      label: trans('enabled'),
      displayed: true
    }
  ],
  card: BadgeCard
}

export {
  BadgeList
}
