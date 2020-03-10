import isEmpty from 'lodash/isEmpty'

import {chain, array, string, notBlank, unique} from '#/main/app/data/types/validators'

import {CascadeEnumInput} from '#/main/app/data/types/cascade-enum/components/input'
import {CascadeEnumGroup} from '#/main/app/data/types/cascade-enum/components/group'

// TODO : should not be a type. It's only used to configure "cascade" type in facets.

const validateChildren = (children, errors, options) => {
  let allErrors = errors

  if (children && children.length > 0) {
    children.map(child => {
      const error = chain(child.value, {}, [string, notBlank])

      if (error) {
        allErrors[child.id] = error
      }
      const grandChildren = child['children']

      if (grandChildren && grandChildren.length > 0) {
        allErrors = validateChildren(grandChildren, allErrors, options)
      }
    })

    const uniqueErrors = chain(children.map(v => v.value), {sensitive: options['caseSensitive']}, [unique])

    if (uniqueErrors) {
      const valueIds = children.map(v => v.id)
      Object.keys(uniqueErrors).forEach(key => {
        if (valueIds[key] && !allErrors[valueIds[key]]) {
          allErrors[valueIds[key]] = uniqueErrors[key]
        }
      })
    }
  }

  return allErrors
}

const dataType = {
  name: 'cascade-enum',
  validate: (value, options) => chain(value, options, [array, (value) => {
    if (value) {
      let errors = {}

      value.map(item => {
        const error = chain(item.value, {}, [string, notBlank])

        if (error) {
          errors[item.id] = error
        }
        const children = item['children']

        if (children && children.length > 0) {
          errors = validateChildren(children, errors, options)
        }
      })

      const uniqueErrors = chain(value.map(v => v.value), {sensitive: options['caseSensitive']}, [unique])

      if (uniqueErrors) {
        const valueIds = value.map(v => v.id)
        Object.keys(uniqueErrors).forEach(key => {
          if (valueIds[key] && !errors[valueIds[key]]) {
            errors[valueIds[key]] = uniqueErrors[key]
          }
        })
      }
      if (!isEmpty(errors)) {
        return errors
      }
    }
  }]),
  components: {
    group: CascadeEnumGroup,
    input: CascadeEnumInput
  }
}

export {
  dataType
}
