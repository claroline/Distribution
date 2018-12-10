import {trans} from '#/main/app/intl/translation'

import {BadgeCard} from '#/plugin/open-badge/badge/badge-card'

const BadgeList = {
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
