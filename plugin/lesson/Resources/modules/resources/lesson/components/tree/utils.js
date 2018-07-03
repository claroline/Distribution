import cloneDeep from 'lodash/cloneDeep'
import {trans} from '#/main/core/translation'

/**
 * Transforme l'arbre du cours provenant de l'API pour que le composant Summary puisse l'utiliser
 *
 * @param tree
 */
function normalizeTree(tree, lessonId, deleteFunction) {

  const copy = cloneDeep(tree)

  let elems = normalizeTreeNode(copy.children, lessonId, deleteFunction)
  elems.push({
    label: trans('add_chapter', {}, 'lesson'),
    target: 'new',
    icon: 'fa fa-fw fa-plus',
    type: 'link'
  })

  return {
    id: tree.id,
    slug: tree.slug,
    children: elems
  }
}

function normalizeTreeNode(node, lessonId, deleteFunction) {

  return node.map((elem) => {

    if (elem.children.length > 0) {
      normalizeTreeNode(elem.children, lessonId, deleteFunction)
    }

    elem['type'] = 'link'
    elem['target'] = `/${elem['slug']}`
    elem['label'] = elem['title']
    elem['additional'] = [
      {
        type: 'link',
        target: `/${elem['slug']}/edit`,
        label: trans('edit_chapter', {}, 'lesson'),
        icon: 'fa fa-pencil'
      },
      {
        type: 'link',
        target: `/${elem['slug']}/new`,
        icon: 'fa fa-fw fa-plus',
        label: trans('chapter_add_child', {}, 'lesson')
      },
      {
        type: 'callback',
        icon: 'fa fa-fw fa-trash-o',
        label: trans('delete'),
        callback: () => deleteFunction(lessonId, elem['slug'], elem['title'])
      }
    ]

    return elem
  })
}

export {
  normalizeTree
}
