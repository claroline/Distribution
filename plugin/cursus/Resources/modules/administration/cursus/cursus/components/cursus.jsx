import React from 'react'

import {ListData} from '#/main/app/content/list/containers/data'

import {CursusList} from '#/plugin/cursus/administration/cursus/cursus/components/cursus-list'

const Cursus = () =>
  <ListData
    name="cursus.list"
    fetch={{
      url: ['apiv2_cursus_list'],
      autoload: true
    }}
    primaryAction={CursusList.open}
    delete={{
      url: ['apiv2_cursus_delete_bulk']
    }}
    definition={CursusList.definition}
    card={CursusList.card}
  />

export {
  Cursus
}
