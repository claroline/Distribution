/* eslint-disable */

import {registry} from '#/main/app/plugins/registry'

registry.add('open-badge', {
  data: {
    types: {
      'badge' : () => { return import(/* webpackChunkName: "plugin-open-badge-data-badge" */  '#/plugin/open-badge/tools/badges/data/types/badge') }
    }
  }
})
