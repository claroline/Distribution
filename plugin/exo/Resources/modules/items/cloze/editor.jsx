import React, {Component, PropTypes as T} from 'react'
import {t, tex} from './../../utils/translate'
import {Textarea} from './../../components/form/textarea.jsx'
import {FormGroup} from './../../components/form/form-group.jsx'
import {actions} from './editor'
import {TooltipButton} from './../../components/form/tooltip-button.jsx'
import Popover from 'react-bootstrap/lib/Popover'

class HoleForm extends Component {
  constructor() {
    super()
    this.state = {showFeedback: false}
  }

  getHoleAnswers(hole) {
    return this.props.item.solutions.filter(solution => solution.holeId === hole.id).map(solution => solution.answers)
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
                id={`item-${this.props.hole.id}-multiple`}
                type="checkbox"
                checked={this.props.hole.multiple}
                onChange={e => this.props.onChange(
                  actions.updateHole(this.props.hole.id, 'multiple', e.target.value)
                )}
              />
            </div>
            <table>
              <tbody>
                <tr>
                  <td> Word </td>
                  <td></td>
                  <td> Score </td>
                  <td></td>
                </tr>
                  {this.getHoleAnswers(this.props.hole).map(answer => {
                    return (
                      <tr key={Math.random()}>
                        <td>
                          <input
                            className="form-control input-sm"
                            type="text"
                            value={answer.text}
                            onChange={e => this.props.onChange(
                              actions.updateAnswer(
                                this.props.hole.id,
                                'text',
                                answer.text,
                                answer.caseSensitive,
                                e.target.value
                              )
                            )}
                          />
                        </td>
                        <td>
                          <input
                             type="checkbox"
                             checked={answer.caseSensitive}
                             onChange={e => this.props.onChange(
                               actions.updateAnswer(
                                 this.props.hole.id,
                                 'caseSensitive',
                                 answer.text,
                                 answer.caseSensitive,
                                 e.target.value
                               )
                             )}
                           />
                        </td>
                        <td>
                          <input
                            className="form-control input-sm"
                            type="number"
                            value={answer.score}
                          />
                        </td>
                        <td>
                           <TooltipButton
                              id={`answer-${answer.text}-feedback-toggle`}
                              className="fa fa-comments-o"
                              title={tex('choice_feedback_info')}
                              onClick={() => this.setState({showFeedback: !this.state.showFeedback})}
                            />
                        </td>
                      </tr>
                    )}
                  )
                }
              </tbody>
            </table>
            {this.state.showFeedback &&
              <div className="feedback-container">
                <Textarea
                  id={`choice-${this.props.id}-feedback`}
                  title={tex('feedback')}
                  onChange={text => this.props.onChange(
                    actions.updateAnswer(this.props.id, 'feedback', text)
                  )}
                />
              </div>
            }
            <button className="btn btn-primary"> Keyword </button>
            <button className="btn btn-primary"> Save </button>
          </div>
        </Popover>
      )
  }
}

HoleForm.propTypes = {
  id: T.number.isRequired,
  item: T.object.isRequired,
  hole: T.object.isRequired,
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

  onOpenHole(el) {
    const isHole = el.className === ('edit-hole-btn' || 'delete-hole-btn')

    if (isHole) {
      const holeId = el.id
      this.props.onChange(actions.openHole(el.offsetLeft, el.offsetTop, holeId))
    }
  }

  closePopover(){
    //this is what we do here
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
            onClick={this.onOpenHole.bind(this)}
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
              hole={this.props.item._openedHole}
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
      offsetY: T.number.isRequired
    }),
    _openedHole: T.object
  }),
  onChange: T.func.isRequired
}
