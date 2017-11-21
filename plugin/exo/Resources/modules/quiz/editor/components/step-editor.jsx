import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'

import Panel from 'react-bootstrap/lib/Panel'
import PanelGroup from 'react-bootstrap/lib/PanelGroup'

import {t, tex, trans} from '#/main/core/translation'
import {TooltipElement} from '#/main/core/layout/components/tooltip-element.jsx'
import {TooltipButton} from '#/main/core/layout/button/components/tooltip-button.jsx'
import {makeItemPanelKey, makeStepPropPanelKey} from './../../../utils/utils'
import {makeSortable, SORT_VERTICAL} from './../../../utils/sortable'
import {getDefinition, isQuestionType} from './../../../items/item-types'
import {getContentDefinition} from './../../../contents/content-types'

import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_ADD_ITEM} from './modal/add-item-modal.jsx'
import {MODAL_IMPORT_ITEMS} from './modal/import-items-modal.jsx'
import {MODAL_ADD_CONTENT} from './modal/add-content-modal.jsx'
import {MODAL_MOVE_ITEM} from './modal/move-item-modal.jsx'
import {MODAL_DUPLICATE_ITEM} from '#/plugin/exo/items/components/modal/duplicate-modal.jsx'

import {select as quizSelect} from './../../selectors'
import {select} from './../selectors'
import {actions} from './../actions'

import {Icon as ItemIcon} from './../../../items/components/icon.jsx'
import {ValidationStatus} from '#/plugin/exo/components/validation-status.jsx'
import {StepForm} from './step-form.jsx'
import {ItemForm} from './item-form.jsx'
import {ContentItemForm} from './content-item-form.jsx'
import {ItemPanelDragPreview} from './item-panel-drag-preview.jsx'
import {ContentPanelDragPreview} from './content-panel-drag-preview.jsx'
import {getNumbering} from './../../../utils/numbering'
import {NUMBERING_NONE} from './../../../quiz/enums'

const ParametersHeader = props =>
  <div onClick={props.onClick} className="panel-title editor-panel-title" aria-expanded={props.active}>
    <span className={
      classes(
        'fa fa-fw',
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
  <div className="item-actions">
    {props.hasErrors &&
      <ValidationStatus
        id={`${props.itemId}-panel-tip`}
        validating={props.validating}
        position="left"
      />
    }

    <TooltipButton
      id={`item-panel-${props.itemId}-delete`}
      className="btn-link-danger"
      title={t('delete')}
      position="left"
      onClick={() => props.handleItemDelete(props.itemId)}
    >
      <span className="fa fa-fw fa-trash-o" />
    </TooltipButton>

    <TooltipButton
      id={`item-panel-${props.itemId}-change-step`}
      className="btn-link-default"
      title={tex('change_step')}
      position="left"
      onClick={() => props.handleItemChangeStep(props.itemId)}
    >
      <span className="fa fa-fw fa-exchange" />
    </TooltipButton>

    <TooltipButton
      id={`item-panel-${props.itemId}-duplicate`}
      className="btn-link-default"
      title={tex('duplicate')}
      position="left"
      onClick={() => props.handleItemDuplicate(props.itemId)}
    >
      <span className="fa fa-fw fa-copy" />
    </TooltipButton>

    <TooltipElement
      id={`item-panel-${props.itemId}-move`}
      position="left"
      tip={tex('move_item')}
    >
      {props.connectDragSource(
        <span
          role="button"
          className="btn btn-link-default drag-handle"
          draggable="true"
        >
          <span className="fa fa-fw fa-arrows" />
        </span>
      )}
    </TooltipElement>
  </div>

ItemActions.propTypes = {
  itemId: T.string.isRequired,
  hasErrors: T.bool.isRequired,
  validating: T.bool.isRequired,
  handleItemDelete: T.func.isRequired,
  connectDragSource: T.func.isRequired,
  handleItemChangeStep: T.func.isRequired,
  handleItemDuplicate: T.func.isRequired
}

const ItemHeader = props =>
  <div
    className="item-header"
    onClick={() => props.handlePanelClick(makeItemPanelKey(props.item.type, props.item.id))}
  >
    <span className="panel-title" aria-expanded={props.expanded}>
      <ItemIcon name={getDefinition(props.item.type).name}/>
      {props.numbering &&
        <span>{props.numbering}.{'\u00A0'}</span>
      }
      {props.item.title || trans(getDefinition(props.item.type).name, {}, 'question_types')}
    </span>

    <ItemActions
      itemId={props.item.id}
      hasErrors={props.hasErrors}
      validating={props.validating}
      handleItemDelete={props.handleItemDelete}
      handleItemDuplicate={props.handleItemDuplicate}
      handleItemChangeStep={props.handleItemChangeStep}
      connectDragSource={props.connectDragSource}
    />
  </div>

ItemHeader.propTypes = {
  item: T.object.isRequired,
  numbering: T.string,
  handlePanelClick: T.func.isRequired,
  handleItemDelete: T.func.isRequired,
  handleItemChangeStep: T.func.isRequired,
  handleItemDuplicate: T.func.isRequired,
  hasErrors: T.bool.isRequired,
  validating: T.bool.isRequired,
  connectDragSource: T.func.isRequired,
  expanded: T.bool.isRequired
}

const ItemPanel = props => props.connectDropTarget(
  <div
    id={`panel-${props.item.id}`}
    style={{opacity: props.isDragging ? 0 : 1}}
  >
    <fieldset
      disabled={props.item.meta.protectQuestion && !props.item.rights.edit}
    >
      <Panel
        header={
          <ItemHeader
            item={props.item}
            numbering={props.numbering !== NUMBERING_NONE ? props.stepIndex + '.' + getNumbering(props.numbering, props.index): null}
            handlePanelClick={props.handlePanelClick}
            handleItemDelete={props.handleItemDelete}
            handleItemChangeStep={props.handleItemChangeStep}
            handleItemDuplicate={props.handleItemDuplicate}
            connectDragSource={props.connectDragSource}
            hasErrors={!isEmpty(props.item._errors)}
            validating={props.validating}
            expanded={props.expanded}
          />
        }
        collapsible={true}
        expanded={props.expanded}
      >
        <ItemForm
          item={props.item}
          validating={props.validating}
          showModal={props.showModal}
          mandatoryQuestions={props.mandatoryQuestions}
          closeModal={props.closeModal}
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
              validating: props.validating,
              onChange: subAction =>
                props.handleItemDetailUpdate(props.item.id, subAction)
            }
          )}
        </ItemForm>
      </Panel>
    </fieldset>
  </div>
)

ItemPanel.propTypes = {
  id: T.string.isRequired,
  index: T.number.isRequired,
  stepIndex: T.number.isRequired,
  item: T.object.isRequired,
  numbering: T.string.isRequired,
  expanded: T.bool.isRequired,
  mandatoryQuestions: T.bool.isRequired,
  handlePanelClick: T.func.isRequired,
  handleItemDelete: T.func.isRequired,
  handleItemUpdate: T.func.isRequired,
  handleItemChangeStep: T.func.isRequired,
  handleItemDetailUpdate: T.func.isRequired,
  handleItemHintsUpdate: T.func.isRequired,
  handleItemDuplicate: T.func.isRequired,
  showModal: T.func.isRequired,
  closeModal: T.func.isRequired,
  connectDragSource: T.func.isRequired,
  connectDropTarget: T.func.isRequired,
  isDragging: T.bool.isRequired,
  onSort: T.func.isRequired,
  sortDirection: T.string.isRequired,
  validating: T.bool.isRequired
}

const ContentHeader = props =>
  <div
    className="item-header"
    onClick={() => props.handlePanelClick(makeItemPanelKey(props.item.type, props.item.id))}
  >
    <span className="panel-title" aria-expanded={props.expanded}>
      <span className={classes('item-icon', 'item-icon-sm', getContentDefinition(props.item.type).icon)} />
      {props.item.title || trans(getContentDefinition(props.item.type).type, {}, 'question_types')}
    </span>

    <ItemActions
      itemId={props.item.id}
      handleItemDelete={props.handleItemDelete}
      handleItemDuplicate={props.handleItemDuplicate}
      handleItemChangeStep={props.handleItemChangeStep}
      hasErrors={props.hasErrors}
      validating={props.validating}
      connectDragSource={props.connectDragSource}
    />
  </div>

ContentHeader.propTypes = {
  item: T.object.isRequired,
  handlePanelClick: T.func.isRequired,
  handleItemDelete: T.func.isRequired,
  handleItemDuplicate: T.func.isRequired,
  handleItemChangeStep: T.func.isRequired,
  hasErrors: T.bool.isRequired,
  validating: T.bool.isRequired,
  connectDragSource: T.func.isRequired,
  expanded: T.bool.isRequired
}

const ContentPanel = props => props.connectDropTarget(
  <div style={{opacity: this.props.isDragging ? 0 : 1}}>
    <Panel
      header={
        <ContentHeader
          item={this.props.item}
          handlePanelClick={this.props.handlePanelClick}
          handleItemDelete={this.props.handleItemDelete}
          handleItemDuplicate={this.props.handleItemDuplicate}
          handleItemChangeStep={this.props.handleItemChangeStep}
          connectDragSource={this.props.connectDragSource}
          hasErrors={!isEmpty(this.props.item._errors)}
          validating={this.props.validating}
          expanded={this.props.expanded}
        />
      }
      collapsible={true}
      expanded={this.props.expanded}
    >
      <ContentItemForm
        item={this.props.item}
        validating={this.props.validating}
        onChange={(propertyPath, value) =>
          this.props.handleContentItemUpdate(this.props.item.id, propertyPath, value)
        }
      >
        {React.createElement(
          getContentDefinition(this.props.item.type).editor.component,
          {
            item: this.props.item,
            validating: this.props.validating,
            onChange: subAction =>
              this.props.handleContentItemDetailUpdate(this.props.item.id, subAction)
          }
        )}
      </ContentItemForm>
    </Panel>
  </div>
)

ContentPanel.propTypes = {
  id: T.string.isRequired,
  item: T.object.isRequired,
  expanded: T.bool.isRequired,
  numbering: T.string,
  handlePanelClick: T.func.isRequired,
  handleItemDelete: T.func.isRequired,
  handleItemChangeStep: T.func.isRequired,
  /*handleItemUpdate: T.func.isRequired,*/
  handleItemDuplicate: T.func.isRequired,
  handleItemDetailUpdate: T.func.isRequired,
  handleContentItemUpdate: T.func.isRequired,
  handleContentItemDetailUpdate: T.func.isRequired,
  connectDropTarget: T.func.isRequired,
  connectDragSource: T.func.isRequired,
  isDragging: T.bool.isRequired,
  onSort: T.func.isRequired,
  sortDirection: T.string.isRequired,
  validating: T.bool.isRequired
}

let SortableItemPanel = makeSortable(
  ItemPanel,
  'STEP_ITEM',
  ItemPanelDragPreview
)

let SortableContentPanel = makeSortable(
  ContentPanel,
  'STEP_ITEM',
  ContentPanelDragPreview
)

class StepFooter extends Component {
  constructor(props) {
    super(props)

    this.actionsMap = [
      [MODAL_ADD_ITEM,     tex('add_question_from_new'),      this.props.handleItemCreate],
      [MODAL_ADD_CONTENT,  tex('add_content'),                this.props.handleItemsImport],
      [MODAL_IMPORT_ITEMS, tex('add_question_from_existing'), this.props.handleContentItemCreate],
    ]

    // set up the default action
    this.state = {currentAction: this.actionsMap[0][0]}
  }

  handleAction(action) {
    // set selected action as the current one
    this.setState({currentAction: action[0]})
    // execute action
    action[2](this.props.stepId)
  }

  render() {
    const currentAction = this.actionsMap.find(action => this.state.currentAction === action[0])
    const otherActions = this.actionsMap.filter(action => this.state.currentAction !== action[0])

    return (
      <div className="step-footer">
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => this.handleAction(currentAction)}
          >
            {currentAction[1]}
          </button>
          <button
            type="button"
            className="btn btn-primary dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span className="fa fa-caret-down" />
            <span className="sr-only">Toggle Dropdown</span>
          </button>

          <ul className="dropdown-menu">
            {otherActions.map(action =>
              <li key={action[0]}>
                <a role="button" onClick={() => this.handleAction(action)}>
                  {action[1]}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    )
  }
}

StepFooter.propTypes = {
  stepId: T.string.isRequired,
  showModal: T.func.isRequired,
  closeModal: T.func.isRequired,
  handleItemCreate: T.func.isRequired,
  handleItemsImport: T.func.isRequired,
  handleContentItemCreate: T.func.isRequired,
  handleContentItemUpdate: T.func,
  handleFileUpload: T.func
}

const StepEditor = props =>
  <div>
    <PanelGroup accordion activeKey={props.activePanelKey}>
      <Panel
        className="step-parameters"
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
          id={props.step.id}
          title={props.step.title}
          description={props.step.description}
          onChange={(newValue) => props.updateStep(props.step.id, newValue)}
        />
      </Panel>

      <hr />

      {props.step.items.map((item, index) => isQuestionType(item.type) ?
        <SortableItemPanel
          {...props}

          id={item.id}
          index={index}
          item={item}
          mandatoryQuestions={props.mandatoryQuestions}
          stepId={props.step.id}
          key={item.type + item.id}
          eventKey={makeItemPanelKey(item.type, item.id)}
          onSort={(id, swapId) => props.handleItemMove(id, swapId, props.step.id)}
          sortDirection={SORT_VERTICAL}
          validating={props.validating}

          handlePanelClick={panelKey => props.handlePanelClick(props.step.id, panelKey)}
          handleItemDelete={itemId => props.handleItemDelete(props.step.id, itemId)}
          handleItemDuplicate={(itemId, amount) => props.handleItemDuplicate(props.step.id, itemId, amount)}
          handleItemChangeStep={props.handleItemChangeStep}

          handleItemUpdate={props.handleItemUpdate}
          handleItemHintsUpdate={props.handleItemHintsUpdate}
          handleItemDetailUpdate={props.handleItemDetailUpdate}
          showModal={props.showModal}
          closeModal={props.closeModal}
        /> :
        <SortableContentPanel
          {...props}

          id={item.id}
          index={index}
          item={item}
          stepId={props.step.id}
          key={item.type + item.id}
          eventKey={makeItemPanelKey(item.type, item.id)}
          onSort={(id, swapId) => props.handleItemMove(id, swapId, props.step.id)}
          sortDirection={SORT_VERTICAL}
          validating={props.validating}

          handlePanelClick={panelKey => props.handlePanelClick(props.step.id, panelKey)}
          handleItemDelete={itemId => props.handleItemDelete(props.step.id, itemId)}
          handleItemDuplicate={(itemId, amount) => props.handleItemDuplicate(props.step.id, itemId, amount)}
          handleItemChangeStep={props.handleItemChangeStep}

          handleContentItemUpdate={props.handleContentItemUpdate}
          handleContentItemDetailUpdate={props.handleContentItemDetailUpdate}
          showModal={props.showModal}
        />
      )}
    </PanelGroup>

    {props.step.items.length === 0 &&
      <div className="no-item-info">{tex('no_item_info')}</div>
    }

    <StepFooter
      stepId={props.step.id}
      showModal={props.showModal}
      closeModal={props.closeModal}
      handleItemCreate={props.handleItemCreate}
      handleItemsImport={props.handleItemsImport}
      handleContentItemCreate={props.handleContentItemCreate}
      handleContentItemUpdate={props.handleContentItemUpdate}
      handleFileUpload={props.handleFileUpload}
    />
  </div>

StepEditor.propTypes = {
  stepIndex: T.number,
  step: T.shape({
    id: T.string.isRequired,
    title: T.string.isRequired,
    description: T.string.isRequired,
    parameters: T.shape({
      maxAttempts: T.number.isRequired
    }).isRequired,
    items: T.arrayOf(T.object).isRequired
  }).isRequired,
  mandatoryQuestions: T.bool.isRequired,
  numbering: T.string,
  activePanelKey: T.oneOfType([T.string, T.bool]).isRequired,
  validating: T.bool.isRequired,

  updateStep: T.func.isRequired,
  handlePanelClick: T.func.isRequired,
  handleItemDelete: T.func.isRequired,
  handleItemChangeStep: T.func.isRequired,
  handleItemDuplicate: T.func.isRequired,
  handleItemMove: T.func.isRequired,
  handleItemCreate: T.func.isRequired,
  handleItemUpdate: T.func.isRequired,
  handleItemHintsUpdate: T.func.isRequired,
  handleItemsImport: T.func.isRequired,
  handleContentItemCreate: T.func.isRequired,
  handleContentItemUpdate: T.func,
  showModal: T.func.isRequired,
  closeModal: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    step: select.currentObjectDeep(state),
    stepIndex: select.currentObjectIndex(state),
    validating: select.validating(state),
    numbering: quizSelect.quizNumbering(state),
    mandatoryQuestions: quizSelect.mandatoryQuestions(state),
    activePanelKey: select.stepOpenPanel(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateStep(stepId, newValue) {
      dispatch(actions.updateStep(stepId, newValue))
    },
    handlePanelClick(stepId, panelKey) {
      dispatch(actions.selectStepPanel(stepId, panelKey))
    },
    handleItemDelete(stepId, itemId) {
      dispatch(
        modalActions.showModal(MODAL_DELETE_CONFIRM, {
          title: tex('delete_item'),
          question: tex('remove_question_confirm_message'),
          handleConfirm: () => dispatch(actions.deleteStepItem(stepId, itemId))
        })
      )
    },
    handleItemMove(id, swapId, stepId) {
      dispatch(actions.moveItem(id, swapId, stepId))
    },
    handleItemChangeStep(itemId) {
      dispatch(
        modalActions.showModal(MODAL_MOVE_ITEM, {
          title: tex('change_step'),
          question: tex('change_step_confirm_message'),
          handleClick: stepId => dispatch(actions.changeItemStep(itemId, stepId))
        })
      )
    },
    handleItemDuplicate(itemId) {
      dispatch(
        modalActions.showModal(MODAL_DUPLICATE_ITEM, {
          title: tex('duplicate_item'),
          handleSubmit: amount => dispatch(actions.duplicateItem(itemId, amount))
        })
      )
    },
    handleItemUpdate(itemId, propertyPath, value) {
      dispatch(actions.updateItem(itemId, propertyPath, value))
    },
    handleItemHintsUpdate(itemId, updateType, payload) {
      dispatch(actions.updateItemHints(itemId, updateType, payload))
    },
    handleItemDetailUpdate(itemId, subAction) {
      dispatch(actions.updateItemDetail(itemId, subAction))
    },
    handleItemCreate(stepId) {
      dispatch(
        modalActions.showModal(MODAL_ADD_ITEM, {
          title: tex('add_question_from_new'),
          handleSelect: type => dispatch(actions.createItem(stepId, type))
        })
      )
    },
    handleContentItemCreate(stepId) {
      this.props.showModal(MODAL_ADD_CONTENT, {
        title: tex('add_content'),
        handleSelect: (selected) => dispatch(actions.createContentItem(stepId, selected)),
        handleFileUpload: (itemId, file) => dispatch(actions.saveContentItemFile(itemId, file))
      })
    },
    handleItemsImport(stepId) {
      dispatch(
        modalActions.showModal(MODAL_IMPORT_ITEMS, {
          title: tex('add_question_from_existing'),
          handleSelect: selectedItems => dispatch(actions.importItems(stepId, selectedItems))
        })
      )
    },
    handleContentItemUpdate(id, propertyPath, value) {
      dispatch(actions.updateContentItem(id, propertyPath, value))
    },
    handleContentItemDetailUpdate(id, subAction) {
      dispatch(actions.updateContentItemDetail(id, subAction))
    },

    showModal(type, props) {
      dispatch(modalActions.showModal(type, props))
    },
    closeModal() {
      dispatch(modalActions.fadeModal())
    }
  }
}

const ConnectedStepEditor = connect(mapStateToProps, mapDispatchToProps)(StepEditor)

export {
  ConnectedStepEditor as StepEditor
}
