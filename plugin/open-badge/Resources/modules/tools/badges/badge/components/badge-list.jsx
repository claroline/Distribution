import {trans} from '#/main/app/intl/translation'

import {BadgeCard} from '#/plugin/open-badge/tools/badges/badge/components/badge-card'

const BadgeList = {
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
      type: 'boolean',
      displayed: true
    }
  ],
  card: BadgeCard
}

export {
  BadgeList
}
