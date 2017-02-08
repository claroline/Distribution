import 'angular'
/* global angular */
export default function(){
  return {
    config: JSON.parse(window.widgetsConfig),
    getTypes: function(excludeTitle) {
      var types = angular.copy(this.config)
      if (excludeTitle) {
        delete types.title
      }
      return types
    }
  }
}
