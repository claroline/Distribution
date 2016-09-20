
 class DashboardsCtrl {
  /**
   * Constructor.
   * @param {object}           user
   * @param {object}           dashboards
   */
   constructor(user, dashboards, DashboardService) {
     this.user = user
     this.dashboards = dashboards
     this.DashboardService = DashboardService
   }

   delete(id){
     let promise = this.DashboardService.delete(id)
     promise.then(function(response){
       this.dashboards = response
     }.bind(this))
   }
}


 export default DashboardsCtrl
