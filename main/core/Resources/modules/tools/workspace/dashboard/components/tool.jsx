import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {
  PageContainer,
  PageContent,
  PageHeader
} from '#/main/core/layout/page'


const Tool = () =>
  <PageContainer>
    <PageHeader title={trans('dashboard', {}, 'tools')} />
    <PageContent>
      Content of the page
    </PageContent>
  </PageContainer>

Tool.propTypes = {
  workspaceId: T.number.isRequired
}

const ToolContainer = connect(
  state => ({
    workspaceId: state.workspaceId
  }),
  null
)(Tool)

export {
  ToolContainer as DashboardTool
}
