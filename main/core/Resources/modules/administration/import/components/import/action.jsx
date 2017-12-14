import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {t} from '#/main/core/translation'
import {makeSaveAction} from '#/main/core/data/form/containers/form-save.jsx'
/*
const ImportAction = makeSaveAction('transfer.import', formData => {
  return {
    import: ['apiv2_user_create']
  }
})(PageAction)*/

const Action = () =>
  <PageActions>
  </PageActions>

export {Action}
