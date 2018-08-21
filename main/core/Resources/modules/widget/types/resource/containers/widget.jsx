import {connect} from 'react-redux'

import {ResourceWidget as ResourceWidgetComponent} from '#/main/core/widget/types/resource/components/widget'

import {selectors as resourceSelectors} from '#/main/core/widget/content/store'

const ResourceWidget = connect(
  (state) => ({
    resource: resourceSelectors.parameters(state).resource
  })
)(ResourceWidgetComponent)

export {
  ResourceWidget
}
