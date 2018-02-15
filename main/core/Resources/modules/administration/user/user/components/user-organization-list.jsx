import {t} from '#/main/core/translation'

import {OrganizationCard} from '#/main/core/administration/user/organization/components/organization-card.jsx'

function getOrganizationListDefinition(user) {
  console.log(user)
  return [
    {
      name: 'name',
      type: 'string',
      label: t('name'),
      displayed: true,
      primary: true
    }, {
      name: 'meta.default',
      type: 'boolean',
      label: t('default')
    }, {
      name: 'meta.parent',
      type: 'organization',
      label: t('parent')
    }, {
      name: 'email',
      type: 'email',
      label: t('email')
    }, {
      name: 'code',
      type: 'string',
      label: t('code')
    }, {
      name: 'parent',
      type: 'organization',
      label: t('parent')
    }, {
      name: 'isMain',
      type: 'boolean',
      label: t('main'),
      renderer: (rowData) => user.mainOrganization && user.mainOrganization.id === rowData.id ? 'x': rowData.id,
      filterable: false,
      displayed: true
    }
  ]
}


export {
  getOrganizationListDefinition
}
