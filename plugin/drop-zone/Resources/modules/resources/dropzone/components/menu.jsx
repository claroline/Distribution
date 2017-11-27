import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

import {constants} from '#/plugin/drop-zone/resources/dropzone/constants'
import {select} from '#/plugin/drop-zone/resources/dropzone/selectors'
import {actions} from '#/plugin/drop-zone/resources/dropzone/player/actions'
import {DropzoneType, DropType} from '#/plugin/drop-zone/resources/dropzone/prop-types'

const Menu = props =>
  <div id="dropzone-menu">
    {props.currentState === constants.STATE_NOT_STARTED &&
      <div className="alert alert-info">
        <HtmlText>
          {trans('state_not_started', {}, 'dropzone')}
        </HtmlText>
      </div>
    }

    {props.currentState === constants.STATE_FINISHED &&
      <div className="alert alert-info">
        <HtmlText>
          {trans('state_finished', {}, 'dropzone')}
        </HtmlText>
      </div>
    }

    {props.dropzone.display.instruction &&
      <div id="instruction-container">
        <hr/>
        <h2>{trans('instructions', {}, 'dropzone')}</h2>
        <HtmlText>
          {props.dropzone.display.instruction}
        </HtmlText>
        <hr/>
      </div>
    }

    {!props.myDrop && [constants.STATE_ALLOW_DROP, constants.STATE_ALLOW_DROP_AND_PEER_REVIEW].indexOf(props.currentState) > -1 &&
      <button
        className="btn btn-primary pull-right"
        onClick={() => props.initializeMyDrop()}
      >
        {trans('start_evaluation', {}, 'dropzone')}
      </button>
    }

    {props.myDrop &&
      <a
        href="#/my/drop"
        className="btn btn-primary pull-right"
      >
        {!props.myDrop.finished && [constants.STATE_ALLOW_DROP, constants.STATE_ALLOW_DROP_AND_PEER_REVIEW].indexOf(props.currentState) > -1 ?
          trans('complete_my_copy', {}, 'dropzone') :
          trans('see_my_copy', {}, 'dropzone')
        }
      </a>
    }
  </div>

Menu.propTypes = {
  dropzone: T.shape(DropzoneType.propTypes).isRequired,
  myDrop: T.shape(DropType.propTypes),
  currentState: T.number.isRequired,
  initializeMyDrop: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    dropzone: select.dropzone(state),
    myDrop: select.myDrop(state),
    currentState: select.currentState(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    initializeMyDrop: () => dispatch(actions.initializeMyDrop())
  }
}

const ConnectedMenu = connect(mapStateToProps, mapDispatchToProps)(Menu)

export {ConnectedMenu as Menu}