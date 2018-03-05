import flatten from 'lodash/flatten'
import concat from 'lodash/concat'

function dataTreeFlatten(roots) {
  return flatten(roots.map(root => flattenChildren(root)))
}

function flattenChildren(object) {
  const children = flatten(object.children.map(child => flattenChildren(child)))

  return concat([object], children)
}

export {
  dataTreeFlatten as flatten
}
