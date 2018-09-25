import {trans} from '#/main/core/translation'

export default {
  title: 'Discover the home editor',
  description: 'We will walk through the base home feature.',
  scenario: [
    // Intro
    {
      content: {
        title: trans('home.editor.title', {}, 'walkthrough'),
        message: trans('home.editor.general', {}, 'walkthrough')
      }
    },
    // Create a new tab
    {
      highlight: ['.tool-nav .nav-add-tab'],
      content: {
        message: trans('home.editor.add_tab', {}, 'walkthrough')
      },
      position: {
        target: '.tool-nav .nav-add-tab',
        placement: 'bottom'
      },
      next: {
        type: 'click',
        target: '.tool-nav .nav-add-tab'
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
      }
    }
  ]
}
