import React, {Component} from 'react'
import {connect} from 'react-redux'
import classes from 'classnames'
import flatten from 'lodash/flatten'
import omit from 'lodash/omit'
import uniq from 'lodash/uniq'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {trans} from '#/main/core/translation'
import {Modal} from '#/main/app/overlay/modal/components/modal'
import {actions as modalActions} from '#/main/app/overlay/modal/store'

import {Widget as WidgetTypes} from '#/main/core/widget/prop-types'
import {actions, selectors} from '#/main/core/widget/editor/modals/creation/store'
import {MODAL_WIDGET_CONTENT_PARAMETERS} from '#/main/core/widget/editor/modals/content/components/parameters'

const WidgetPreview = props =>
  <a className="widget-preview" role="button" onClick={props.onClick}>
    <h5 className="widget-title">
      {trans(props.name, {}, 'widget')}

      {0 !== props.sources.length &&
        <span className="label label-primary">{props.sources.length}</span>
      }
    </h5>
  </a>

implementPropTypes(WidgetPreview, WidgetTypes, {
  onClick: T.func.isRequired
})

const WidgetsGrid = props =>
  <div className="modal-body">
    {props.widgets.map((widget, index) =>
      <WidgetPreview
        key={index}
        onClick={() => props.add(widget)}
        {...widget}
      />
    )}
  </div>

WidgetsGrid.propTypes = {
  widgets: T.arrayOf(T.shape(
    WidgetTypes.propTypes
  )).isRequired,
  add: T.func.isRequired
}

class ContentTypeModalComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTag: 'all'
    }
  }

  render() {
    return (
      <Modal
        {...omit(this.props, 'context', 'availableWidgets', 'fetchWidgets', 'configure')}
        icon="fa fa-fw fa-plus"
        title={trans('new_content', {}, 'widget')}
        subtitle={trans('new_content_select', {}, 'widget')}
        onEntering={() => {
          if (0 === this.props.availableWidgets.length) {
            this.props.fetchWidgets(this.props.context)
          }
        }}
      >
        <ul className="nav nav-tabs">
          {['all']
            .concat(uniq(flatten(this.props.availableWidgets.map(widget => widget.tags))))
            .map(tag =>
              <li key={tag} className={classes({
                active: tag === this.state.activeTag
              })}>
                <a
                  role="button"
                  href=""
                  onClick={(e) => {
                    e.preventDefault()
                    this.setState({activeTag: tag})
                  }}
                >
                  {trans(tag)}
                </a>
              </li>
            )
          }
        </ul>

        <WidgetsGrid
          widgets={'all' === this.state.activeTag ?
            this.props.availableWidgets :
            this.props.availableWidgets.filter(widget => widget.tags && -1 !== widget.tags.indexOf(this.state.activeTag))
          }
          add={this.props.configure}
        />
      </Modal>
    )
  }
}

ContentTypeModalComponent.propTypes = {
  context: T.object.isRequired,
  availableWidgets: T.arrayOf(T.shape(
    WidgetTypes.propTypes
  )).isRequired,
  fetchWidgets: T.func.isRequired,
  configure: T.func.isRequired
}

const ContentTypeModal = connect(
  (state) => ({
    availableWidgets: selectors.availableWidgets(state)
  }),
  (dispatch) => ({
    fetchWidgets(context) {
      dispatch(actions.fetchWidgets(context.type))
    },

    configure(widgetType) {
      dispatch(actions.startCreation(widgetType))

      // display the second creation modal
      dispatch(modalActions.showModal(MODAL_WIDGET_CONTENT_PARAMETERS, {}))
    }
  })
)(ContentTypeModalComponent)

export {
  ContentTypeModal
}
