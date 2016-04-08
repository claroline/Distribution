export default class PluginController {
	constructor($http, $uibModal) {
		this.$http 	   = $http
		this.$uibModal = $uibModal

		this.plugins = []
		$http.get(Routing.generate('api_get_plugins')).then(d => this.plugins = d.data)
	}

	onCheckboxChange(plugin) {
		plugin.is_enabled ? this.enable(plugin): this.disable(plugin)
	}

	enable(plugin) {
		this.$http.patch(Routing.generate('api_enable_plugin', {plugin: plugin.id})).then(d => {alert('done')})
	}

	disable(plugin) {
		this.$http.patch(Routing.generate('api_disable_plugin', {plugin: plugin.id})).then(d => {alert('done')})
	}

	openPluginConfiguration(plugin) {
		console.log(plugin)
		const route = Routing.generate('claro_admin_plugin_parameters', {pluginShortName: plugin.bundle_name})
		//no angular support yet so we do a simple redirect.
		window.location = route
	}
}
