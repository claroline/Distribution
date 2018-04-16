import React from 'react'

import {trans} from '#/main/core/translation'
import {
  PageContainer,
  PageActions,
  PageHeader,
  PageContent
} from '#/main/core/layout/page'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions'

import {WorkspaceForm} from '#/main/core/workspace/components/form'

const Parameters = () =>
  <PageContainer>
    <PageHeader
      title={trans('parameters', {}, 'tools')}
    >
      <PageActions>
        <FormPageActionsContainer
          formName="parameters"
          target={(workspace) => ['apiv2_workspace_update', {id: workspace.id}]}
          opened={true}
        />
      </PageActions>
    </PageHeader>

    <PageContent>
      <WorkspaceForm name="parameters" />
    </PageContent>
  </PageContainer>

export {
  Parameters
}
