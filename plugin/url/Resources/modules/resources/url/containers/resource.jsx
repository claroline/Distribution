import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'
import {withRouter} from '#/main/app/router'

import {UrlResource as UrlResourceComponent} from '#/plugin/url/resources/url/components/resource'
import {reducer} from '#/plugin/url/resources/url/store/reducer'
import {selectors} from '#/plugin/url/resources/url/store/selectors'

const UrlResource = withRouter(withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      url: selectors.url(state)
    })
  )(UrlResourceComponent))
)

export {
  UrlResource
}
