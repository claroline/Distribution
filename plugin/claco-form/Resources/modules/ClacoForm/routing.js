/*global Translator*/

import menuTemplate from './Partial/menu.html'
import generalConfigurationTemplate from './Partial/general_configuration.html'

export default function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state ('menu', {
      url: '/menu',
      template: menuTemplate,
      controller: 'MenuCtrl',
      controllerAs: 'cfc'
    })
    .state ('general_configuration', {
      url: '/general_configuration',
      template: generalConfigurationTemplate,
      controller: 'GeneralConfigurationCtrl',
      controllerAs: 'cfc'
    })

  $urlRouterProvider.otherwise('/menu')
}
