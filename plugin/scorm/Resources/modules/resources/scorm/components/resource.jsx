import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {selectors as resourceSelect} from '#/main/core/resource/store'
import {hasPermission} from '#/main/core/resource/permissions'
import {RoutedPageContent} from '#/main/core/layout/router'
import {ResourcePageContainer} from '#/main/core/resource/containers/page.jsx'

const Resource = props =>
  <ResourcePageContainer
    editor={{}}
    customActions={[]}
  >
    <RoutedPageContent
      headerSpacer={false}
      routes={[]}
    />
  </ResourcePageContainer>

Resource.propTypes = {
  canEdit: T.bool.isRequired,
  scorm: T.object.isRequired
}

const ScormResource = connect(
  (state) => ({
    canEdit: hasPermission('edit', resourceSelect.resourceNode(state)),
    scorm: state.scorm
  })
)(Resource)

export {
  ScormResource
}
