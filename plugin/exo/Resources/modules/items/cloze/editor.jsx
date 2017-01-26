import React, {Component, PropTypes as T} from 'react'
import {t, tex} from './../../utils/translate'
import {ContentEditable, Textarea} from './../../components/form/textarea.jsx'
import {FormGroup} from './../../components/form/form-group.jsx'
import {actions} from './editor'
import {TooltipButton} from './../../components/form/tooltip-button.jsx'
import Popover from 'react-bootstrap/lib/Popover'
import {ErrorBlock} from './../../components/form/error-block.jsx'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

class ChoiceItem extends Component {
  constructor(props) {
    super(props)
    this.state = {showFeedback: false}
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="hole-word-error-block">
            {get(this.props, `_errors.answers.${this.props.id - 1}.text`) &&
              <ErrorBlock text={this.props._errors.answers[this.props.id - 1].text} warnOnly={!this.props.validating}/>
            }
            {get(this.props, `_errors.answers.${this.props.id - 1}.score`) &&
              <ErrorBlock text={this.props._errors.answers[this.props.id - 1].score} warnOnly={!this.props.validating}/>
            }
          </div>
          <div className="hole-form-row">
            <div className="col-xs-4">
              <ContentEditable
                id={`item-${this.props.id}-answer`}
                className="form-control input-sm"
                type="text"
                content={this.props.answer.text}
                onChange={text => this.props.onChange(
                  actions.updateAnswer(
                    this.props.hole.id,
                    'text',
                    this.props.answer.text,
                    this.props.answer.caseSensitive,
                    text
                  )
                )}
              />
            </div>
            <div className="col-xs-1">
              <input
                 type="checkbox"
                 checked={this.props.answer.caseSensitive}
                 onChange={e => this.props.onChange(
                   actions.updateAnswer(
                     this.props.hole.id,
                     'caseSensitive',
                     this.props.answer.text,
                     this.props.answer.caseSensitive,
                     e.target.checked
                   )
                 )}
               />
          </div>
          <div className="col-xs-4">
            <input
              className="form-control choice-form"
              type="number"
              value={this.props.answer.score}
              onChange={e => this.props.onChange(
                actions.updateAnswer(
                  this.props.hole.id,
                  'score',
                  this.props.answer.text,
                  this.props.answer.caseSensitive,
                  parseInt(e.target.value)
                )
              )}
            />
          </div>
          <div className="col-xs-3">
            <TooltipButton
              id={`choice-${this.props.id}-feedback-toggle`}
              className="fa fa-comments-o"
              title={tex('choice_feedback_info')}
              onClick={() => this.setState({showFeedback: !this.state.showFeedback})}
            />
            <TooltipButton
              id={`answer-${this.props.id}-delete`}
              className="fa fa-trash-o"
              title={t('delete')}
              onClick={() => this.props.onChange(
                actions.removeAnswer(this.props.answer.text, this.props.answer.caseSensitive)
              )}
            />
          </div>
        </div>
      </div>
      {this.state.showFeedback &&
        <div className="feedback-container">
          <Textarea
            id={`choice-${this.props.id}-feedback`}
            title={tex('feedback')}
            content={this.props.answer.feedback}
            onChange={text => this.props.onChange(
              actions.updateAnswer(
                this.props.hole.id,
                'feedback',
                this.props.answer.text,
                this.props.answer.caseSensitive,
                text
              )
            )}
          />
        </div>
        }
      </div>
    )
  }
}

ChoiceItem.defaultProps = {
  answer: {
    feedback: ''
  }
}

ChoiceItem.propTypes = {
  answer: T.shape({
    score: T.number,
    feedback: T.string,
    text: T.string,
    caseSensitive: T.bool
  }).isRequired,
  hole: T.shape({
    id: T.string.isRequired
  }).isRequired,
  id: T.number.isRequired,
  deletable: T.bool.isRequired,
  onChange: T.func.isRequired,
  offsetX: T.number.isRequired,
  offsetY: T.number.isRequired,
  validating: T.bool.isRequired,
  _errors: T.object
}

class HoleForm extends Component {
  constructor() {
    super()
    this.state = {showFeedback: false}

  }

  getHoleAnswers(hole) {
    //http://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
    //concat is here to flatten the array
    return [].concat.apply(
      [],
      this.props.item.solutions.filter(solution => solution.holeId === hole.id).map(solution => solution.answers)
    )
  }

  closePopover() {
    this.props.onChange(actions.closePopover())
  }

  render() {
    return (
      <Popover
        bsClass="hole-form-content"
        id={this.props.hole.id}
        placement="right"
        positionLeft={this.props.offsetX}
        positionTop={this.props.offsetY - 210}
      >
        <div className="panel-default">
          <div className="panel-body pull-right close-popover hole-form-row" onClick={this.closePopover.bind(this)}><b>x</b></div>
          <div className="panel-body">
            <div className="row">
              <div className="hole-form-row">
                <div className="col-xs-2">
                  {tex('size')}
                </div>
                <input
                  id={`item-${this.props.hole.id}-size`}
                  type="number"
                  min="0"
                  value={this.props.hole.size}
                  className="col-xs-2 form-control hole-size"
                  onChange={e => this.props.onChange(
                    actions.updateHole(this.props.hole.id, 'size', e.target.value)
                  )}
                />
                <div className="col-xs-1">
                  <input
                    type="checkbox"
                    checked={this.props.hole._multiple}
                    onChange={e => this.props.onChange(
                      actions.updateHole(
                        this.props.hole.id,
                        '_multiple',
                        e.target.checked
                      )
                    )}
                  />
                </div>
                <div className="col-xs-6">
                  {tex('submit_a_list')}
                </div>
              </div>
            </div>
            <div>
              {get(this.props, '_errors.size') &&
                <ErrorBlock text={this.props._errors.size} warnOnly={!this.props.validating}/>
              }
              {get(this.props, '_errors.multiple') &&
                <ErrorBlock text={this.props._errors.multiple} warnOnly={!this.props.validating}/>
              }
            </div>
            <div className="hole-form-row">
              <div className="col-xs-5"><b>{tex('word')}</b></div>
              <div className="col-xs-7"><b>{tex('score')}</b></div>
            </div>
            {this.props.solution.answers.map((answer, index) => {
              return (<ChoiceItem
                key={index}
                id={index}
                score={answer.score}
                feedback={answer.feedback}
                deletable={index > 0}
                onChange={this.props.onChange}
                hole={this.props.hole}
                answer={answer}
                offsetX={this.props.offsetX}
                offsetY={this.props.offsetY}
                validating={this.props.validating}
                _errors={this.props._errors}
              />)
            })}

            {this.state.showFeedback &&
              <div className="feedback-container hole-form-row">
                <Textarea
                  id={`choice-${this.props.hole.id}-feedback`}
                  title={tex('feedback')}
                  onChange={text => this.props.onChange(
                    actions.updateAnswer(this.props.hole.id, 'feedback', text)
                  )}
                />
              </div>
            }
            <div className="hole-form-row">
              <button
                className="btn btn-default"
                onClick={() => this.props.onChange(
                  actions.addAnswer(this.props.hole.id))}
                type="button"
              >
                <i className="fa fa-plus"/>
                {tex('keyword')}
              </button>
              {'\u00a0'}
              <button
                className="btn btn-primary"
                onClick={() =>this.props.onChange(actions.saveHole())}
                type="button"
                disabled={!isEmpty(this.props._errors)}
              >
                {tex('save')}
              </button>
            </div>
          </div>
        </div>
      </Popover>
    )
  }
}

HoleForm.propTypes = {
  item: T.object.isRequired,
  hole: T.object.isRequired,
  solution: T.object.isRequired,
  onChange: T.func.isRequired,
  offsetX: T.number.isRequired,
  offsetY: T.number.isRequired,
  validating: T.bool.isRequired,
  _errors: T.object
}

export class Cloze extends Component {
  constructor(props) {
    super(props)
    this.selection = null
    this.startSelectOffset = null
    this.endSelectOffset = null
    this.offsetX = null
    this.offsetY = null
  }

  onSelect(selection, startOffset, endOffset, offsetX, offsetY) {
    this.selection = selection
    this.startSelectOffset = startOffset
    this.endSelectOffset = endOffset
    this.offsetX = offsetX
    this.offsetY = offsetY
  }

  onHoleClick(el) {
    if (el.className === 'fa fa-pencil edit-hole-btn') {
      this.offsetX = el.getBoundingClientRect().right
      this.offsetY = el.getBoundingClientRect().bottom
      this.props.onChange(actions.openHole(
        el.dataset.holeId,
        this.startSelectOffset,
        this.endSelectOffset,
        this.offsetX,
        this.offsetY
      ))
    } else {
      if (el.className === 'fa fa-trash delete-hole-btn') {
        this.props.onChange(actions.removeHole(el.dataset.holeId))
      }
    }
  }

  addHole() {
    return actions.addHole(this.selection, this.startSelectOffset, this.endSelectOffset, this.offsetX, this.offsetY)
  }

  render() {
    return(
      <div>
        <FormGroup controlId="cloze-text" label={t('text')}>
          <Textarea
            id={this.props.item.id}
            onChange={(value) => this.props.onChange(actions.updateText(value))}
            onSelect={this.onSelect.bind(this)}
            onClick={this.onHoleClick.bind(this)}
            content={this.props.item._text}
          />
        </FormGroup>
        <button
          type="button"
          className="btn btn-default"
          onClick={() => this.props.onChange(this.addHole())}><i className="fa fa-plus"/>
          {tex('create_cloze')}
        </button>
        {this.props.item._popover &&
          <div>
            <HoleForm
              item={this.props.item}
              offsetX={this.props.item._popover.offsetX}
              offsetY={this.props.item._popover.offsetY}
              hole={this.props.item._popover.hole}
              solution={this.props.item._popover.solution}
              onChange={this.props.onChange}
              validating={this.props.validating}
              _errors={this.props.item._errors}
            />
          </div>
        }
      </div>
    )
  }
}

Cloze.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    text: T.string.isRequired,
    _text: T.string.isRequired,
    _errors: T.object,
    _popover: T.shape({
      offsetX: T.number.isRequired,
      offsetY: T.number.isRequired,
      hole: T.object,
      solution: T.object
    })
  }),
  onChange: T.func.isRequired,
  validating: T.bool.isRequired
}
