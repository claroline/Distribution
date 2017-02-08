import tinymce from 'tinymce/tinymce'
import pickerButtons from './resource_picker'

var translator = window.Translator

tinymce.PluginManager.add('resourcePicker',  function (editor) {
  editor.addButton('resourcePicker', {
    'icon': 'none fa fa-folder-open',
    'classes': 'widget btn',
    'tooltip': translator.trans('resources', {}, 'platform'),
    'onclick': function () {
      tinymce.activeEditor = editor
      pickerButtons.resourcePickerOpen()
    }
  })
})
