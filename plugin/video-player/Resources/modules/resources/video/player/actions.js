import {generateUrl} from '#/main/core/api/router'

export const actions = {}

actions.download = id => window.location = generateUrl('claro_resource_download') + '?ids[]=' + id