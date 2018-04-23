import {makeActionCreator} from '#/main/core/scaffolding/actions'


export const actions = {}

export const MESSAGE_ADD = 'MESSAGE_ADD'
export const COMMENT_ADD = 'COMMENT_ADD'

actions.createMessage = makeActionCreator(MESSAGE_ADD, 'subjectId', 'message')
actions.createComment = makeActionCreator(COMMENT_ADD, 'messageId', 'comment')

// exemple pris dans clacoform

//   const formData = new FormData()
//   formData.append('messageData', content)

// dispatch({
//   [API_REQUEST]: {
//     url: ['', {subject: subjectId}],
//     request: {
//       method: 'POST',
//       body: formData
//     },
//     success: (data, dispatch) => {
//       dispatch(actions.addSubjectMessage(subjectId, data))
//     }
//   }
// })
// }
