/* eslint-disable */

import {registry} from '#/main/app/plugins/registry'

/**
 * Declares applications provided by the base application.
 */
registry.add('app', {
  data: {
    types: {
      'boolean'     : () => { return import(/* webpackChunkName: "app-data-boolean" */      '#/main/app/content/data/boolean') },
      'cascade'     : () => { return import(/* webpackChunkName: "app-data-cascade" */      '#/main/app/content/data/cascade') },
      'cascade-enum': () => { return import(/* webpackChunkName: "app-data-cascade-enum" */ '#/main/app/content/data/cascade-enum') },
      'choice'      : () => { return import(/* webpackChunkName: "app-data-choice" */       '#/main/app/content/data/choice') },
      'color'       : () => { return import(/* webpackChunkName: "app-data-color" */        '#/main/app/content/data/color') },
      'country'     : () => { return import(/* webpackChunkName: "app-data-country" */      '#/main/app/content/data/country') },
      'date'        : () => { return import(/* webpackChunkName: "app-data-date" */         '#/main/app/content/data/date') },
      'date-range'  : () => { return import(/* webpackChunkName: "app-data-date-range" */   '#/main/app/content/data/date-range') },
      'email'       : () => { return import(/* webpackChunkName: "app-data-email" */        '#/main/app/content/data/email') },
      'enum'        : () => { return import(/* webpackChunkName: "app-data-enum" */         '#/main/app/content/data/enum') },
      'enum-plus'   : () => { return import(/* webpackChunkName: "app-data-enum-plus" */    '#/main/app/content/data/enum-plus') },
      'file'        : () => { return import(/* webpackChunkName: "app-data-file" */         '#/main/app/content/data/file') },
      'html'        : () => { return import(/* webpackChunkName: "app-data-html" */         '#/main/app/content/data/html') },
      'image'       : () => { return import(/* webpackChunkName: "app-data-image" */        '#/main/app/content/data/image') },
      'ip'          : () => { return import(/* webpackChunkName: "app-data-ip" */           '#/main/app/content/data/ip') },
      'locale'      : () => { return import(/* webpackChunkName: "app-data-locale" */       '#/main/app/content/data/locale') },
      'number'      : () => { return import(/* webpackChunkName: "app-data-number" */       '#/main/app/content/data/number') },
      'password'    : () => { return import(/* webpackChunkName: "app-data-country" */      '#/main/app/content/data/password') },
      'score'       : () => { return import(/* webpackChunkName: "app-data-score" */        '#/main/app/content/data/score') },
      'storage'     : () => { return import(/* webpackChunkName: "app-data-storage" */      '#/main/app/content/data/storage') },
      'string'      : () => { return import(/* webpackChunkName: "app-data-string" */       '#/main/app/content/data/string') },
      'translated'  : () => { return import(/* webpackChunkName: "app-data-translated" */   '#/main/app/content/data/translated') },
      'translation' : () => { return import(/* webpackChunkName: "app-data-translation" */  '#/main/app/content/data/translation') },
      'username'    : () => { return import(/* webpackChunkName: "app-data-username" */     '#/main/app/content/data/username') }
    }
  }
})
