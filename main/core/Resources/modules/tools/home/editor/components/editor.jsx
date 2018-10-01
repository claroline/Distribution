import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import merge from 'lodash/merge'

import {trans} from '#/main/core/translation'
import {makeId} from '#/main/core/scaffolding/id'
import {withRouter} from '#/main/app/router'
import {currentUser} from '#/main/core/user/current'
import {
  PageContainer,
  PageHeader,
  PageContent,
  PageGroupActions,
  PageActions,
  PageAction,
  MoreAction
} from '#/main/core/layout/page'
import {actions as formActions} from '#/main/app/content/form/store/actions'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'

import {WidgetContainer as WidgetContainerTypes} from '#/main/core/widget/prop-types'
import {Tab as TabTypes} from '#/main/core/tools/home/prop-types'
import {selectors} from '#/main/core/tools/home/store'
import {actions as editorActions, selectors as editorSelectors} from '#/main/core/tools/home/editor/store'
import {Tabs} from '#/main/core/tools/home/components/tabs'

import {TabEditor} from '#/main/core/tools/home/editor/components/tab'

const EditorComponent = props =>
  <PageContainer>
    <PageHeader
      alignTitle={true === props.currentTab.centerTitle ? 'center' : 'left'}
      title={props.currentTab ? props.currentTab.longTitle : ('desktop' === props.context.type ? trans('desktop') : props.context.data.name)}
      poster={props.currentTab.poster ? props.currentTab.poster.url: undefined}
    >
      <Tabs
        prefix="/edit"
        tabs={props.tabs}
        create={() => props.createTab(props.context, props.administration, props.tabs.length, props.history.push)}
        context={props.context}
        editing={true}
      />

      <PageActions>
        <PageGroupActions>
          <PageAction
            type={LINK_BUTTON}
            label={trans('configure', {}, 'actions')}
            icon="fa fa-fw fa-cog"
            target="/edit"
            disabled={true}
            primary={true}
          />
        </PageGroupActions>

        <PageGroupActions>
          <MoreAction
            actions={[
              {
                name: 'walkthrough',
                type: CALLBACK_BUTTON,
                icon: 'fa fa-street-view',
                label: trans('show-walkthrough', {}, 'actions'),
                callback: () => true
              }, {
                type: CALLBACK_BUTTON,
                label: trans('delete', {}, 'actions'),
                icon: 'fa fa-fw fa-trash-o',
                dangerous: true,
                confirm: {
                  title: trans('home_tab_delete_confirm_title'),
                  message: trans('home_tab_delete_confirm_message'),
                  subtitle: props.currentTab.title
                },
                disabled: props.readOnly || 1 >= props.tabs.length,
                callback: () => props.deleteTab(props.tabs, props.currentTab, props.history.push)
              }
            ]}
          />
        </PageGroupActions>
      </PageActions>
    </PageHeader>

    <PageContent>
      <TabEditor
        context={props.context}
        currentTabIndex={props.currentTabIndex}
        currentTab={props.currentTab}
        widgets={props.widgets}
        administration={props.administration}
        readOnly={props.readOnly}
        created={0 !== props.playerTabs.filter(tab => props.currentTab.id === tab.id).length}
        tabs={props.tabs}

        update={props.updateTab}
        move={props.moveTab}
        setErrors={props.setErrors}
      />
    </PageContent>
  </PageContainer>

EditorComponent.propTypes = {
  context: T.object.isRequired,
  administration: T.bool.isRequired,
  readOnly: T.bool.isRequired,
  tabs: T.arrayOf(T.shape(
    TabTypes.propTypes
  )),
  playerTabs: T.arrayOf(T.shape(
    TabTypes.propTypes
  )),
  currentTab: T.shape(TabTypes.propTypes),
  currentTabIndex: T.number.isRequired,
  widgets: T.arrayOf(T.shape(
    WidgetContainerTypes.propTypes
  )).isRequired,
  history: T.shape({
    push: T.func.isRequired
  }).isRequired,
  createTab: T.func.isRequired,
  updateTab: T.func.isRequired,
  setErrors: T.func.isRequired,
  deleteTab: T.func.isRequired,
  moveTab: T.func.isRequired
}

const Editor = withRouter(connect(
  state => ({
    context: selectors.context(state),
    administration: selectors.administration(state),
    readOnly: editorSelectors.readOnly(state),
    tabs: editorSelectors.editorTabs(state),
    playerTabs: selectors.tabs(state),
    widgets: editorSelectors.widgets(state),
    currentTabIndex: editorSelectors.currentTabIndex(state),
    currentTab: editorSelectors.currentTab(state)
  }),
  dispatch => ({
    updateTab(currentTabIndex, field, value) {
      dispatch(formActions.updateProp('editor', `[${currentTabIndex}].${field}`, value))
    },
    setErrors(errors) {
      dispatch(formActions.setErrors('editor', errors))
    },
    createTab(context, administration, position, navigate){
      const newTabId = makeId()

      dispatch(formActions.updateProp('editor', `[${position}]`, merge({}, TabTypes.defaultProps, {
        id: newTabId,
        title: trans('tab'),
        longTitle: trans('tab'),
        position: position + 1,
        type: administration ? 'administration' : context.type,
        administration: administration,
        user: context.type === 'desktop' && !administration ? currentUser() : null,
        workspace: context.type === 'workspace' ? {uuid: context.data.uuid} : null
      })))

      // open new tab
      navigate(`/edit/tab/${newTabId}`)
    },
    moveTab(tabs, currentTab, newPosition) {
      dispatch(editorActions.moveTab(tabs, currentTab, newPosition))
    },
    deleteTab(tabs, currentTab, navigate) {
      dispatch(editorActions.deleteTab(tabs, currentTab))

      // redirect
      navigate('/edit')
    }
  })
)(EditorComponent))

export {
  Editor
}
