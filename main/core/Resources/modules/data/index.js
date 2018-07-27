import invariant from 'invariant'

/*import {BOOLEAN_TYPE,      booleanDefinition}     from '#/main/app/content/data/boolean'
import {CHOICE_TYPE,       choiceDefinition}      from '#/main/app/content/data/choice'
import {COLOR_TYPE,        colorDefinition}       from '#/main/app/content/data/color'
import {COUNTRY_TYPE,      countryDefinition}     from '#/main/app/content/data/country'
import {DATE_TYPE,         dateDefinition}        from '#/main/app/content/data/date'
import {DATE_RANGE_TYPE,   dateRangeDefinition}   from '#/main/app/content/data/date-range'
import {EMAIL_TYPE,        emailDefinition}       from '#/main/app/content/data/email'
import {FILE_TYPE,         fileDefinition}        from '#/main/app/content/data/file'
import {HTML_TYPE,         htmlDefinition}        from '#/main/app/content/data/html'
import {IMAGE_TYPE,        imageDefinition}       from '#/main/app/content/data/image'
import {IP_TYPE,           ipDefinition}          from '#/main/app/content/data/ip'
import {LOCALE_TYPE,       localeDefinition}      from '#/main/app/content/data/locale'
import {NUMBER_TYPE,       numberDefinition}      from '#/main/app/content/data/number'
import {PASSWORD_TYPE,     passwordDefinition}    from '#/main/app/content/data/password'
import {SCORE_TYPE,        scoreDefinition}       from '#/main/app/content/data/score'
import {STORAGE_TYPE,      storageDefinition}     from '#/main/app/content/data/storage'
import {STRING_TYPE,       stringDefinition}      from '#/main/app/content/data/string'
import {TRANSLATION_TYPE,  translationDefinition} from '#/main/app/content/data/translation'
import {TRANSLATED_TYPE,   translatedDefinition}  from '#/main/app/content/data/translated'
import {URL_TYPE,          urlDefinition}         from '#/main/app/content/data/url'
import {USERNAME_TYPE,     usernameDefinition}    from '#/main/app/content/data/username'
import {ENUM_TYPE,         enumDefinition}        from '#/main/app/content/data/enum'
import {ENUM_PLUS_TYPE,   enumPlusDefinition}    from '#/main/app/content/data/enum-plus'
import {CASCADE_ENUM_TYPE, cascadeEnumDefinition} from '#/main/app/content/data/cascade-enum'
import {CASCADE_TYPE,      cascadeDefinition}     from '#/main/app/content/data/cascade'*/


// the list of registered data types
const dataTypes = {}

// register default types
/*registerType(BOOLEAN_TYPE,      booleanDefinition)
registerType(COLOR_TYPE,        colorDefinition)
registerType(COUNTRY_TYPE,      countryDefinition)
registerType(DATE_TYPE,         dateDefinition)
registerType(DATE_RANGE_TYPE,   dateRangeDefinition)
registerType(EMAIL_TYPE,        emailDefinition)
registerType(CHOICE_TYPE,       choiceDefinition)
registerType(CASCADE_TYPE,      cascadeDefinition)
registerType(FILE_TYPE,         fileDefinition)
registerType(IMAGE_TYPE,        imageDefinition)
registerType(HTML_TYPE,         htmlDefinition)
registerType(IP_TYPE,           ipDefinition)
registerType(LOCALE_TYPE,       localeDefinition)
registerType(NUMBER_TYPE,       numberDefinition)
registerType(PASSWORD_TYPE,     passwordDefinition)
registerType(SCORE_TYPE,        scoreDefinition)
registerType(STORAGE_TYPE,      storageDefinition)
registerType(STRING_TYPE,       stringDefinition)
registerType(TRANSLATION_TYPE,  translationDefinition)
registerType(TRANSLATED_TYPE,   translatedDefinition)
registerType(URL_TYPE,          urlDefinition)
registerType(USERNAME_TYPE,     usernameDefinition)
registerType(ENUM_TYPE,         enumDefinition)
registerType(ENUM_PLUS_TYPE,   enumPlusDefinition)
registerType(CASCADE_ENUM_TYPE, cascadeEnumDefinition)*/

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

function getCreatableTypes() {
  return Object.keys(dataTypes)
    .filter(type => dataTypes[type].meta.creatable)
    .reduce((creatableTypes, type) => {
      creatableTypes[type] = dataTypes[type]

      return creatableTypes
    }, {})
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

  invariant(typeof definition.meta === 'object', 'Data type "meta" property must be a object.')
  invariant(typeof definition.meta.type === 'string', 'Data type "meta.type" property must be a string.')
  invariant(typeof definition.configure === 'function', 'Data type "configure" property must be a function.')

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
    meta: {
      creatable: false,
      noLabel: false
    },

    /**
     * The list of configuration fields for the data type.
     * It gets the current options values as param.
     *
     * @return {array}
     */
    configure: () => [],

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
    validate: () => undefined,

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
  getCreatableTypes,
  registerType
}
