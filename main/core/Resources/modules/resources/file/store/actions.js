import {API_REQUEST, url} from '#/main/app/api'

export const actions = {}

actions.changeFile = (node, file) => {
  const formData = new FormData()
  formData.append('file', file)

  return ({
    [API_REQUEST]: {
      url: ['apiv2_resource_file_change', {node: node.id}],
      type: 'upload',
      request: {
        method: 'POST',
        body: formData,
        headers: new Headers({
          //no Content type for automatic detection of boundaries.
          'X-Requested-With': 'XMLHttpRequest'
        })
      },
      success: (response, dispatch) => console.log(response)
    }
  })
}
