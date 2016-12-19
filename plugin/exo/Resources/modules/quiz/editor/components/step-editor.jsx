import React, {PropTypes as T} from 'react'
import classes from 'classnames'
import Panel from 'react-bootstrap/lib/Panel'
import PanelGroup from 'react-bootstrap/lib/PanelGroup'
import {makeItemPanelKey, makeStepPropPanelKey} from './../../../utils/utils'
import {t, tex, trans} from './../../../utils/translate'
import {makeSortable, SORT_VERTICAL} from './../../../utils/sortable'
import {getDefinition} from './../../../items/item-types'
import {StepForm} from './step-form.jsx'
import {ItemForm} from './item-form.jsx'
import ItemIcon from './../../../items/common/item-icon.jsx'
import {MODAL_DELETE_CONFIRM, MODAL_ADD_ITEM, MODAL_IMPORT_ITEMS} from './modals.jsx'

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
      <ItemIcon name={getDefinition(props.item.type).name} />
      <span className="panel-title">
        {props.item.title || trans(getDefinition(props.item.type).name, {}, 'question_types')}
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
              item={props.item}
              onChange={(propertyPath, value) =>
                props.handleItemUpdate(props.item.id, propertyPath, value)
              }
              onHintsChange={(updateType, payload) =>
                props.handleItemHintsUpdate(props.item.id, updateType, payload)
              }
            >
              {React.createElement(
                getDefinition(props.item.type).editor.component,
                {
                  item: props.item,
                  onChange: subAction =>
                    props.handleItemDetailUpdate(props.item.id, subAction)
                }
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
  handleItemUpdate: T.func.isRequired,
  handleItemDetailUpdate: T.func.isRequired,
  showModal: T.func.isRequired,
  connectDragSource: T.func.isRequired,
  isDragging: T.bool.isRequired,
  onSort: T.func.isRequired,
  sortDirection: T.string.isRequired
}

ItemPanel = makeSortable(ItemPanel, 'STEP_ITEM')

const StepFooter = props =>
  <div className="step-footer">
      <div className="btn-group ">
        <button
          className="btn btn-primary btn-sm dropdown-toggle"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          >
          <span className="fa fa-plus"></span>
          &nbsp;{tex('add_question')}&nbsp;
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          <li>
            <a role="button" onClick={() => props.showModal(MODAL_ADD_ITEM, {
              title: tex('add_question_from_new'),
              handleSelect: type => {
                props.closeModal()
                props.handleItemCreate(props.stepId, type)
              }
            })}>{tex('add_question_from_new')}</a>
          </li>
          <li>
            <a role="button" onClick={() => props.showModal(MODAL_IMPORT_ITEMS, {
              title: tex('add_question_from_existing'),
              handleSelect: selected => {
                props.closeModal()
                props.handleItemsImport(props.stepId, selected)
              }
            })}>{tex('add_question_from_existing')}</a>
          </li>
        </ul>
      </div>
  </div>

StepFooter.propTypes = {
  stepId: T.string.isRequired,
  showModal: T.func.isRequired,
  handleItemCreate: T.func.isRequired,
  handleItemsImport: T.func.isRequired
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
        <StepForm
          onChange={(newValue) => props.updateStep(props.step.id, newValue)}
          {...props.step}
        />
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
          handleItemUpdate={props.handleItemUpdate}
          handleItemHintsUpdate={props.handleItemHintsUpdate}
          handleItemDetailUpdate={props.handleItemDetailUpdate}
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
      handleItemsImport={props.handleItemsImport}
    />
  </div>

StepEditor.propTypes = {
  step: T.shape({
    id: T.string.isRequired,
    title: T.string.isRequired,
    description: T.string.isRequired,
    parameters: T.shape({
      maxAttempts: T.number.isRequired
    }).isRequired,
    items: T.arrayOf(T.object).isRequired
  }).isRequired,
  activePanelKey: T.oneOfType([T.string, T.bool]).isRequired,
  updateStep: T.func.isRequired,
  handlePanelClick: T.func.isRequired,
  handleItemDeleteClick: T.func.isRequired,
  handleItemMove: T.func.isRequired,
  handleItemCreate: T.func.isRequired,
  handleItemUpdate: T.func.isRequired,
  handleItemHintsUpdate: T.func.isRequired,
  handleItemsImport: T.func.isRequired,
  showModal: T.func.isRequired,
  closeModal: T.func.isRequired
}
