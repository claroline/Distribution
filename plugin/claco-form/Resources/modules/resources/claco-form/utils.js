import {fieldTypes} from './enums'
import {countries} from '#/main/core/layout/form/enums'

export const generateFieldKey = (id) => {
  return  `%field_${id}%`
}

export const getFieldType = (value) => {
  return fieldTypes.find(f => f.value === value)
}

export const getCountry = (value) => {
  return countries.find(c => c.value === value)
}