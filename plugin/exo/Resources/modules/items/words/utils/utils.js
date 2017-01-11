export const utils = {}

utils.split = (text, solutions, highlight = true) => {
  const split = utils.getTextElements(text, solutions).filter(el => el.found)

  //now we can reorder the array by position and split the text accordingly
  split.sort((a, b) =>  a.position - b.position)

  //now we can split the text accordingly
  //This is a big mess of wtf computations but I swear it gives the correct result !
  let currentPosition = 0
  let prevPos = 0
  let prevWordLength = 0

  split.forEach(el => {
    //we keep track of each text element
    el.text = text.substr(0, el.position + el.word.length - currentPosition)
    //now we trim the text
    text = text.substr(el.position + el.word.length - currentPosition)
    currentPosition += (el.position + el.word.length - prevPos - prevWordLength)
    prevPos = el.position
    prevWordLength = el.word.length
  })

  //now we highlight the text if required
  if (highlight) {
    split.forEach(el => {
      let regex = new RegExp('(\\b' + el.word + '\\b)', 'gi')
      let classname = el.score > 0 ? 'word-success': 'word-danger'
      let iconname = el.score > 0 ? 'fa fa-check': 'fa fa-times'
      let replacer = `<strong><span class='${classname}'>$1&nbsp<i class='${iconname}'></i></span></strong>`
      el.text = el.text.replace(regex, replacer)
    })
  }

  //I want to rember the last element of the text so I add it aswell to the array
  split.push({
    word: '#endoftext#',
    position: null,
    text,
    score: null
  })

  return split
}

utils.getTextElements = (text, solutions) => {
  const matches = solutions.map(solution => solution.text)
  const data = []

  //first we find each occurence of a given word
  matches.forEach(word => {
    let regex = new RegExp('\\b' + word + '\\b', 'gi')
    let position = text.search(regex)
    data.push({
      word,
      position,
      score: solutions.find(el => el.text === word).score,
      feedback: solutions.find(el => el.text === word).feedback,
      found: position > -1
    })
  })

  return data
}
