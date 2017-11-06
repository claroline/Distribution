import React from 'react'

import {t} from '#/main/core/translation'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'

const GroupActions = props =>
  <PageActions>
    <PageAction
      id="group-save"
      icon="fa fa-floppy-o"
      title={t('save')}
      action={() => true}
      primary={true}
    />

    <PageAction
      id="group-list"
      icon="fa fa-list"
      title={t('cancel')}
      action="/groups"
    />
  </PageActions>

const Group = props =>
  <div>
    GROUP FORM
  </div>

Group.propTypes = {

}

export {
  GroupActions,
  Group
}
