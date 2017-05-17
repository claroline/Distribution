export function findIndex(array, item) {
  return array.findIndex(el => JSON.stringify(el) === JSON.stringify(item))
}
