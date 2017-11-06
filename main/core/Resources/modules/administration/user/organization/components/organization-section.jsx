import React from 'react'

import {PageSection} from '#/main/core/layout/page/components/page-section.jsx'

const OrganizationSection = props =>
  <PageSection
    path="/organizations"
    icon="fa fa-building"
    title={t('organizations')}
    actions={[
      {
        icon: 'fa fa-plus',
        label: t('add_organization'),
        action: '/organizations/add',
        primary: true
      }, {
        icon: 'fa fa-download',
        label: t('import_organizations'),
        action: '/organizations/import'
      }
    ]}
  >
    Organizations
  </PageSection>

export {
  OrganizationSection
}
