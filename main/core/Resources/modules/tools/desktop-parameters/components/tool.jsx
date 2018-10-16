import React from 'react'

import {trans} from '#/main/core/translation'
import {PageContainer, PageHeader} from '#/main/core/layout/page'

const Tool = () =>
  <PageContainer>
    <PageHeader
      title={trans('parameters', {}, 'tools')}
    />
    <div>
      Coucou
    </div>
  </PageContainer>

export {
  Tool
}
