import React from 'react'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {t} from '#/main/core/translation'

const Action = () =>
  <PageActions>
    <PageAction
      id="history-action"
      icon="fa fa-books"
      title={t('history')}
      action="#"
    />
  </PageActions>

export {Action}
