import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'


import {trans} from '#/main/core/translation'
import {matchPath, withRouter} from '#/main/app/router'
import {
  PageHeader,
  PageGroupActions,
  PageActions,
  PageAction
} from '#/main/core/layout/page'
import {
  RoutedPageContent
} from '#/main/core/layout/router'
import {Router, Routes} from '#/main/app/router'
import {
  ToolPageContainer
} from '#/main/core/tool/containers/page'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'
import {MODAL_DATA_FORM} from '#/main/core/data/form/modals'

import {select} from '#/main/core/tools/home/selectors'
import {actions} from '#/main/core/tools/home/actions'
import {Editor} from '#/main/core/tools/home/editor/components/editor'
import {Player} from '#/main/core/tools/home/player/components/player'
import {PlayerNav} from '#/main/core/tools/home/player/components/nav'
import {EditorNav} from '#/main/core/tools/home/editor/components/nav'
import {tabFormSections} from '#/main/core/tools/home/utils'

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
            // disabled: 1 < props.tabs.length,
            onEnter: (params) =>props.setCurrentTab(params.id)
          }, {
            path: '/edit/tab/:id?',
            exact: true,
            component: EditorNav,
            onEnter: (params) => {
              props.setCurrentTab(params.id)
              props.isEditing()
            },
            onLeave: () => props.stopEditing()
          }
        ]}
      />
    </Router>
    <PageHeader
      title={props.currentTab ? props.currentTab.longTitle : ('desktop' === props.context.type ? trans('desktop') : props.context.data.name)}
    >
      {props.editable &&
        <div className="tab-edition-container">
          {props.editing &&
          <PageGroupActions>
            <PageAction
              type="modal"
              label={trans('configure', {}, 'actions')}
              icon="fa fa-fw fa-cog"
              modal={[MODAL_DATA_FORM, {
                title: trans('home_tab_edition'),
                sections: tabFormSections,
                data: {
                  id: props.currentTab.id,
                  title: props.currentTab.title,
                  longTitle: props.currentTab.longTitle,
                  icon: props.currentTab.icon,
                  poster: props.currentTab.poster,
                  type: props.currentTab.context,
                  user: props.currentTab.user,
                  workspace: props.currentTab.workspace,
                  position: props.currentTab.position,
                  widgets : props.currentTab.widgets
                },
                save: data => props.updateTab(data)
              }]}
            />
            <PageAction
              type="callback"
              label={trans('delete')}
              icon="fa fa-fw fa-trash-o"
              callback={() => props.deleteTab(props.currentTab)}
            />
          </PageGroupActions>
          }
          <ToolActions />
        </div>
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
  editing: T.bool,
  setCurrentTab: T.func.isRequired,
  isEditing: T.func.isRequired,
  stopEditing: T.func.isRequired
}

const HomeTool = connect(
  (state) => ({
    context: select.context(state),
    editable: select.editable(state),
    editing: select.editing(state),
    tabs: select.tabs(state),
    currentTab: select.currentTab(state)

  }),
  (dispatch) => ({
    setCurrentTab(tab){
      dispatch(actions.setCurrentTab(tab))
    },
    isEditing() {
      dispatch(actions.isEditing())
    },
    stopEditing() {
      dispatch(actions.stopEditing())
    },
    deleteTab(tab) {
      console.log(tab)
    },
    updateTab(tab) {
      console.log(tab)
    }
  })
)(Tool)

export {
  HomeTool
}
