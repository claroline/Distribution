import {API_REQUEST} from '#/main/app/api'

import {currentUser} from '#/main/core/user/current'

export const actions = {}

actions.createFiles = (parentId, files) => {
  const formData = new FormData()
  // formData.append('file', file)
  // formData.append('fileName', file.name)
  // formData.append('sourceType', 'uploadedfile')

  return ({
    [API_REQUEST]: {
      url: ['apiv2_resource_files_create', {parent: parentId}],
      type: 'upload',
      request: {
        method: 'POST',
        body: formData,
        headers: new Headers({
          //no Content type for automatic detection of boundaries.
          'X-Requested-With': 'XMLHttpRequest'
        })
      },
      // success: (response) => Array.isArray(response) ? onSuccess(response[0]) : onSuccess(response)
    }
  })
}
