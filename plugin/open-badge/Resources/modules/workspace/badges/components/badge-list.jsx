import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {BadgeCard} from '#/plugin/open-badge/badge/badge-card'

const BadgeList = {
  open: (row) => ({
    label: trans('open'),
    type: LINK_BUTTON,
    target: `/badges/form/${row.id}`
  }),
  definition: [
    {
      name: 'name',
      label: trans('name'),
      displayed: true,
      primary: true
    }
  ],
  card: BadgeCard
}

export {
  BadgeList
}
