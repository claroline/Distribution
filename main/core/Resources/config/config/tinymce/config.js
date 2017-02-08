import picker from './resource_picker_button'
import upload from './resource_upload_button'
import codemirror from './codemirror'
import Mention from './mention'
import home from '#/main/core/_old/home/home'
import 'tinymce-formula'

export default [
  {
    'name': 'resourcePicker'
  },
  {
    'name': 'fileUpload',
    'config':  {
      'picker': {
        'openResourcesInNewTab': false
      }
    }
  },
  {
    'name': 'codemirror',
    'config': {
      'codemirror': {
        'path': home.asset + 'packages/tinymce-codemirror/plugins/codemirror/codemirror-4.8'
      },
    'plugin': '-codemirror'
    }
},
  {
    'name': 'mention',
    'config': {
        'mentions': new Mention()
    },
    'plugin': '-mention'
  },
  {
    'name': 'formula',
    'config': {
      'formula': {
        'path': home.asset + 'packages/tinymce-formula'
      }
    },
    'plugin': '-formula'
  }
]
