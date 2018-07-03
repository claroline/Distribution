import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {matchPath, withRouter} from '#/main/app/router'
import {
  PageHeader,
  PageActions
} from '#/main/core/layout/page'
import {
  RoutedPageContent
} from '#/main/core/layout/router'
import {
  ToolPageContainer
} from '#/main/core/tool/containers/page'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'

import {select} from '#/main/core/tools/home/selectors'
import {Editor} from '#/main/core/tools/home/editor/components/editor'
import {Player} from '#/main/core/tools/home/player/components/player'

import {PlayerNav} from '#/main/core/tools/home/player/components/nav'

const tabs = [
  {name1 : 'tab1'},
  {name2 : 'tab2'},
  {name3 : 'tab3'}
]

const ToolActionsComponent = props =>
  <PageActions>
    <PlayerNav
      tabs={tabs}
    >
      <FormPageActionsContainer
        formName="editor"
        target={['apiv2_home_update']}
        opened={!!matchPath(props.location.pathname, {path: '/edit'})}
        open={{
          type: 'link',
          target: '/edit'
        }}
        cancel={{
          type: 'link',
          target: '/',
          exact: true
        }}
      />
    </PlayerNav>
  </PageActions>

ToolActionsComponent.propTypes = {
  location: T.shape({
    pathname: T.string
  }).isRequired
}

const ToolActions = withRouter(ToolActionsComponent)

const Tool = props =>
  <ToolPageContainer>
    <PageHeader
      title={'desktop' === props.context.type ? trans('desktop') : props.context.data.name}
    >
      {props.editable &&
        <ToolActions />
      }
    </PageHeader>

    {props.editable ?
      <RoutedPageContent
        headerSpacer={true}
        routes={[
          {
            path: '/',
            exact: true,
            component: Player
          }, {
            path: '/edit',
            exact: true,
            component: Editor
          }
        ]}
      /> :
      <Player />
    }
  </ToolPageContainer>

Tool.propTypes = {
  context: T.shape({
    type: T.oneOf(['workspace', 'desktop']),
    data: T.shape({
      name: T.string.isRequired
    })
  }).isRequired,
  editable: T.bool.isRequired
}

const HomeTool = connect(
  (state) => ({
    context: select.context(state),
    editable: select.editable(state)
  })
)(Tool)

export {
  HomeTool
}
