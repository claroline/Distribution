import editor from '#/main/core/tools/home/walkthroughs/editor'
import widgetList from '#/main/core/tools/home/walkthroughs/widget-list'
import widgetResource from '#/main/core/tools/home/walkthroughs/widget-resource'
import widgetSimple from '#/main/core/tools/home/walkthroughs/widget-simple'

function getWalkthroughs() {
  return [
    editor,
    widgetSimple,
    widgetList,
    widgetResource
  ]
}

export {
  getWalkthroughs
}
