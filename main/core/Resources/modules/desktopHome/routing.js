/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import mainTemplate from './Partial/main.html'

export default function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state ('main', {
      url: '/main',
      template: mainTemplate,
      controller: 'DesktopHomeMainCtrl',
      controllerAs: 'dhmc'
    })

  $urlRouterProvider.otherwise('/main')
}
