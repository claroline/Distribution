import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'

import {ResourcesLinksModal as ResourcesLinksModalComponent} from '#/plugin/competency/modals/resources-links/components/modal'
import {actions, reducer, selectors} from '#/plugin/competency/modals/resources-links/store'

const ResourcesLinksModal = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
    }),
    (dispatch) => ({
    })
  )(ResourcesLinksModalComponent)
)

export {
  ResourcesLinksModal
}
