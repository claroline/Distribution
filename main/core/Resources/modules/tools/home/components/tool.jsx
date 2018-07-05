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
    <Router>
      <Routes
        redirect={[
          {from: '/', exact: true, to: '/tab/'+props.tabs[0].id },
          {from: '/edit', exact: true, to: '/edit/tab/'+props.tabs[0].id }
        ]}
        routes={[
          {
            path: '/tab/:id?',
            exact: true,
            component: PlayerNav,
            onEnter: (params) =>props.setCurrentTab(params.id)
          }, {
            path: '/edit/tab/:id?',
            exact: true,
            component: EditorNav,
            onEnter: (params) =>props.setCurrentTab(params.id)
          }
        ]}
      />
    </Router>
    <PageHeader
      title={props.currentTab ? props.currentTab.title : ('desktop' === props.context.type ? trans('desktop') : props.context.data.name)}
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
            path: '/tab/:id?',
            exact: true,
            component: Player
          }, {
            path: '/edit/tab/:id?',
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
    setCurrentTab(tab){
      dispatch(actions.setCurrentTab(tab))
    }
  })
)(Tool)

export {
  HomeTool
}
