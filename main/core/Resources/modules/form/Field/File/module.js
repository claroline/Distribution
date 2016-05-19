import 'angular/angular.min'

import translation from 'angular-ui-translation/angular-translation'
import FileDirective from './FileDirective'
import HelpBlock from '../../HelpBlock/module'

angular.module('FieldFile', ['ui.translation', 'HelpBlock'])
    .directive('formFile', ['$parse', '$compile', ($parse, $compile) => new FileDirective($parse, $compile)])
