import {bootstrap} from '#/main/app/dom/bootstrap'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.open-badge-container',

  // app main component
  null,

  // app store configuration
  null,

  // remap data-attributes set on the app DOM container
  // todo load remaining through ajax
  () => {


  }
)
