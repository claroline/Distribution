/* eslint-disable */

import {registry} from '#/main/app/plugins/registry'

registry.add('rss', {
  resources: {
    'rss_feed': () => { return import(/* webpackChunkName: "plugin-rss-rss-feed-resource" */ '#/plugin/rss/resources/rss-feed') }
  }
})
