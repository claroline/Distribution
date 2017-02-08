import angular from 'angular'
import {generateUrl} from './index'

angular.module('ui.fos-js-router', [])
  .filter('path', () => generateUrl)
  .service('url', () => generateUrl)
