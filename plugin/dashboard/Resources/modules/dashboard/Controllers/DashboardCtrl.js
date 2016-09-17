
 class DashboardCtrl {
  /**
   * Constructor.
   * @param {object}           user
   * @param {object}           dashboards
   */
   constructor(Translator, WorkspaceService, DashboardService, user, dashboard, data) {
     this.WorkspaceService = WorkspaceService
     this.Translator = Translator
     this.DashboardService = DashboardService
     this.user = user
     this.dashboard = dashboard
     this.data = data
     /*let promise = this.DashboardService.getDashboardData(dashboard.id)
     promise.then(function(response){
       console.log(response)
     })*/

     console.log(this.dashboard)
     console.log(this.data)
   }
}


 export default DashboardCtrl
