import angular from 'angular'

import {asset} from './index'

angular
  .module('ui.asset', [])
  .filter('asset', () => asset)
