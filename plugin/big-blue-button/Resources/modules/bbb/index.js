import {bootstrap} from '#/main/core/utilities/app/bootstrap'
import {routedApp} from '#/main/core/utilities/app/router'
import {reducer as modalReducer}    from '#/main/core/layout/modal/reducer'
import {reducer as resourceNodeReducer} from '#/main/core/layout/resource/reducer'
import {bbbReducers, resourceReducers, mainReducers} from './reducers'
import {BBBResource} from './components/bbb-resource.jsx'
import {BBBConfig} from './components/bbb-config.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.bbb-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  routedApp([
    {path: '/', component: BBBResource, exact: true},
    {path: '/configure', component: BBBConfig, exact: true}
  ]),

  // app store configuration
  {
    // app reducers
    user: mainReducers,
    resource: resourceReducers,
    bbbUrl: bbbReducers,
    config: mainReducers,
    canEdit: mainReducers,

    // generic reducers
    resourceNode: resourceNodeReducer,
    modal: modalReducer
  },

  // transform data attributes for redux store
  (initialData) => {
    const resourceNode = initialData.resourceNode

    return {
      user: initialData.user,
      resource: initialData.resource,
      resourceNode: resourceNode,
      config: {
        serverUrl: initialData.serverUrl,
        securitySalt: initialData.securitySalt
      },
      canEdit: resourceNode.rights.current.edit,
      bbbUrl: null
    }
  }
)
