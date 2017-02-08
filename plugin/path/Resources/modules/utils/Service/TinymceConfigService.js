/**
 * TinyMCE config
 */

import clarolineTinymce from 'claroline/tinymce'

export default function tinymceConfig() {
  // Initialize TinyMCE
  var config = clarolineTinymce.getConfiguration()
  config.trusted = true
  config.format = 'html'

  // Avoid having the "leave this page" confirmation everytime page is loaded
  //https://www.tinymce.com/docs/plugins/autosave/#autosave_ask_before_unload
  config.autosave_ask_before_unload = false
  config.setup = () => {
  }

  return config
}
