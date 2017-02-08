import home from '#/main/core/_old/home/home'
import tinymce from 'tinymce/tinymce'
import 'tinymce-codemirror/plugins/codemirror/plugin.min'

tinymce.PluginManager.requireLangPack('codemirror')
tinymce.PluginManager.add('codemirror', function (editor) {
  function showSourceEditor () {
    // Insert caret marker
    editor.focus()
    editor.selection.collapse(true)
    editor.selection.setContent('<span class="CmCaReT" style="display:none">&#0;</span>')

    // Open editor window
    var win = editor.windowManager.open({
      title: 'HTML source code',
      url: home.asset + 'packages/tinymce-codemirror/plugins/codemirror/source.html',
      width: 800,
      height: 550,
      resizable: true,
      maximizable: true,
      buttons: [
        { text: 'Ok', subtype: 'primary', onclick: function () {
          var doc = document.querySelectorAll('.mce-container-body>iframe')[0]
          doc.contentWindow.submit()
          win.close()
        }},
        { text: 'Cancel', onclick: 'close' }
      ]
    })
  }

  // Add a button to the button bar
  editor.addButton('code', {
    title: 'Source code',
    icon: 'code',
    onclick: showSourceEditor
  })

  // Add a menu item to the tools menu
  editor.addMenuItem('code', {
    icon: 'code',
    text: 'Source code',
    context: 'tools',
    onclick: showSourceEditor
  })
})
