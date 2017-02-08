import modal from '#/main/core/_old/modal'
import home from '#/main/core/_old/home/home'
import $ from 'jquery'
import _ from 'lodash'
import tinymce from 'tinymce/tinymce'
import ResourceManager from 'claroline/resource-manager'

var clarolineTinymce = tinymce
/**
 * This method is fired when one or more resources are added to the editor
 * with a resource picker.
 *
 * @param nodes An array of resource nodes.
 *
 */
var resourcePickerCallBack = function (nodes, currentDirectoryId, isWidget) {
  if (!isWidget) {
    // if it's not a resource node...
    var nodeId = _.keys(nodes)[0]
    var mimeType = nodes[_.keys(nodes)][2] !== '' ? nodes[_.keys(nodes)][2] : 'unknown/mimetype'
    var openInNewTab = tinymce.activeEditor.getParam('picker').openResourcesInNewTab ? '1' : '0'

    $.ajax(home.path + 'resource/embed/' + nodeId + '/' + mimeType + '/' + openInNewTab)
      .done(function (data) {
        tinymce.activeEditor.insertContent(data)
        if (!tinymce.activeEditor.plugins.fullscreen.isFullscreen()) {
          clarolineTinymce.editorChange(tinymce.activeEditor)
        }
      })
      .error(function () {
        modal.error()
      })
  } else {
    var workspaceId = nodes[0].parents.workspace
    var homeTabId = nodes[0].parents.tab
    var widgetId = nodes[0].id

    var url = home.path +
      'workspaces/' + workspaceId +
      '/tab/' + homeTabId +
      '/widget/' + widgetId +
      '/embed'

    $.ajax(url)
      .done(function (data) {
        tinymce.activeEditor.insertContent(data)
        if (!tinymce.activeEditor.plugins.fullscreen.isFullscreen()) {
          clarolineTinymce.editorChange(clarolineTinymce.activeEditor)
        }
      })
      .error(function () {
        modal.error()
      })
  }
}

/**
 * Open a resource picker from a TinyMCE editor.
 */
var resourcePickerOpen = function () {
  if (!ResourceManager.hasPicker('tinyMcePicker')) {
    ResourceManager.createPicker('tinyMcePicker', {
      callback: resourcePickerCallBack,
      isTinyMce: true
    }, true)
  } else {
    ResourceManager.picker('tinyMcePicker', 'open')
  }
}

export default {
    'resourcePickerCallBack': resourcePickerCallBack,
    'resourcePickerOpen': resourcePickerOpen
}
