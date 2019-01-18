import {withRouter} from '#/main/app/router'
import {withReducer} from '#/main/app/store/components/withReducer'

import {TextResource as TextResourceComponent} from '#/main/core/resources/text/components/resource'
import {reducer, selectors} from '#/main/core/resources/text/store'

const TextResource = withRouter(
  withReducer(selectors.STORE_NAME, reducer)(TextResourceComponent)
)

export {
  TextResource
}
