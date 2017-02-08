import angular from 'angular'
import 'angular-ui-translation'

import '#/main/core/fos-js-router/module'
import ViewPdfDirective from './Directive/ViewPdfDirective'

angular
  .module('PdfViewer', [
    'ui.translation',
    'ui.fos-js-router'
  ])
  .directive('pdfViewer', () => new ViewPdfDirective)
