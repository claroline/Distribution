
 class DashboardCtrl {
  /**
   * Constructor.
   * @param {object}           user
   * @param {object}           dashboards
   */
   constructor(Translator, WorkspaceService, DashboardService, user, dashboard) {
     this.WorkspaceService = WorkspaceService
     this.Translator = Translator
     this.DashboardService = DashboardService
     this.user = user
     this.dashboard = dashboard
     let promise = this.DashboardService.getDashboardData(dashboard.id)
     promise.then(function(response){
       console.log(response)
     })

     console.log(this.dashboard)
   }
}


 export default DashboardCtrl
