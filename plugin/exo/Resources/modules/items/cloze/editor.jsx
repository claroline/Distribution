import React, {Component, PropTypes as T} from 'react'
import {t, tex} from './../../utils/translate'
import {ContentEditable, Textarea} from './../../components/form/textarea.jsx'
import {FormGroup} from './../../components/form/form-group.jsx'
import {actions} from './editor'
import {TooltipButton} from './../../components/form/tooltip-button.jsx'
import Popover from 'react-bootstrap/lib/Popover'

class ChoiceItem extends Component {
  constructor(props) {
    super(props)
    this.state = {showFeedback: false}
  }

  render() {
    return (
      <div>
        <div className="text-fields">
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
        <div className="right-controls">
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
                e.target.checked
              )
            )}
          />
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
  offsetY: T.number.isRequired
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

  render() {
    return (
        <Popover
          className="hole-form"
          id={this.props.hole.id}
          placement="right"
          positionLeft={this.props.offsetX}
          positionTop={this.props.offsetY - 210}
        >
          <div>
            <FormGroup
              controlId={`item-${this.props.hole.id}-fixedSuccess`}
              label={tex('size')}
            >
              <input
                id={`item-${this.props.hole.id}-size`}
                type="number"
                min="0"
                value={this.props.hole.size}
                className="input-sm form-control"
                onChange={e => this.props.onChange(
                  actions.updateHole(this.props.hole.id, 'size', e.target.value)
                )}
              />
            </FormGroup>
            <div className="right-controls">
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
              />)
            })}

            {this.state.showFeedback &&
              <div className="feedback-container">
                <Textarea
                  id={`choice-${this.props.hole.id}-feedback`}
                  title={tex('feedback')}
                  onChange={text => this.props.onChange(
                    actions.updateAnswer(this.props.hole.id, 'feedback', text)
                  )}
                />
              </div>
            }
            <button
              className="btn btn-primary"
              onClick={() => this.props.onChange(
                actions.addAnswer(this.props.hole.id))}
            >
              Keyword
            </button>
            <button className="btn btn-primary" onClick={() =>
                this.props.onChange(actions.saveHole())}> Save </button>
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
  offsetY: T.number.isRequired
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
    if (el.className === 'edit-hole-btn') {
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
      if (el.className === 'delete-hole-btn') {
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
        <button type="button" onClick={() => this.props.onChange(this.addHole())}> Create Cloze </button>
        {this.props.item._popover &&
          <div>
            <HoleForm
              item={this.props.item}
              offsetX={this.props.item._popover.offsetX}
              offsetY={this.props.item._popover.offsetY}
              hole={this.props.item._popover.hole}
              solution={this.props.item._popover.solution}
              onChange={this.props.onChange}
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
    _popover: T.shape({
      offsetX: T.number.isRequired,
      offsetY: T.number.isRequired,
      hole: T.object,
      solution: T.object
    })
  }),
  onChange: T.func.isRequired
}
