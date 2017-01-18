export const utils = {}

utils.setEditorHtml = (text, solutions) => {
  solutions.forEach(solution => {
    const regex = new RegExp(`(\\[\\[${solution.holeId}\\]\\])`, 'gi')
    text = text.replace(regex, utils.makeTinyHtml(solution))
  })

  return text
}

utils.makeTinyHtml = (solution) => {
  //if one solutions
  let input = `
    <input
      id=${solution.holeId}
      type="text"
    >
    </input>
  `
  //if many solutions

  input += getEditButtons(solution)

  return input
}

function getEditButtons(solution) {
  return `
    <button
      class="edit-hole-btn"
      id="${solution.holeId}"
    >
      edit
    </button>
    <button
      class="delete-hole-btn"
      id="${solution.holeId}"
    >
      delete
    </button>
  `
}

utils.getEditButtonsLength = () => {
  const solution = {
    guid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  }

  return utils.makeTinyHtml(solution).length
}

utils.getGuidLength = () => {
  return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.length
}

utils.replaceBetween = (text, start, end, what) => {
  return text.substring(0, start) + what + text.substring(end)
}
