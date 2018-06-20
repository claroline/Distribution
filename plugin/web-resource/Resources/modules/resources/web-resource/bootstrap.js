import {bootstrap} from '#/main/app/bootstrap'

import {App} from '#/plugin/web-resource/resources/web-resource'

// generate application
const WebResourceApp = new App()

// mount the react application
bootstrap('.webResource-container', WebResourceApp.component, WebResourceApp.store, WebResourceApp.initialData)
