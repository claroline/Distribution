import React from 'react'

import {t} from '#/main/core/translation'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {makeSaveAction} from '#/main/core/layout/form/containers/form-save.jsx'
import {FormContainer as Form} from '#/main/core/layout/form/containers/form.jsx'

const GroupSaveAction = makeSaveAction('groups.current')(PageAction)

const GroupActions = props =>
  <PageActions>
    <GroupSaveAction />

    <PageAction
      id="group-list"
      icon="fa fa-list"
      title={t('cancel')}
      action="#/groups"
    />
  </PageActions>

const Group = props =>
  <Form
    level={3}
    name="groups.current"
    sections={[
      {
        id: 'general',
        title: t('general'),
        primary: true,
        fields: [
          {
            name: 'name',
            type: 'string',
            label: t('name')
          }
        ]
      }
    ]}
  />

Group.propTypes = {

}

export {
  GroupActions,
  Group
}
