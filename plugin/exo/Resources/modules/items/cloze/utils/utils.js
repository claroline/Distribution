export const utils = {}

utils.setEditorHtml = (text, solutions) => {
  solutions.forEach(solution => {
    const regex = new RegExp(`(\\[\\[${solution.holeId}\\]\\])`, 'gi')
    text = text.replace(regex, '[[ça a changé ici]]')
  })

  return text
}
