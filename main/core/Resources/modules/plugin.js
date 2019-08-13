/* eslint-disable */

import {registry} from '#/main/app/plugins/registry'

/**
 * Declares applications provided by the Core plugin.
 */
registry.add('ClarolineCoreBundle', {
  /**
   * Provides menu which can be used in the main header menu.
   */
  header: {
    'search'    : () => { return import(/* webpackChunkName: "core-header-search" */   '#/main/core/header/search') }
  },

  integration: {
    'api' : () => { return import(/* webpackChunkName: "core-integration-api" */ '#/main/core/administration/integration/documentation')},
    'api_tokens' : () => { return import(/* webpackChunkName: "core-integration-api_tokens" */ '#/main/core/administration/integration/apitoken')}
  },

  /**
   * Provides actions for base Claroline objects.
   */
  actions: {
    resource: {
      // all resources
      'about'    : () => { return import(/* webpackChunkName: "core-action-resource-about" */     '#/main/core/resource/actions/about') },
      'configure': () => { return import(/* webpackChunkName: "core-action-resource-configure" */ '#/main/core/resource/actions/configure') },
      'copy'     : () => { return import(/* webpackChunkName: "core-action-resource-copy" */      '#/main/core/resource/actions/copy') },
      'delete'   : () => { return import(/* webpackChunkName: "core-action-resource-delete" */    '#/main/core/resource/actions/delete') },
      'edit'     : () => { return import(/* webpackChunkName: "core-action-resource-edit" */      '#/main/core/resource/actions/edit') },
      'export'   : () => { return import(/* webpackChunkName: "core-action-resource-export" */    '#/main/core/resource/actions/export') },
      'logs'     : () => { return import(/* webpackChunkName: "core-action-resource-logs" */      '#/main/core/resource/actions/logs') },
      'move'     : () => { return import(/* webpackChunkName: "core-action-resource-move" */      '#/main/core/resource/actions/move') },
      'open'     : () => { return import(/* webpackChunkName: "core-action-resource-open" */      '#/main/core/resource/actions/open') },
      // 'notes'    : () => { return import(/* webpackChunkName: "core-action-resource-notes" */     '#/main/core/resource/actions/notes') },
      'publish'  : () => { return import(/* webpackChunkName: "core-action-resource-publish" */   '#/main/core/resource/actions/publish') },
      'restore'  : () => { return import(/* webpackChunkName: "core-action-resource-restore" */   '#/main/core/resource/actions/restore') },
      'rights'   : () => { return import(/* webpackChunkName: "core-action-resource-rights" */    '#/main/core/resource/actions/rights') },
      'unpublish': () => { return import(/* webpackChunkName: "core-action-resource-unpublish" */ '#/main/core/resource/actions/unpublish') },

      // directory resource
      'add'       : () => { return import(/* webpackChunkName: "core-action-resource-add" */       '#/main/core/resources/directory/actions/add') },
      //'import'    : () => { return import(/* webpackChunkName: "core-action-resource-import" */    '#/main/core/resources/directory/actions/import') },
      'add_files' : () => { return import(/* webpackChunkName: "core-action-resource-add-files" */ '#/main/core/resources/directory/actions/add-files') },

      // file resource
      //'download' : () => { return import(/* webpackChunkName: "core-action-resource-download" */       '#/main/core/resources/file/actions/download') },
      'change_file' : () => { return import(/* webpackChunkName: "core-action-resource-change-file" */ '#/main/core/resources/file/actions/change-file') }
    },

    workspace: {
      'about'          : () => { return import(/* webpackChunkName: "core-action-workspace-about" */           '#/main/core/workspace/actions/about') },
      'configure'      : () => { return import(/* webpackChunkName: "core-action-workspace-configure" */       '#/main/core/workspace/actions/configure') },
      'copy'           : () => { return import(/* webpackChunkName: "core-action-workspace-copy" */            '#/main/core/workspace/actions/copy') },
      'copy-model'     : () => { return import(/* webpackChunkName: "core-action-workspace-copy-model" */      '#/main/core/workspace/actions/copy-model') },
      'delete'         : () => { return import(/* webpackChunkName: "core-action-workspace-delete" */          '#/main/core/workspace/actions/delete') },
      'export'         : () => { return import(/* webpackChunkName: "core-action-workspace-export" */          '#/main/core/workspace/actions/export') },
      'open'           : () => { return import(/* webpackChunkName: "core-action-workspace-open" */            '#/main/core/workspace/actions/open') },
      'register-users' : () => { return import(/* webpackChunkName: "core-action-workspace-register-users" */  '#/main/core/workspace/actions/register-users') },
      'register-groups': () => { return import(/* webpackChunkName: "core-action-workspace-register-groups" */ '#/main/core/workspace/actions/register-groups') },
      'register-self'  : () => { return import(/* webpackChunkName: "core-action-workspace-register-self" */   '#/main/core/workspace/actions/register-self') },
      'unregister-self': () => { return import(/* webpackChunkName: "core-action-workspace-unregister-self" */ '#/main/core/workspace/actions/unregister-self') },
      'view-as'        : () => { return import(/* webpackChunkName: "core-action-workspace-view-as" */         '#/main/core/workspace/actions/view-as') }
    },

    user: {
      'disable'        : () => { return import(/* webpackChunkName: "core-action-user-disable" */         '#/main/core/user/actions/disable') },
      'enable'         : () => { return import(/* webpackChunkName: "core-action-user-enable" */          '#/main/core/user/actions/enable') },
      'password-change': () => { return import(/* webpackChunkName: "core-action-user-password-change" */ '#/main/core/user/actions/password-change') },
      'password-reset' : () => { return import(/* webpackChunkName: "core-action-user-password-reset" */  '#/main/core/user/actions/password-reset') },
      'show-as'        : () => { return import(/* webpackChunkName: "core-action-user-show-as" */         '#/main/core/user/actions/show-as') },
      'show-profile'   : () => { return import(/* webpackChunkName: "core-action-user-show-profile" */    '#/main/core/user/actions/show-profile') },
      'show-tracking'  : () => { return import(/* webpackChunkName: "core-action-user-show-tracking" */   '#/main/core/user/actions/show-tracking') },
      'ws-disable'     : () => { return import(/* webpackChunkName: "core-action-user-ws-disable" */      '#/main/core/user/actions/ws-disable') },
      'ws-enable'      : () => { return import(/* webpackChunkName: "core-action-user-ws-enable" */       '#/main/core/user/actions/ws-enable') },
      'merge'          : () => { return import(/* webpackChunkName: "core-action-user-ws-merge" */        '#/main/core/user/actions/merge') }
    }
  },

  /**
   * Provides new types of resources.
   */
  resources: {
    'directory': () => { return import(/* webpackChunkName: "core-resource-directory" */ '#/main/core/resources/directory') },
    'file'     : () => { return import(/* webpackChunkName: "core-resource-file" */      '#/main/core/resources/file') },
    'text'     : () => { return import(/* webpackChunkName: "core-resource-text" */      '#/main/core/resources/text') }
  },

  /**
   * Provides Desktop and/or Workspace tools.
   */
  tools: {
    'dashboard'       :   () => { return import(/* webpackChunkName: "core-tool-dashboard" */  '#/main/core/tools/dashboard') },
    'home'            : () => { return import(/* webpackChunkName: "core-tool-home" */       '#/main/core/tools/home') },
    'workspaces'      : () => { return import(/* webpackChunkName: "core-tool-workspaces" */ '#/main/core/tools/workspaces') },
    'resource_manager': () => { return import(/* webpackChunkName: "core-tool-resources" */  '#/main/core/tools/resources') },
    'parameters'      : () => { return import(/* webpackChunkName: "core-tool-parameters" */ '#/main/core/tools/parameters') },
    'users'           : () => { return import(/* webpackChunkName: "core-tool-users" */      '#/main/core/tools/users') },
    'data_transfer'   : () => { return import(/* webpackChunkName: "core-tool-transfer" */   '#/main/core/tools/transfer') },
    'resource_trash'  : () => { return import(/* webpackChunkName: "core-tool-trash" */      '#/main/core/tools/trash') }
  },

  /**
   * Provides Administration tools.
   */
  administration: {
    'user_management'      : () => { return import(/* webpackChunkName: "core-admin-users" */          '#/main/core/administration/users') },
    'main_settings'        : () => { return import(/* webpackChunkName: "core-admin-parameters" */     '#/main/core/administration/parameters/main') },
    'technical_settings'   : () => { return import(/* webpackChunkName: "core-admin-technical" */      '#/main/core/administration/parameters/technical') },
    'appearance_settings'  : () => { return import(/* webpackChunkName: "core-admin-appearance" */     '#/main/core/administration/parameters/appearance') },
    'templates_management' : () => { return import(/* webpackChunkName: "core-admin-template" */       '#/main/core/administration/template') },
    'tasks_scheduling'     : () => { return import(/* webpackChunkName: "core-admin-scheduled-task" */ '#/main/core/administration/scheduled-task') },
    'platform_dashboard'   : () => { return import(/* webpackChunkName: "core-admin-dashboard" */      '#/main/core/administration/dashboard') },
    'integration'          : () => { return import(/* webpackChunkName: "core-admin-integration" */    '#/main/core/administration/integration') },
    'data_transfer'        : () => { return import(/* webpackChunkName: "core-tool-transfer" */        '#/main/core/tools/transfer') }
  },

  widgets: {
    'list'       : () => { return import(/* webpackChunkName: "core-widget-list" */        '#/main/core/widget/types/list') },
    'simple'     : () => { return import(/* webpackChunkName: "core-widget-simple" */      '#/main/core/widget/types/simple') },
    'resource'   : () => { return import(/* webpackChunkName: "core-widget-resource" */    '#/main/core/widget/types/resource') },
    'profile'    : () => { return import(/* webpackChunkName: "core-widget-profile" */     '#/main/core/widget/types/profile') },
    'progression': () => { return import(/* webpackChunkName: "core-widget-progression" */ '#/main/core/widget/types/progression') }
  },

  data: {
    types: {
      'organization' : () => { return import(/* webpackChunkName: "core-data-type-organization" */  '#/main/core/data/types/organization') },
      'resource'     : () => { return import(/* webpackChunkName: "core-data-type-resource" */      '#/main/core/data/types/resource') },
      'resources'    : () => { return import(/* webpackChunkName: "core-data-type-resources" */     '#/main/core/data/types/resources') },
      'user'         : () => { return import(/* webpackChunkName: "core-data-type-user" */          '#/main/core/data/types/user') },
      'users'        : () => { return import(/* webpackChunkName: "core-data-type-users" */         '#/main/core/data/types/users') },
      'workspace'    : () => { return import(/* webpackChunkName: "core-data-type-workspace" */     '#/main/core/data/types/workspace') },
      'workspaces'   : () => { return import(/* webpackChunkName: "core-data-type-workspaces" */    '#/main/core/data/types/workspaces') },
      'groups'       : () => { return import(/* webpackChunkName: "core-data-type-groups" */        '#/main/core/data/types/groups') },
      'group'        : () => { return import(/* webpackChunkName: "core-data-type-group" */         '#/main/core/data/types/group') },
      'location'     : () => { return import(/* webpackChunkName: "core-data-type-location" */      '#/main/core/data/types/location') },
      'template_type': () => { return import(/* webpackChunkName: "core-data-type-template-type" */ '#/main/core/data/types/template-type') },
      'roles'        : () => { return import(/* webpackChunkName: "core-data-type-roles" */         '#/main/core/data/types/roles') },
      'role'         : () => { return import(/* webpackChunkName: "core-data-type-roles" */         '#/main/core/data/types/role') }
    },
    sources: {
      'resources'         : () => { return import(/* webpackChunkName: "core-data-source-resources" */  '#/main/core/data/sources/resources') },
      'users'             : () => { return import(/* webpackChunkName: "core-data-source-users" */      '#/main/core/data/sources/users') },

      'workspaces'        : () => { return import(/* webpackChunkName: "core-data-source-workspaces" */ '#/main/core/data/sources/workspaces') },
      'public_workspaces' : () => { return import(/* webpackChunkName: "core-data-source-workspaces" */ '#/main/core/data/sources/workspaces') },
      'my_workspaces'     : () => { return import(/* webpackChunkName: "core-data-source-workspaces" */ '#/main/core/data/sources/workspaces') },
      'managed_workspaces': () => { return import(/* webpackChunkName: "core-data-source-workspaces" */ '#/main/core/data/sources/workspaces') },
      'workspace_models'  : () => { return import(/* webpackChunkName: "core-data-source-workspaces" */ '#/main/core/data/sources/workspaces') }
    }
  },

  notifications: {
    'resource-create': () => { return import(/* webpackChunkName: "core-notification-resource-create" */ '#/main/core/notifications/resource/create') },
    'resource-publish': () => { return import(/* webpackChunkName: "core-notification-resource-publish" */ '#/main/core/notifications/resource/publish') }
  }
})
