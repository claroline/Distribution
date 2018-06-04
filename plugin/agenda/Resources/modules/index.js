import {bootstrap} from '#/main/app/bootstrap'

import {reducer} from '#/plugin/agenda/reducer'
import {Agenda} from '#/plugin/agenda/components/agenda.jsx'


// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.agenda-container',

  // app main component
  Agenda,

  // app store configuration
  reducer
)
