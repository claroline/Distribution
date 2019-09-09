/* eslint-disable */

import {registry} from '#/main/app/plugins/registry'

registry.add('UJMLtiBundle', {
  resources: {
    'ujm_lti_resource': () => { return import(/* webpackChunkName: "plugin-lti-resource" */ '#/plugin/lti/resources/lti') }
  },
  integration: {
    'lti' : () => { return import(/* webpackChunkName: "plugin-lti-integration" */ '#/plugin/lti/integration/lti')}
  }
})
