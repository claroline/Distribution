import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {toKey} from '#/main/core/scaffolding/text/utils'
import {Button} from '#/main/app/action/components/button'
import {EmptyPlaceholder} from '#/main/core/layout/components/placeholder'

import {WidgetEditor} from '#/main/core/widget/components/editor'
import {WidgetContainer as WidgetContainerTypes} from '#/main/core/widget/prop-types'
import {MODAL_WIDGET_CREATION} from '#/main/core/widget/modals/creation'
import {MODAL_WIDGET_PARAMETERS} from '#/main/core/widget/modals/parameters'

import {select} from '#/main/core/tools/home/selectors'
import {actions as editorActions} from '#/main/core/tools/home/editor/actions'
import {select as editorSelect} from '#/main/core/tools/home/editor/selectors'

const EditorComponent = props =>
  <div>
    {props.widgets.map((widgetContainer, index) =>
      <WidgetEditor
        key={index}
        container={widgetContainer}
        context={props.context}
        actions={[
          {
            type: 'modal',
            icon: 'fa fa-fw fa-plus',
            label: trans('add_widget_before', {}, 'widget'),
            modal: [MODAL_WIDGET_CREATION, {
              create: (widget) => props.addWidget(index, widget)
            }]
          }, {
            type: 'callback',
            icon: 'fa fa-fw fa-arrow-up',
            label: trans('move_top', {}, 'actions'),
            callback: () => true
          }, {
            type: 'callback',
            icon: 'fa fa-fw fa-arrow-down',
            label: trans('move_bottom', {}, 'actions'),
            callback: () => true
          }, {
            type: 'modal',
            icon: 'fa fa-fw fa-cog',
            label: trans('configure', {}, 'actions'),
            modal: [MODAL_WIDGET_PARAMETERS, {
              widget: widgetContainer,
              save: (widget) => props.updateWidget(index, widget)
            }]
          }, {
            type: 'callback',
            icon: 'fa fa-fw fa-trash-o',
            label: trans('delete', {}, 'actions'),
            dangerous: true,
            confirm: {
              title: trans('widget_delete_confirm_title', {}, 'widget'),
              message: trans('widget_delete_confirm_message', {}, 'widget')
            },
            callback: () => props.deleteWidget(widgetContainer)
          }
        ]}
      />
    )}

    {0 === props.widgets.length &&
      <EmptyPlaceholder
        size="lg"
        icon="fa fa-frown-o"
        title={trans('no_widget', {}, 'widget')}
      />
    }

    <Button
      className="btn btn-block btn-emphasis"
      type="modal"
      label={trans('add_widget', {}, 'widget')}
      modal={[MODAL_WIDGET_CREATION, {
        create: (widget) => props.addWidget(props.widgets.length, widget)
      }]}
      primary={true}
    />
  </div>

EditorComponent.propTypes = {
  context: T.object.isRequired,
  widgets: T.arrayOf(T.shape(
    WidgetContainerTypes.propTypes
  )).isRequired,
  addWidget: T.func.isRequired,
  updateWidget: T.func.isRequired,
  deleteWidget: T.func.isRequired
}

const Editor = connect(
  state => ({
    context: select.context(state),
    widgets: editorSelect.widgets(state),
    tabs: editorSelect.tabs(state)
  }),
  dispatch => ({
    addWidget(position, widget) {
      dispatch(editorActions.addWidget(position, widget))
    },
    updateWidget(position, widget) {
      dispatch(editorActions.updateWidget(position, widget))
    },
    deleteWidget(position) {
      dispatch(editorActions.deleteWidget(position))
    }
  })
)(EditorComponent)

export {
  Editor
}
