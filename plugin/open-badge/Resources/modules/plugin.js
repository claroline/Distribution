/* eslint-disable */

import {registry} from '#/main/app/plugins/registry'

registry.add('ClarolineOpenBadgeBundle', {
  data: {
    types: {
      'badge' : () => { return import(/* webpackChunkName: "plugin-open-badge-data-badge" */  '#/plugin/open-badge/tools/badges/data/types/badge') }
    }
  },
  actions: {
    user: {
      'badges': () => { return import(/* webpackChunkName: "tag-action-workspace-tags" */ '#/plugin/open-badge/user/actions/badges') }
    }
  }
})
