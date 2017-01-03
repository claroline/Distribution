import React, {PropTypes as T} from 'react'

export const ChoicePlayer = props =>
  <div>
    {props.item.choices.map(choice =>
      <div key={choice.id}>
        <input
          checked={isChecked(choice.id, props.answer)}
          id={choice.id}
          name={props.item.id}
          type={props.item.multiple ? 'checkbox': 'radio'}
          onChange={e => props.onChange(select(props.item.multiple, choice.id, props.answer, e.target.checked))}
        />
        <label
          htmlFor={choice.id}>{choice.data}
        </label>
      </div>
    )}
  </div>

ChoicePlayer.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    choices: T.arrayOf(T.shape({
      id: T.string.isRequired,
      data: T.string.isRequired
    })).isRequired,
    random: T.bool.isRequired,
    multiple: T.bool.isRequired
  }).isRequired,
  answer: T.arrayOf(T.string),
  onChange: T.func.isRequired
}

ChoicePlayer.defaultProps = {
  answer: []
}

function isChecked(choiceId, answers) {
  return answers.indexOf(choiceId) > -1
}

function select(multiple, choiceId, answers, isChecked) {
  if (!multiple) {
    return [choiceId]
  }

  return isChecked ? [choiceId].concat(answers): answers.filter(answer => answer !== choiceId)
}
