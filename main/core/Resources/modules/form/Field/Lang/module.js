import angular from 'angular'

import 'angular-ui-translation'
import LangDirective from './LangDirective'

angular.module('FieldLang', ['ui.translation']).directive('formLang', () => new LangDirective)
