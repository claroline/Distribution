import angular from 'angular'

import 'angular-ui-translation'
import CountryDirective from './CountryDirective'

angular.module('FieldCountry', ['ui.translation']).directive('formCountry', () => new CountryDirective)
