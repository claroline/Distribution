import {bootstrap} from '#/main/app/bootstrap'

import {App} from '#/main/core/administration/home'

// generate application
const DesktopApp = new App()

// mount the react application
bootstrap('.desktop-container', DesktopApp.component, DesktopApp.store, DesktopApp.initialData)
