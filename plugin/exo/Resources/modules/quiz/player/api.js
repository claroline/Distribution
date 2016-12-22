import {generateUrl} from './../../utils/routing'
import {normalize} from './normalizer'

// TODO : display loader on ajax call
// TODO : catch any error in the network call.

export const api = {}

api.startAttempt = (quizId) => {
  return fetch(generateUrl('exercise_attempt_start', {exerciseId: quizId}), {
    credentials: 'include',
    method: 'POST'
  })
  .then(response => response.json())
  .then(json => normalize(json))
}

api.submitAnswers = (quizId, paperId, answers) => {
  const answerRequest = []
  for (let answer in answers) {
    if (answers.hasOwnProperty(answer) && answers[answer]._touched) {
      // Answer has been modified => send it to the server
      answerRequest.push(answers[answer])
    }
  }

  if (0 !== answerRequest.length) {
    return fetch(generateUrl('exercise_attempt_submit', {exerciseId: quizId, id: paperId}), {
      credentials: 'include',
      method: 'PUT',
      body: JSON.stringify(answerRequest)
    })
  } else {
    return Promise.resolve()
  }
}

api.finishAttempt = (quizId, paperId) => {
  return fetch(generateUrl('exercise_attempt_finish', {exerciseId: quizId, id: paperId}), {
    credentials: 'include',
    method: 'PUT'
  })
  .then(response => response.json())
  .then(json => normalize(json))
}
