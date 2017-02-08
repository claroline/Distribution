import common from '#/main/core/_old/common'
import modal from '#/main/core/_old/modal'
import $ from 'jquery'
import tinymce from 'tinymce/tinymce'
import ResourceManager from 'claroline/resource-manager'
import pickerButtons from './resource_picker'

var translator = window.Translator

/**
 * Open a directory picker from a TinyMCE editor.
 */
var directoryPickerCallBack = function (nodes) {
  for (var id in nodes) {
    var val = nodes[id][4]
    var path = nodes[id][3]
  }

  // file_form_destination
  var html = '<option value="' + val + '">' + path + '</option>'
  $('#file_form_destination').append(html)
  $('#file_form_destination').val(val)
}

/**
 * Open a resource picker from a TinyMCE editor.
 */
var directoryPickerOpen = function () {
  if (!ResourceManager.hasPicker('tinyMceDirectoryPicker')) {
    ResourceManager.createPicker('tinyMceDirectoryPicker', {
      callback: directoryPickerCallBack,
      resourceTypes: ['directory'],
      isDirectorySelectionAllowed: true,
      isPickerMultiSelectAllowed: false
    }, true)
  } else {
    ResourceManager.picker('tinyMceDirectoryPicker', 'open')
  }
}

tinymce.PluginManager.add('fileUpload', function (editor) {
  editor.addButton('fileUpload', {
    'icon': 'none fa fa-file',
    'classes': 'widget btn',
    'tooltip': translator.trans('upload', {}, 'platform'),
    'onclick': function () {
      tinymce.activeEditor = editor
      modal.fromRoute('claro_upload_modal', null, function (element) {
        element.on('click', '.resourcePicker', function () {
          pickerButtons.resourcePickerOpen()
        })
          .on('click', '.filePicker', function () {
            $('#file_form_file').click()
          })
          .on('change', '#file_form_destination', function () {
            if ($('#file_form_destination').val() === 'others') {
              directoryPickerOpen()
            }
          })
          .on('change', '#file_form_file', function () {
            common.uploadfile(
              this,
              element,
              $('#file_form_destination').val(),
              pickerButtons.resourcePickerCallBack
            )
          })
      })
    }
  })
})
