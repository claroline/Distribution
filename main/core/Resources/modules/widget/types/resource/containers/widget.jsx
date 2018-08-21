import {connect} from 'react-redux'

import {ResourceWidget as ResourceWidgetComponent} from '#/main/core/widget/types/resource/components/widget'

import {selectors as contentSelectors} from '#/main/core/widget/content/store'

const ResourceWidget = connect(
  (state) => ({
    resource: contentSelectors.parameters(state).resource
  })
)(ResourceWidgetComponent)

export {
  ResourceWidget
}
