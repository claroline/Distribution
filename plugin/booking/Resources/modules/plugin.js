import {registry} from '#/main/app/plugins/registry'

registry.add('booking', {
  data: {
    types: {
    },
    sources: {
    }
  },
  tools: {
    'rooms'    : () => { return import(/* webpackChunkName: "plugin-booking-tools-rooms" */ '#/plugin/booking/tools/rooms') },
    'materials': () => { return import(/* webpackChunkName: "plugin-booking-tools-materials" */ '#/plugin/booking/tools/materials') }
  }
})
