import {registry} from '#/main/app/plugins/registry'

/**
 * Declares applications provided by the Core plugin.
 */
registry.add('core', {
  actions: {
    // all resources
    'about'    : () => { return import(/* webpackChunkName: "resource-action-about" */     '#/main/core/resource/actions/about') },
    'configure': () => { return import(/* webpackChunkName: "resource-action-configure" */ '#/main/core/resource/actions/configure') },
    'delete'   : () => { return import(/* webpackChunkName: "resource-action-delete" */    '#/main/core/resource/actions/delete') },
    'edit'     : () => { return import(/* webpackChunkName: "resource-action-edit" */      '#/main/core/resource/actions/edit') },
    'export'   : () => { return import(/* webpackChunkName: "resource-action-export" */    '#/main/core/resource/actions/export') },
    'logs'     : () => { return import(/* webpackChunkName: "resource-action-logs" */      '#/main/core/resource/actions/logs') },
    'open'     : () => { return import(/* webpackChunkName: "resource-action-open" */      '#/main/core/resource/actions/open') },
    'publish'  : () => { return import(/* webpackChunkName: "resource-action-publish" */   '#/main/core/resource/actions/publish') },
    'rights'   : () => { return import(/* webpackChunkName: "resource-action-rights" */    '#/main/core/resource/actions/rights') },
    'unpublish': () => { return import(/* webpackChunkName: "resource-action-unpublish" */ '#/main/core/resource/actions/unpublish') },

    // directory resource
    'add'      : () => { return import(/* webpackChunkName: "resource-action-add" */       '#/main/core/resources/directory/actions/add') },

    // file resource
    //'download' : () => { return import(/* webpackChunkName: "resource-action-download" */       '#/main/core/resources/file/actions/download') }
  },

  resources: {
    'text': () => { return import(/* webpackChunkName: "core-text-resource" */ '#/main/core/resources/text') },
    // todo move me inside exo plugin
    'ujm_exercise': () => { return import(/* webpackChunkName: "plugin-exo-quiz-resource" */ '#/plugin/exo/resources/quiz') }
  },

  tools: {},

  widgets: {
    'list': () => { return import(/* webpackChunkName: "core-resource-list-widget" */ '#/main/core/widget/types/list') },

    'simple'       : () => { return import(/* webpackChunkName: "core-simple-widget" */ '#/main/core/widget/types/simple') },
    'resource-list': () => { return import(/* webpackChunkName: "core-resource-list-widget" */ '#/main/core/widget/types/resource-list') },
    'user-list'    : () => { return import(/* webpackChunkName: "core-user-list-preset" */ '#/main/core/widget/types/user-list') }
  }
})
