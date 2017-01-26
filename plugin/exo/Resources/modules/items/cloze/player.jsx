import React, {Component, PropTypes as T} from 'react'
import {utils} from './utils/utils'
import cloneDeep from 'lodash/cloneDeep'
import {tex} from './../../utils/translate'

export class ClozePlayer extends Component {
  constructor(props) {
    super(props)
    this.onAnswer = this.onAnswer.bind(this)
  }

  onAnswer(holeId, text) {
    let answer = null
    const answers = cloneDeep(this.props.answer)
    if (this.props.answer.length > 0) answer = answers.find(item => item.holeId === holeId)

    ;(answer) ?
      answer.answerText = text:
      answers.push({answerText: text, holeId})

    return answers
  }

  render() {
    const elements = utils.split(this.props.item.text, this.props.item.holes, this.props.item.solutions)

    return (
      <div>
        {elements.map((el, key) => {
          return (
            <span key={key}>
              {(el.choices) ?
                <span>
                  {el.text}
                    <select
                      defaultValue=''
                      className="form-control inline-select"
                      onChange={(e) => this.props.onChange(this.onAnswer(
                      el.holeId,
                      e.target.value
                    ))}>
                      <option value=''>{tex('please_choose')}</option>
                      {el.choices.map((choice, idx) => <option value={choice} key={idx}>{ choice }</option>)}
                    </select>
                </span> :
                (el.holeId) ?
                  <span>
                    {el.text}
                    <input
                      className="form-control inline-select"
                      type="text"
                      onChange={(e) => this.props.onChange(this.onAnswer(
                        el.holeId,
                        e.target.value
                      ))
                    }/>
                  </span> :
                  <span>{el.text}</span>
              }
            </span>
          )
        })}
      </div>
    )
  }
}


ClozePlayer.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    holes: T.array.isRequired,
    solutions: T.array.isRequired,
    text: T.string.isRequired
  }).isRequired,
  answer: T.array,
  onChange: T.func.isRequired
}

ClozePlayer.defaultProps = {
  answer: []
}
