import {bootstrap} from '#/main/core/utilities/app/bootstrap'

// modals
import {registerModalType} from '#/main/core/layout/modal'

// reducers
import {Image} from './components/app.jsx'


// mount the react application
bootstrap(
    // app DOM container (also holds initial app data as data attributes)
    '.image-container',

    // app main component (accepts either a `routedApp` or a `ReactComponent`)
    Image,

    // app store configuration
    {

    }

)