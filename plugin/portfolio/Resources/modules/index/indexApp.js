import 'angular'
import Controller from './indexController'
import Directive from './indexDirective'

import '../comments/commentsApp'
import '../widget/widgetsApp'
import '../statistics/statisticsApp'
import '../widget/widgetsApp'
import '../utils/Array'

/* global angular */

var indexApp = angular.module('indexApp', ['commentsApp', 'widgetsApp', 'statisticsApp'])
indexApp.value('assetPath', window.assetPath)
indexApp.controller('indexController', ['$scope', 'widgetManager', 'assetPath', Controller])
indexApp.directive('indexContainer', Directive)
