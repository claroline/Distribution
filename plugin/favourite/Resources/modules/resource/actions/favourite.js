import {trans} from '#/main/app/intl/translation'
import {ASYNC_BUTTON} from '#/main/app/buttons'

export default (resourceNodes, nodesRefresher, path, currentUser) => ({ // todo collection
  name: 'favourite',
  type: ASYNC_BUTTON,
  icon: 'fa fa-fw fa-star-o',
  label: trans('add-favourite', {}, 'actions'),
  displayed: !!currentUser,
  request: {
    url: ['hevinci_favourite_toggle', {ids: resourceNodes.map(node => node.id)}],
    request: {
      method: 'PUT'
    }
  }
})
