import cloneDeep from 'lodash/cloneDeep'
import find from 'lodash/find'

const flattenItems = (items, key) => {
  return items.reduce((flattened, item) => {
    flattened.push(item)
    if (Array.isArray(item[key])) {
      flattened = flattened.concat(flattenItems(item[key], key))
    }
    return flattened
  }, [])
}

const updatePropInTree = (items, key, property, value) => {
  items.forEach(item => {
    if (item['id'] === key) {
      item[property] = value
    } else if (Array.isArray(item['children'])) {
      updatePropInTree(item['children'], key, property, value)
    }
  })
}

export const findInTree = (tree, id, childrenProperty = 'children', idProperty = 'id') => {
  return find(flattenItems(Array.isArray(tree) ? tree : [tree], childrenProperty), [idProperty, id])
}

export const updateInTree = (tree, idProperty, id, property, value) => {
  const copy = cloneDeep(tree)
  updatePropInTree(Array.isArray(copy) ? copy : [copy], idProperty, id, property, value)

  return copy
}

export const buildDataPart = path => {
  let dataPart = ''
  if (!Array.isArray(path) || path.length === 0) {
    return dataPart
  }
  for (let part of path) {
    dataPart += `${dataPart.length !== 0 ? '.' : ''}children[${part - 1}]`
  }
  
  return dataPart
}