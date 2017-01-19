import $ from 'jquery'

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
    <span class="cloze-input" data-hole-id="${solution.holeId}">
      <input
        class="hole-input"
        data-hole-id="${solution.holeId}"
        type="text"
      >
      </input>
      ${getEditButtons(solution)}
    </span>
  `
  return input
}

utils.getTextWithPlacerHoldersFromHtml = (text) =>
{
  const tmp = document.createElement('div')
  tmp.innerHTML = text

  $(tmp).find('.cloze-input').each(function () {
    let id = $(this).attr('data-hole-id')
    $(this).replaceWith(`[[${id}]]`)
  })

  return $(tmp).html()
}

function getEditButtons(solution) {
  return `
    <button
      class="edit-hole-btn"
      data-hole-id="${solution.holeId}"
    >
      edit
    </button>
    <button
      class="delete-hole-btn"
      data-hole-id="${solution.holeId}"
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
