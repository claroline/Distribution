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
import {Router, Routes} from '#/main/app/router'
import {
  ToolPageContainer
} from '#/main/core/tool/containers/page'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'

import {select} from '#/main/core/tools/home/selectors'
import {actions} from '#/main/core/tools/home/actions'
import {Editor} from '#/main/core/tools/home/editor/components/editor'
import {Player} from '#/main/core/tools/home/player/components/player'
import {PlayerNav} from '#/main/core/tools/home/player/components/nav'
import {EditorNav} from '#/main/core/tools/home/editor/components/nav'


const ToolActionsComponent = props =>
  <PageActions>
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
  </PageActions>

ToolActionsComponent.propTypes = {
  location: T.shape({
    pathname: T.string
  }).isRequired
}

const ToolActions = withRouter(ToolActionsComponent)

const Tool = props =>
  <ToolPageContainer>
    {/* {1 < props.tabs.length && */}
    <Router>
      <Routes
        routes={[
          {
            path: '/',
            exact: true,
            component: PlayerNav
            // disabled: 1 < props.tabs.length
          }, {
            path: '/tab/:title?',
            exact: true,
            component: PlayerNav,
            // disabled: 1 < props.tabs.length,
            onEnter: (params) =>props.setCurrentTab(params.title)
          }, {
            path: '/edit',
            exact: true,
            component: EditorNav
          }
        ]}
      />
    </Router>
    {/* } */}
    <PageHeader
      title={props.currentTab.description ? props.currentTab.description : ('desktop' === props.context.type ? trans('desktop') : props.context.data.name)}
    >
      {console.log(props.currentTab[0])}
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
  editable: T.bool.isRequired,
  setCurrentTab: T.func.isRequired
}

const HomeTool = connect(
  (state) => ({
    context: select.context(state),
    editable: select.editable(state),
    tabs: select.tabs(state),
    currentTab: select.currentTab(state)
  }),
  (dispatch) => ({
    setCurrentTab(tabTitle){
      dispatch(actions.setCurrentTab(tabTitle))
    }
  })
)(Tool)

export {
  HomeTool
}
