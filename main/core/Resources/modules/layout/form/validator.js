import get from 'lodash/get'

import {chain, setIfError, notBlank, validateIf} from '#/main/core/validation'
import {getTypeOrDefault} from '#/main/core/layout/data/index'

/**
 * Validates a value based on a definition object.
 *
 * @param {object} propDef   - the data definition (@see prop-types/DataFormProperty.propTypes).
 * @param {mixed}  propValue - the value to validate.
 *
 * @return {mixed} - the errors thrown.
 */
function validateProp(propDef, propValue) {
  const errors = {}

  // get corresponding type
  const propType = getTypeOrDefault(propDef.type)

  return setIfError(errors, propDef.name, chain(propValue, propDef.options || {}, [
    // checks if not empty when field is required
    validateIf(propDef.required, notBlank), // todo : there will be problems with html/objects/arrays
    // execute data type validators if any
    validateIf(propType.validate, propType.validate),
    // execute form instance validators if any
    validateIf(propDef.validate, propDef.validate)
  ]))
}

/**
 * Validates data based on a definition.
 *
 * @param {object} definition
 * @param {object} data
 *
 * @return {object}
 */
function validateDefinition(definition, data) {
  let errors = {}

  // flatten sections fields
  let formProps = []
  definition.sections.map(section => {
    formProps = formProps.concat(section.fields)
    if (section.advanced && section.advanced.fields) {
      formProps = formProps.concat(section.fields)
    }
  })

  // validate fields
  formProps.map(formProp => {
    errors = merge(errors, validateProp(formProp, get(data, formProp.name)))
  })

  return errors
}

export {
  validateDefinition,
  validateProp
}
