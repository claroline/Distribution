
 class DashboardsCtrl {
  /**
   * Constructor.
   * @param {object}           user
   * @param {object}           dashboards
   */
   constructor(user, dashboards) {
     this.user = user
     this.dashboards = dashboards
     console.log(this.dashboards)
   }
}


 export default DashboardsCtrl
