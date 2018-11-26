import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'

import {TemplateList} from '#/main/core/administration/template/components/template-list'

const Templates = () =>
  <ListData
    name="templates"
    fetch={{
      url: ['apiv2_template_list'],
      autoload: true
    }}
    primaryAction={TemplateList.open}
    actions={(rows) => [
      {
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-pencil',
        label: trans('edit'),
        scope: ['object'],
        target: 'form/' + rows[0].id
      }
    ]}
    delete={{
      url: ['apiv2_template_delete_bulk']
    }}
    definition={TemplateList.definition}
    card={TemplateList.card}
  />

export {
  Templates
}
