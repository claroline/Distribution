import {makeFormReducer} from '#/main/app/content/form/store'

import {selectors} from '#/plugin/cursus/administration/modals/event-form/store/selectors'

export const reducer = makeFormReducer(selectors.STORE_NAME)
