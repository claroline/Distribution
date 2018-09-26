import {trans} from '#/main/core/translation'

export default {
  title: 'Discover the home editor',
  description: 'We will walk through the base home feature.',
  difficulty: 'easy',

  scenario: [
    // Intro
    {
      content: {
        title: trans('home.editor.title', {}, 'walkthrough'),
        message: trans('home.editor.general', {}, 'walkthrough')
      }
    },
    // Tabs
    {
      highlight: ['.tool-nav'],
      content: {
        message: trans('home.editor.tabs', {}, 'walkthrough')
      },
      position: {
        target: '.tool-nav',
        placement: 'bottom'
      }
    },
    // Create a new tab
    {
      highlight: ['.tool-nav .nav-add-tab'],
      content: {
        icon: 'fa fa-plus',
        message: trans('home.editor.add_tab', {}, 'walkthrough')
      },
      position: {
        target: '.tool-nav .nav-add-tab',
        placement: 'bottom'
      },
      requiredInteraction: {
        type: 'click',
        target: '.tool-nav .nav-add-tab',
        message: 'Click the button to create a new tab'
      }
    },
    // New tab intro
    {
      highlight: ['.home-tool > .page-header'], // strict selector to avoid impacting widgets which embed pages (eg. resource).
      content: {
        message: trans('home.editor.created_tab', {}, 'walkthrough')
      },
      position: {
        target: '.home-tool > .page-header',
        placement: 'bottom'
      }
    },
    // Tab form
    {
      highlight: [
        '.form-primary-section',
        '.form-sections'
      ],
      content: {
        message: trans('home.editor.tab_form', {}, 'walkthrough')
      },
      position: {
        target: '.data-form',
        placement: 'top'
      }
    },
    // Tab sections
    {
      highlight: ['.widgets-grid'],
      content: {
        message: trans('home.editor.tab_sections', {}, 'walkthrough')
      },
      position: {
        target: '.widgets-grid',
        placement: 'top'
      }
    },
    // Create a new tab section
    {
      highlight: ['.btn-add-section'],
      content: {
        message: trans('home.editor.add_section', {}, 'walkthrough')
      },
      position: {
        target: '.btn-add-section',
        placement: 'top'
      },
      requiredInteraction: {
        type: 'click',
        target: '.btn-add-section',
        message: 'Click the button to create a new section.'
      }
    },
    // Section layout
    {
      highlight: ['.home-section-layout'],
      content: {
        message: trans('home.editor.section_layout', {}, 'walkthrough')
      },
      position: {
        target: '.home-section-layout',
        placement: 'top'
      }
    },
    // Select section layout
    {
      highlight: ['#layout-cols-1-1-1'],
      content: {
        message: trans('home.editor.section_select_layout', {}, 'walkthrough')
      },
      position: {
        target: '#layout-cols-1-1-1',
        placement: 'top'
      },
      requiredInteraction: {
        type: 'click',
        target: '#layout-cols-1-1-1',
        message: 'Click the button to select the 3 columns layout.'
      }
    },
    // Configure section
    {
      highlight: ['.widget-section-form'],
      content: {
        message: trans('home.editor.section_configure', {}, 'walkthrough')
      },
      position: {
        target: '.widget-section-form',
        placement: 'top'
      }
    },
    // Save modifications
    {
      highlight: ['#widget-section-form-save'],
      content: {
        message: trans('home.editor.section_save', {}, 'walkthrough')
      },
      position: {
        target: '#widget-section-form-save',
        placement: 'top'
      }
    }
  ]
}
