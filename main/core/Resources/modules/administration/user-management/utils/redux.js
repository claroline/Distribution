export function updateArray(data, index, element) {
  return data.slice(0, index).concat([element]).concat(data.slice(index + 1))
}
