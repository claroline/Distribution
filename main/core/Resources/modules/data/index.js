import invariant from 'invariant'

import {BOOLEAN_TYPE,  booleanDefinition}  from '#/main/core/data/types/boolean/index'
import {COLOR_TYPE,    colorDefinition}    from '#/main/core/data/types/color'
import {DATE_TYPE,     dateDefinition}     from '#/main/core/data/types/date/index'
import {DATETIME_TYPE, datetimeDefinition} from '#/main/core/data/types/datetime'
import {EMAIL_TYPE,    emailDefinition}    from '#/main/core/data/types/email'
import {ENUM_TYPE,     enumDefinition}     from '#/main/core/data/types/enum'
import {HTML_TYPE,     htmlDefinition}     from '#/main/core/data/types/html'
import {IP_TYPE,       ipDefinition}       from '#/main/core/data/types/ip'
import {NUMBER_TYPE,   numberDefinition}   from '#/main/core/data/types/number'
import {PASSWORD_TYPE, passwordDefinition} from '#/main/core/data/types/password'
import {STRING_TYPE,   stringDefinition}   from '#/main/core/data/types/string'
import {USERNAME_TYPE, usernameDefinition} from '#/main/core/data/types/username'

// todo do not register it here
import {LOCALE_TYPE,   localeDefinition}   from '#/main/core/data/types/locale'

// the list of registered data types
const dataTypes = {}

// register default types
registerType(BOOLEAN_TYPE,  booleanDefinition)
registerType(COLOR_TYPE,    colorDefinition)
registerType(DATE_TYPE,     dateDefinition)
registerType(DATETIME_TYPE, datetimeDefinition)
registerType(EMAIL_TYPE,    emailDefinition)
registerType(ENUM_TYPE,     enumDefinition)
registerType(HTML_TYPE,     htmlDefinition)
registerType(IP_TYPE,       ipDefinition)
registerType(NUMBER_TYPE,   numberDefinition)
registerType(PASSWORD_TYPE, passwordDefinition)
registerType(STRING_TYPE,   stringDefinition)
registerType(USERNAME_TYPE, usernameDefinition)

registerType(LOCALE_TYPE,   localeDefinition)

/**
 * Validates & registers a data type.
 *
 * @param {string} typeName
 * @param {Object} typeDefinition
 */
function registerType(typeName, typeDefinition) {
  invariant(typeof typeName === 'string', `Data type name must be a string. "${typeName}" provided.`)
  invariant(!dataTypes[typeName],         `Data type ${typeName} is already registered.`)

  const definition = setDefinitionDefaults(typeDefinition)
  validateDefinition(definition)

  // register the new type
  dataTypes[typeName] = definition
}

/**
 * Gets the list of registered data types.
 *
 * @returns {Object}
 */
function getTypes() {
  return dataTypes
}

/**
 * Gets a registered data type by its name.
 *
 * @param typeName
 *
 * @returns {Object}
 */
function getType(typeName) {
  invariant(dataTypes[typeName], `Data type "${typeName}" is not registered.`)

  return dataTypes[typeName]
}

/**
 * Gets the default data type.
 *
 * @returns {Object}
 */
function getDefaultType() {
  return dataTypes[STRING_TYPE]
}

/**
 * Tries to get a type by its name and return the default one if not found.
 *
 * @param {string} typeName
 *
 * @returns {Object}
 */
function getTypeOrDefault(typeName) {
  try {
    return getType(typeName)
  } catch (e) {
    return getDefaultType()
  }
}

/**
 * Validates a data type definition.
 *
 * @param definition
 */
function validateDefinition(definition) {
  invariant(typeof definition === 'object', 'Data type definition must be an object.')

  invariant(typeof definition.parse === 'function',    'Data type "parse" property must be a function.')
  invariant(typeof definition.render === 'function',   'Data type "render" property must be a function.')
  invariant(typeof definition.validate === 'function', 'Data type "validate" property must be a function.')

  if (definition.components) {
    invariant(typeof definition.components === 'object', 'Data type "components" property must be a object.')
  }
}

/**
 * Sets default values in a data type definition.
 * NB : this method does not mutate the original definition object.
 *
 * @param {object} definition
 *
 * @returns {object}
 */
function setDefinitionDefaults(definition) {
  return Object.assign({
    /**
     * Parses a value.
     *
     * @param value
     */
    parse: (value) => value,

    /**
     * Displays a value for the data type.
     *
     * @param raw
     */
    render: (raw) => raw,

    /**
     * Validates a value provided for the data type.
     */
    validate: () => true,

    /**
     * Custom components for the data type.
     *
     * Keys :
     *   - search
     *   - form
     *   - table
     */
    components: {}
  }, definition)
}

export {
  getDefaultType,
  getType,
  getTypeOrDefault,
  getTypes,
  registerType
}
