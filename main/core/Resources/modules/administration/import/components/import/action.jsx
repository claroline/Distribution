import React from 'react'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {makeSaveAction} from '#/main/core/data/form/containers/form-save.jsx'

const ImportAction = makeSaveAction('import', formData => {
  return {
    create: ['apiv2_transfer_execute', {action: formData.action}],
    update: ['apiv2_transfer_execute', {action: formData.action}]
  }
})(PageAction)

const Action = () =>
  <PageActions>
    <ImportAction/>
  </PageActions>

export {Action}
