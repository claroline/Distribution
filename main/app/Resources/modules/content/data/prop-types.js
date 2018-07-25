import {PropTypes as T} from 'prop-types'

/**
 * Describe the structure of a data type definition.
 */
const DataType = {
  /**
   * Information about the data type.
   */
  propTypes: {
    meta: {
      creatable: T.bool,
      type: T.string.isRequired,
      icon: T.string,
      label: T.string,
      description: T.string,
      noLabel: T.bool
    },

    /**
     * The list of configuration fields for the data type.
     * It gets the current options values as param.
     *
     * NB. It's only used to generated configuration form for `creatable` data types.
     *
     * @return {array}
     */
    configure: T.func,

    /**
     * Parses a value.
     *
     * @param value
     *
     * @return {*} - the parsed value
     */
    parse: T.func,

    /**
     * Displays a value for the data type.
     *
     * @param raw
     *
     * @return {*} - the rendered value
     */
    render: T.func,

    /**
     * Validates a value provided for the data type.
     */
    validate: T.func,

    /**
     * Custom components for the data type.
     *
     * Keys :
     *   - search
     *   - form
     *   - table
     *   - details
     */
    components: T.shape({
      details: T.element, // todo : rename into `display`
      form: T.element, // todo : rename into `input` + `group`
      search: T.element, // todo : rename into `filter`
      table: T.element // todo : rename into `cell`
    })
  },
  defaultProps: {
    meta: {
      creatable: false,
      noLabel: false
    },
    configure: () => [],
    parse: (value) => value,
    render: (raw) => raw,
    validate: () => undefined,
    components: {}
  }
}

export {
  DataType
}
