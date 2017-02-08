import angular from 'angular'

import 'angular-ui-translation'
import SelectDirective from './SelectDirective'
import '../../HelpBlock/module'

angular.module('FieldSelect', ['ui.translation', 'HelpBlock']).directive('formSelect', () => new SelectDirective)
