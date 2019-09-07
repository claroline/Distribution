import get from 'lodash/get'

import {number} from '#/main/app/intl'
import {trans} from '#/main/app/intl/translation'
import {ASYNC_BUTTON} from '#/main/app/buttons'

export default (resourceNodes, nodesRefresher, path, currentUser) => ({ // todo collection
  name: 'like',
  type: ASYNC_BUTTON,
  icon: 'fa fa-fw fa-thumbs-o-up',
  label: trans('like', {}, 'actions'),
  displayed: !!currentUser,
  subscript: 1 === resourceNodes.length ? {
    type: 'label',
    status: 'primary',
    value: number(get(resourceNodes[0], 'social.likes') || 0, true)
  } : undefined,
  request: {
    url: ['icap_socialmedia_like'],
    request: {
      method: 'POST',
      body: JSON.stringify({resourceId: resourceNodes[0].id})
    },
    success: (response) => nodesRefresher.update([response])
  }
})
