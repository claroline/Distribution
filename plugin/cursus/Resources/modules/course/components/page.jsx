import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {ContentLoader} from '#/main/app/content/components/loader'
import {PageFull} from '#/main/app/page/components/full'
import {getToolBreadcrumb, showToolBreadcrumb} from '#/main/core/tool/utils'

import {Course as CourseTypes} from '#/plugin/cursus/course/prop-types'

const CoursePage = (props) => {
  if (isEmpty(props.course)) {
    return (
      <ContentLoader
        size="lg"
        description="Nous chargeons la formation..."
      />
    )
  }

  let toolbar = 'more'
  if (props.primaryAction) {
    toolbar = props.primaryAction + ' | ' + toolbar
  }

  return (
    <PageFull
      showBreadcrumb={showToolBreadcrumb(props.currentContext.type, props.currentContext.data)}
      path={[].concat(getToolBreadcrumb(props.name, props.currentContext.type, props.currentContext.data), props.path)}
      title={props.course.name}
      subtitle={props.course.code}
      poster={props.course.poster ? props.course.poster.url : undefined}
      toolbar={toolbar}
      actions={props.actions}

      header={{
        title: `${trans('trainings', {}, 'tools')} - ${props.course.name}`,
        description: props.course.description
      }}
    >
      {props.children}
    </PageFull>
  )
}

CoursePage.propTypes = {
  path: T.array,
  currentContext: T.shape({
    type: T.oneOf(['administration', 'desktop', 'workspace']),
    data: T.object
  }).isRequired,
  primaryAction: T.string,
  actions: T.array,
  course: T.shape(
    CourseTypes.propTypes
  ),
  children: T.any
}

CoursePage.defaultProps = {
  path: []
}

export {
  CoursePage
}
