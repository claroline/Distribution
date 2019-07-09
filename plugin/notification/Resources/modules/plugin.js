import {registry} from '#/main/app/plugins/registry'

/**
 * Declares applications provided by the Notification plugin.
 */
registry.add('IcapNotificationBundle', {
  actions: {
    resource: {
      'follow'       : () => { return import(/* webpackChunkName: "resource-action-follow" */        '#/plugin/notification/resource/actions/follow') },
      // 'followers'    : () => { return import(/* webpackChunkName: "resource-action-followers" */     '#/plugin/notification/resource/actions/followers') },
      // 'notifications': () => { return import(/* webpackChunkName: "resource-action-notifications" */ '#/plugin/notification/resource/actions/notifications') },
      'unfollow'     : () => { return import(/* webpackChunkName: "resource-action-unfollow" */      '#/plugin/notification/resource/actions/unfollow') }
    }
  },

  tools: {
    'notification'   : () => { return import(/* webpackChunkName: "plugin-tool-notification" */       '#/plugin/notification/desktop/tool') }
  },
})
