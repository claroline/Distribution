import get from 'lodash/get'

// todo : move in data module

import {chain, notEmpty, validateIf} from '#/main/core/validation'
import {getType} from '#/main/app/data/types'

/**
 * Validates a value based on a definition object.
 *
 * @param {object} propDef   - the data definition (@see prop-types/DataFormProperty.propTypes).
 * @param {*}      propValue - the value to validate.
 *
 * @return {object} - the errors thrown.
 */
function validateProp(propDef, propValue) {
  return getType(propDef.type).then(propType => {

    // memoize empty validator to avoid multiple checks which can be costly (for html)
    const empty = notEmpty(propValue)

    return Promise.resolve(chain(propValue, propDef.options || {}, [
      // checks if not empty when field is required
      validateIf(propDef.required, () => empty),
      // execute data type validator if any and value is not empty
      validateIf(!empty && propType.validate, propType.validate),
      // execute form instance validator if any value is not empty
      validateIf(!empty && propDef.validate, propDef.validate)
    ]))
  })
}

/**
 * Validates data based on a definition.
 *
 * @param {object} definition
 * @param {object} data
 *
 * @return {object}
 *
 * @todo filter hidden fields
 */
function validateDefinition(definition, data) {
  // flatten sections fields
  let formProps = []
  definition.sections.map(section => {
    formProps = formProps.concat(section.fields)
    if (section.advanced && section.advanced.fields) {
      formProps = formProps.concat(section.fields)
    }
  })

  return Promise.all(
    formProps.map(formProp => validateProp(formProp, get(data, formProp.name)))
  ).then(propErrors => propErrors.reduce((allErrors, current) => Object.assign(allErrors, current)), {})
}

export {
  validateDefinition,
  validateProp
}
