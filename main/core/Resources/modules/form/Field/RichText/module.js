import 'angular/angular.min'

import translation from 'angular-ui-translation/angular-translation'
import RichTextDirective from './RichTextDirective'
import HelpBlock from '../../HelpBlock/module'

angular.module('FieldRichText', ['ui.translation', 'HelpBlock'])
  .directive('formRichText', ['$parse', '$compile', ($parse, $compile) => new RichTextDirective($parse, $compile)])
