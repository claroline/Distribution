import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {t} from '#/main/core/translation'

const Action = props =>
  <PageActions>
    <PageAction
      id="execute-action"
      icon="fa fa-download"
      title={t('download')}
      action="#"
    />
  </PageActions>

export {Action}
