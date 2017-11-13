import {bootstrap} from '#/main/core/utilities/app/bootstrap'
import {routedApp} from '#/main/core/router'

import {reducer} from '#/main/core/administration/theme/reducer'
import {actions} from '#/main/core/administration/theme/actions'

import {Themes} from '#/main/core/administration/theme/components/themes.jsx'
import {Theme} from '#/main/core/administration/theme/components/theme.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.themes-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  routedApp([
    {
      path: '/',
      component: Themes,
      exact: true
    }, {
      path: '/:id',
      component: Theme,
      onEnter: (nextState) => actions.editTheme(nextState.params.id),
      onLeave: () => actions.resetThemeForm()
    }
  ]),

  // app store configuration
  reducer,

  // remap data-attributes set on the app DOM container
  (initialData) => ({
    themes: initialData.themes
  })
)
