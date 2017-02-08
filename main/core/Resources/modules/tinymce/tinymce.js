import $ from 'jquery'
import _ from 'lodash'
import home from '../_old/home/home'
import Configuration from '#/main/core/library/Configuration/Configuration'

import 'tinymce/skins/lightgray/content.min.css'
import 'tinymce/skins/lightgray/skin.min.css'

import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'

// Plugins
import 'tinymce/plugins/paste/plugin'
import 'tinymce/plugins/link/plugin'
import 'tinymce/plugins/autoresize/plugin'
import 'tinymce/plugins/table/plugin'
import 'tinymce/plugins/directionality/plugin'
import 'tinymce/plugins/template/plugin'
import 'tinymce/plugins/textcolor/plugin'
import 'tinymce/plugins/visualchars/plugin'
import 'tinymce/plugins/fullscreen/plugin'
import 'tinymce/plugins/insertdatetime/plugin'
import 'tinymce/plugins/media/plugin'
import 'tinymce/plugins/preview/plugin'
import 'tinymce/plugins/hr/plugin'
import 'tinymce/plugins/anchor/plugin'
import 'tinymce/plugins/pagebreak/plugin'
import 'tinymce/plugins/searchreplace/plugin'
import 'tinymce/plugins/wordcount/plugin'
import 'tinymce/plugins/advlist/plugin'
import 'tinymce/plugins/autolink/plugin'
import 'tinymce/plugins/lists/plugin'
import 'tinymce/plugins/image/plugin'
import 'tinymce/plugins/charmap/plugin'
import 'tinymce/plugins/print/plugin'
import 'tinymce/plugins/visualblocks/plugin'
import 'tinymce/plugins/nonbreaking/plugin'
import 'tinymce/plugins/save/plugin'
import 'tinymce/plugins/emoticons/plugin'
import 'tinymce/plugins/code/plugin'

var translator = window.Translator

/**
 * Claroline TinyMCE parameters and methods.
 */
var clarolineTinymce = {
  'disableBeforeUnload': false,
  'domChange': null
}

/**
 * This method fix the height of TinyMCE after modify it,
 * this is usefull when change manually something in the editor.
 *
 * @param editor A TinyMCE editor object.
 */
clarolineTinymce.editorChange = function (editor) {
  setTimeout(function () {
    var container = $(editor.getContainer()).find('iframe').first()
    var height = container.contents().height()
    var max = 'autoresize_max_height'
    var min = 'autoresize_min_height'
    var configuration = clarolineTinymce.getConfiguration()

    switch (true) {
      case (height <= configuration[min]):
        container.css('height', configuration[min])
        break
      case (height >= configuration[max]):
        container.css('height', configuration[max])
        container.css('overflow', 'scroll')
        break
      default:
        container.css('height', height)
    }
  }, 500)
}

/**
 * This method if fired when paste in a TinyMCE editor.
 *
 *  @param plugin TinyMCE paste plugin object.
 *  @param args TinyMCE paste plugin arguments.
 *
 */
clarolineTinymce.paste = function (plugin, args) {
  if ($('#platform-configuration').attr('data-enable-opengraph') === '1') {
    var link = $('<div>' + args.content + '</div>').text().trim() // inside div because a bug of jquery

    home.canGenerateContent(link, function (data) {
      tinymce.activeEditor.insertContent('<div>' + data + '</div>')
      clarolineTinymce.editorChange(tinymce.activeEditor)
    })
  }
}

/**
 * Check if a TinyMCE editor has change.
 *
 * @return boolean.
 *
 */
clarolineTinymce.checkBeforeUnload = function () {
  if (!clarolineTinymce.disableBeforeUnload) {
    for (var id in tinymce.editors) {
      if (tinymce.editors.hasOwnProperty(id) &&
        tinymce.editors[id].isBeforeUnloadActive &&
        tinymce.editors[id].getContent() !== '' &&
        $(tinymce.editors[id].getElement()).data('saved')
      ) {
        return true
      }
    }
  }

  return false
}

/**
 * Set the edition detection parameter for a TinyMCE editor.
 *
 * @param editor A TinyMCE editor object.
 *
 */
clarolineTinymce.setBeforeUnloadActive = function (editor) {
  if ($(editor.getElement()).data('before-unload') !== 'off') {
    editor.isBeforeUnloadActive = true
  } else {
    editor.isBeforeUnloadActive = false
  }
}

/**
 * Add or remove fullscreen class name in a modal containing a TinyMCE editor.
 *
 * @param editor A TinyMCE editor object.
 *
 */
clarolineTinymce.toggleFullscreen = function (element) {
  $(element).parents('.modal').first().toggleClass('fullscreen')
}

/**
 * Setup configuration of TinyMCE editor.
 *
 * @param editor A TinyMCE editor object.
 *
 */
clarolineTinymce.setup = function (editor) {
  editor.on('change', function () {
    if (editor.getElement()) {
      editor.getElement().value = editor.getContent()
      if (editor.isBeforeUnloadActive) {
        $(editor.getElement()).data('saved', 'false')
        clarolineTinymce.disableBeforeUnload = false
      }
    }
  }).on('LoadContent', function () {
    clarolineTinymce.editorChange(editor)
    clarolineTinymce.customInit(editor)
  })

  editor.on('BeforeRenderUI', function () {
    editor.theme.panel.find('toolbar').slice(1).hide()
  })

  // Add a button that toggles toolbar 1+ on/off
  editor.addButton('displayAllButtons', {
    'icon': 'none fa fa-chevron-down',
    'classes': 'widget btn',
    'tooltip': translator.trans('tinymce_all_buttons', {}, 'platform'),
    onclick: function () {
      if (!this.active()) {
        this.active(true)
        editor.theme.panel.find('toolbar').slice(1).show()
      } else {
        this.active(false)
        editor.theme.panel.find('toolbar').slice(1).hide()
      }
    }
  })

  clarolineTinymce.setBeforeUnloadActive(editor)

  $('body').bind('ajaxComplete', function () {
    setTimeout(function () {
      if (editor.getElement() && editor.getElement().value === '') {
        editor.setContent('')
      }
    }, 200)
  })
}

/**
 * Configuration and parameters of a TinyMCE editor.
 */
clarolineTinymce.customInit = function (editor) {
  $.each(clarolineTinymce.init, function (key, func) {
    func(editor)
  })
}

clarolineTinymce.getConfiguration = function () {
  // Get theme to load inside tinymce in order to have no display differences
  var homeTheme = document.getElementById('homeTheme')
  var themeCSS = homeTheme.innerText || homeTheme.textContent

  var configuration = {
    'paste_data_images': true,
    'relative_urls': false,
    'remove_script_host': false,
    'theme': 'modern',
    'browser_spellcheck': true,
    'autoresize_min_height': 100,
    'autoresize_max_height': 500,
    'content_css': [
      themeCSS,
      home.asset + 'bundles/clarolinecore/css/common/tinymce.css',
      home.asset + 'packages/font-awesome/css/font-awesome.min.css'
    ],
    'language_url': home.asset + 'dist/tinymce/langs/' + home.locale.trim() + '.js',
    //css is loaded via imports
    skin: false,
    'toolbar2': 'styleselect | undo redo | forecolor backcolor | bullist numlist | outdent indent | ' +
        'media link charmap | print preview code',
    'extended_valid_elements': 'user[id], a[data-toggle|data-parent]'
  }

  var plugins = [
    'autoresize advlist autolink lists link image charmap print preview hr anchor pagebreak',
    'searchreplace wordcount visualblocks visualchars fullscreen',
    'insertdatetime media nonbreaking save table directionality',
    'template paste textcolor emoticons code'
  ]

  var toolbar1 = 'bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | fullscreen displayAllButtons'
  const tinyPlugins = Configuration.getTinyMcePlugins()

  $.each(tinyPlugins, function (key, value) {
    plugins.push(value.name)
    toolbar1 += ' ' + value.name

    if (value.config) {
      configuration = _.merge(configuration, value.config)
    }

    if (value.plugin) {
      plugins.push(value.plugin)
    }
  })

  configuration.plugins = plugins
  configuration.toolbar1 = toolbar1

  return configuration
}

/**
 * Initialization function for TinyMCE editors.
 */
clarolineTinymce.initialization = function () {
  let config = clarolineTinymce.getConfiguration()
  config.paste_preprocess = clarolineTinymce.paste
  config.setup = clarolineTinymce.setup
  config.selector = '.claroline-tiny-mce'
  tinymce.init(config)
}

window.ClarolineTinymce = clarolineTinymce

export default clarolineTinymce
