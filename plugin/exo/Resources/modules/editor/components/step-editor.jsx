import React from 'react'
import classes from 'classnames'
import Panel from 'react-bootstrap/lib/Panel'
import PanelGroup from 'react-bootstrap/lib/PanelGroup'
import {makeItemPanelKey, makeStepPropPanelKey} from './../util'
import {t, tex, trans} from './../lib/translate'
import {makeSortable, SORT_VERTICAL} from './../lib/sortable'
import {properties} from './../types'
import {StepForm} from './step-form.jsx'
import {ItemForm} from './item-form.jsx'
import {MODAL_DELETE_CONFIRM, MODAL_ADD_ITEM} from './modals.jsx'

const T = React.PropTypes

const ParametersHeader = props =>
  <div onClick={props.onClick} className="panel-title">
    <span className={
      classes(
        'panel-icon',
        'fa',
        props.active ? 'fa-caret-down' : 'fa-caret-right'
      )}
    />
    &nbsp;{t('parameters', {}, 'platform')}
  </div>

ParametersHeader.propTypes = {
  active: T.bool.isRequired,
  onClick: T.func.isRequired
}

const ItemActions = props =>
  <span className="item-actions">
    <span
      role="button"
      title={tex('delete_item')}
      className="fa fa-trash-o"
      onClick={e => {
        e.stopPropagation()
        props.showModal(MODAL_DELETE_CONFIRM, {
          title: tex('delete_item'),
          question: tex('remove_question_confirm_message'),
          handleConfirm: () => props.handleItemDeleteClick(props.itemId, props.stepId)
        })
      }}
    />
    {props.connectDragSource(
      <span
        role="button"
        title={tex('move_item')}
        className="fa fa-bars drag-handle"
        draggable="true"
      />
    )}
  </span>

ItemActions.propTypes = {
  itemId: T.string.isRequired,
  stepId: T.string.isRequired,
  handleItemDeleteClick: T.func.isRequired,
  showModal: T.func.isRequired,
  connectDragSource: T.func.isRequired
}

const ItemHeader = props =>
  <div
    className="item-header"
    onClick={() => props.handlePanelClick(
      props.stepId,
      makeItemPanelKey(props.item.type, props.item.id)
    )}
  >
    <span>
      <svg className="icon-small">
        <use xlinkHref={`#icon-${properties[props.item.type].name}`}/>
      </svg>
      <span className="panel-title">
        {props.item.title || trans(properties[props.item.type].name, {}, 'question_types')}
      </span>
    </span>
    <ItemActions
      itemId={props.item.id}
      stepId={props.stepId}
      handleItemDeleteClick={props.handleItemDeleteClick}
      showModal={props.showModal}
      connectDragSource={props.connectDragSource}
    />
  </div>

ItemHeader.propTypes = {
  item: T.object.isRequired,
  stepId: T.string.isRequired,
  handlePanelClick: T.func.isRequired,
  handleItemDeleteClick: T.func.isRequired,
  showModal: T.func.isRequired,
  connectDragSource: T.func.isRequired
}

let ItemPanel = props =>
  props.connectDragPreview(
    props.connectDropTarget(
      <div
        className="panel"
        style={{opacity: props.isDragging ? 0 : 1}}
      >
        <Panel
          header={
            <ItemHeader
              item={props.item}
              stepId={props.stepId}
              handlePanelClick={props.handlePanelClick}
              handleItemDeleteClick={props.handleItemDeleteClick}
              showModal={props.showModal}
              connectDragSource={props.connectDragSource}
            />
          }
          collapsible={true}
          expanded={props.expanded}
        >
          {props.expanded &&
            <ItemForm
              id={props.item.id}
              initialValues={properties[props.item.type].initialFormValues(props.item)}
            >
              {React.createElement(
                properties[props.item.type].component,
                props.item
              )}
            </ItemForm>
          }
        </Panel>
      </div>
  ))

ItemPanel.propTypes = {
  id: T.string.isRequired,
  stepId: T.string.isRequired,
  index: T.number.isRequired,
  item: T.object.isRequired,
  expanded: T.bool.isRequired,
  handlePanelClick: T.func.isRequired,
  handleItemDeleteClick: T.func.isRequired,
  showModal: T.func.isRequired,
  connectDragSource: T.func.isRequired,
  isDragging: T.bool.isRequired,
  onSort: T.func.isRequired,
  sortDirection: T.string.isRequired
}

ItemPanel = makeSortable(ItemPanel, 'STEP_ITEM')

const StepFooter = props =>
  <div className="step-footer">
    <button
      className="btn btn-primary"
      onClick={() => props.showModal(MODAL_ADD_ITEM, {
        title: tex('add_question'),
        handleSelect: type => {
          props.closeModal()
          props.handleItemCreate(props.stepId, type)
        }
      })}
    >
      <span className="fa fa-plus"></span>
      &nbsp;{tex('add_question')}
    </button>
  </div>

StepFooter.propTypes = {
  stepId: T.string.isRequired,
  showModal: T.func.isRequired,
  handleItemCreate: T.func.isRequired
}

export const StepEditor = props =>
  <div>
    <PanelGroup accordion activeKey={props.activePanelKey}>
      <Panel
        eventKey={makeStepPropPanelKey(props.step.id)}
        header={
          <ParametersHeader
            active={props.activePanelKey === makeStepPropPanelKey(props.step.id)}
            onClick={() => props.handlePanelClick(
              props.step.id,
              makeStepPropPanelKey(props.step.id)
            )}
          />
        }
      >
        <StepForm stepId={props.step.id} initialValues={props.step.meta}/>
      </Panel>
      {props.step.items.map((item, index) =>
        <ItemPanel
          id={item.id}
          index={index}
          item={item}
          stepId={props.step.id}
          key={item.type + item.id}
          eventKey={makeItemPanelKey(item.type, item.id)}
          onSort={(id, swapId) => props.handleItemMove(id, swapId, props.step.id)}
          sortDirection={SORT_VERTICAL}
          handlePanelClick={props.handlePanelClick}
          handleItemDeleteClick={props.handleItemDeleteClick}
          handleItemCreate={props.handleItemCreate}
          showModal={props.showModal}
          {...props}
        />
      )}
    </PanelGroup>
    <StepFooter
      stepId={props.step.id}
      showModal={props.showModal}
      closeModal={props.closeModal}
      handleItemCreate={props.handleItemCreate}
    />
  </div>

StepEditor.propTypes = {
  step: T.shape({
    id: T.string.isRequired,
    items: T.arrayOf(T.object).isRequired,
    meta: T.object.isRequired
  }).isRequired,
  activePanelKey: T.oneOfType([T.string, T.bool]).isRequired,
  handlePanelClick: T.func.isRequired,
  handleItemDeleteClick: T.func.isRequired,
  handleItemMove: T.func.isRequired,
  handleItemCreate: T.func.isRequired,
  showModal: T.func.isRequired,
  closeModal: T.func.isRequired
}
