import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/core/translation'
import {Button} from '#/main/app/action/components/button'
import {EmptyPlaceholder} from '#/main/core/layout/components/placeholder'

import {WidgetEditor} from '#/main/core/widget/editor/components/widget'
import {WidgetContainer as WidgetContainerTypes} from '#/main/core/widget/prop-types'
import {MODAL_WIDGET_CREATION} from '#/main/core/widget/editor/modals/creation'
import {MODAL_WIDGET_PARAMETERS} from '#/main/core/widget/editor/modals/parameters'

class WidgetGridEditor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      movingContent: {},
      movingContentParent: null,
      isMoving: null
    }
  }

  moveContent(content, widgetContainerId) {
    this.setState({movingContent: content})
    this.setState({movingContentParent: widgetContainerId})
    this.setState({isMoving: content.id})
  }

  stopMovingContent() {
    this.setState({movingContent: {}})
    this.setState({movingContentParent: null})
    this.setState({isMoving: null})
  }

  render() {
    return (

      <div className="widgets-grid">
        {this.props.widgets.map((widgetContainer, index) =>
          <WidgetEditor
            key={index}
            widget={widgetContainer}
            context={this.props.context}
            isMoving={this.state.isMoving}
            stopMovingContent={() => this.stopMovingContent()}
            moveContent={(content) => this.moveContent(content, widgetContainer.id)}
            update={(widget) => {
              // copy array
              const widgets = this.props.widgets.slice(0)
              // replace modified widget
              widgets[index] = widget
              // propagate change
              this.props.update(widgets)
            }}
            actions={[
              {
                type: 'modal',
                icon: 'fa fa-fw fa-plus',
                label: trans('add_section_before'),
                modal: [MODAL_WIDGET_CREATION, {
                  create: (widget) => {
                    // copy array
                    const widgets = this.props.widgets.slice(0)
                    // insert element
                    widgets.splice(index, 0, widget) // insert element

                    // propagate change
                    this.props.update(widgets)
                  }
                }]
              }, {
                type: 'callback',
                icon: 'fa fa-fw fa-arrow-up',
                label: trans('move_top', {}, 'actions'),
                disabled: 0 === index,
                callback: () => {
                  // copy array
                  const widgets = this.props.widgets.slice(0)

                  // permute widget with the previous one
                  const movedWidget = widgets[index]
                  widgets[index] = widgets[index - 1]
                  widgets[index - 1] = movedWidget

                  // propagate change
                  this.props.update(widgets)
                }
              }, {
                type: 'callback',
                icon: 'fa fa-fw fa-arrow-down',
                label: trans('move_bottom', {}, 'actions'),
                disabled: this.props.widgets.length - 1 === index,
                callback: () => {
                  // copy array
                  const widgets = this.props.widgets.slice(0)

                  // permute widget with the next one
                  const movedWidget = widgets[index]
                  widgets[index] = widgets[index + 1]
                  widgets[index + 1] = movedWidget

                  // propagate change
                  this.props.update(widgets)
                }
              }, {
                type: 'modal',
                icon: 'fa fa-fw fa-cog',
                label: trans('configure', {}, 'actions'),
                modal: [MODAL_WIDGET_PARAMETERS, {
                  widget: widgetContainer,
                  save: (widget) => {
                    // copy array
                    const widgets = this.props.widgets.slice(0)
                    // replace modified widget
                    widgets[index] = widget
                    // propagate change
                    this.props.update(widgets)
                  }
                }]
              }, {
                type: 'callback',
                icon: 'fa fa-fw fa-trash-o',
                label: trans('delete', {}, 'actions'),
                dangerous: true,
                confirm: {
                  title: trans('section_delete_confirm_title'),
                  message: trans('section_delete_confirm_message')
                },
                callback: () => {
                  const widgets = this.props.widgets.slice(0) // copy array
                  widgets.splice(index, 1) // remove element
                  this.props.update(widgets)
                }
              }
            ]}
          />
        )}

        {0 === this.props.widgets.length &&
      <EmptyPlaceholder
        size="lg"
        icon="fa fa-frown-o"
        title={trans('no_section')}
      />
        }

        <Button
          className="btn btn-block btn-emphasis"
          type="modal"
          label={trans('add_section')}
          modal={[MODAL_WIDGET_CREATION, {
            create: (widget) => this.props.update(
              this.props.widgets.concat([widget]) // copy array & append element
            )
          }]}
          primary={true}
        />
      </div>
    )
  }
}

WidgetGridEditor.propTypes = {
  context: T.object.isRequired,
  widgets: T.arrayOf(T.shape(
    WidgetContainerTypes.propTypes
  )),
  update: T.func.isRequired
}

WidgetGridEditor.defaultProps = {
  widgets: []
}

export {
  WidgetGridEditor
}
