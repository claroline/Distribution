import React, {PropTypes as T} from 'react'

export const Radios = props =>
  <fieldset>
    {props.options.map(option =>
      <div className="radio" key={option.value}>
        <label>
          <input
            type="radio"
            name={props.groupName}
            value={option.value}
            checked={option.value === props.checkedValue}
            onChange={() => props.onChange(option.value)}
          />
          {option.label}
        </label>
      </div>
    )}
  </fieldset>

Radios.propTypes = {
  groupName: T.string.isRequired,
  options: T.arrayOf(T.shape({
    value: T.string.isRequired,
    label: T.string.isRequired
  })).isRequired,
  checkedValue: T.string.isRequired,
  onChange: T.func.isRequired
}
