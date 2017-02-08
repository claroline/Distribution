import $ from 'jquery'
import 'jquery-ui'
import _ from 'lodash'
import Backbone from 'backbone'

import Router from './router'
import Server from './server'

import Master from './views/master'

import Resources from './views/resources'
import Tabpanes from './views/tabpanes'
import Tabs from './views/tabs'
import Treelist from './views/treelist'
import Treenode from './views/treenode'
import Widgets from './views/widgets'

import Actions from './views/resource/actions'
import Breadcrumbs from './views/resource/breadcrumbs'
import Confirm from './views/resource/confirm'
import Filters from './views/resource/filters'
import Form from './views/resource/form'
import ListViewElement from './views/resource/listElement'
import Nodes from './views/resource/nodes'
import Rights from './views/resource/rights'
import Thumbnail from './views/resource/thumbnail'

var manager = window.ClarolineResourceManager = {}

manager.Views = {}
manager.Server = Server
manager.Router = Router
manager.Views.Resources = Resources
manager.Views.Tabpanes = Tabpanes
manager.Views.Tabs = Tabs
manager.Views.Treelist = Treelist
manager.Views.Treenode = Treenode
manager.Views.Widgets = Widgets
manager.Views.Actions = Actions
manager.Views.Breadcrumbs = Breadcrumbs
manager.Views.Confirm = Confirm
manager.Views.Filters = Filters
manager.Views.Form = Form
manager.Views.ListViewElement = ListViewElement
manager.Views.Nodes = Nodes
manager.Views.Rights = Rights
manager.Views.Thumbnail = Thumbnail

//should be the last one
manager.Views.Master = Master

var dispatcher = null
var server = null
var views = {}
var isInitialized = false
var areLogsActivated = false
var hasFetchedParameters = false
var fetchedParameters = {
  pickerDirectoryId: null,
  preFetchedDirectory: null,
  resourceTypes: null,
  webPath: null,
  language: null,
  zoom: null
}

/**
 * Creates a full manager, i.e. a plain view of desktop or workspace resources,
 * with all the utilities included (pickers, forms, etc.).
 *
 * Relevant parameters are:
 *
 * - directoryId : the id of the directory to open at initialization
 *      (defaults to "0", i.e. pseudo-root of all directories)
 * - pickerDirectoryId : the id of the directory to open in picker mode
 *      (defaults to "0", i.e. pseudo-root of all directories)
 * - preFetchedDirectory: a json representation of the first directory to open
 *      (defaults to null)
 * - isWorkspace: whether the manager is in a workspace (vs desktop) context
 *      (defaults to false)
 * - parentElement: the jquery element in which the views will be rendered
 *      (defaults to "body" element)
 * - breadcrumbElement: an existing jquery element to reuse for breadcrumbs
 *      (defaults to null)
 * - resourceTypes: an object whose properties describe the available resource types
 *      (defaults to empty object)
 * - webPath: the base url of the web directory
 *      (defaults to empty string)
 * - language: the locale to use when needed
 *      (defaults to "en")
 * - zoom: a zoom value for thumbnails
 *      (defaults to "zoom100")
 *
 * @param parameters object Parameters of the manager
 */
manager.createFullManager = function(parameters) {
  initialize()
  parameters = parameters || {}
  var mainParameters = buildParameters('main', parameters, false, true)
  var pickerParameters = buildParameters('defaultPicker', parameters, true, true)
  // set the shortcut picker parameters
  var sParameters = parameters || {}
  sParameters.isDirectorySelectionAllowed = false
  var shortcutParameters = buildParameters('shortcutPicker', sParameters, true, true)
  views['main'] = new manager.Views.Master(mainParameters, dispatcher)
  views['defaultPicker'] = new manager.Views.Master(pickerParameters, dispatcher)
  views['shortcutPicker'] = new manager.Views.Master(shortcutParameters, dispatcher)
  new Router(dispatcher, mainParameters.directoryId)

  Backbone.history.start()
}

/**
 * Creates a named picker. Relevant parameters are:
 *
 * - callback: the function to be called when nodes are selected
 *      (default to empty function)
 * - isPickerMultiSelectAllowed: whether the selection of multiple nodes should be allowed
 *      (default to false)
 * - isDirectorySelectionAllowed: can a directory be selected
 *      (default to true)
 * - typeWhiteList: an array of resource type names to accept
 *      (defaults to null, i.e. all types are accepted)
 * - typeBlackList: an array of resource type names to exclude (ignored if a white list is given)
 *      (defaults to null)
 * - restrictForOwner: a boolean. The only resources shown are those whose the current user is either
 *      the creator or a workspace manager.
 * - parentElement: the jquery element in which the views will be rendered
 *      (defaults to "body" element)
 * - directoryId : the id of the directory to open at initialization
 *      (defaults to "0", i.e. pseudo-root of all directories)
 * - preFetchedDirectory: a json representation of the first directory to open
 *      (defaults to null)
 * - resourceTypes: an object whose properties describe the available resource types
 *      (defaults to empty object)
 * - webPath: the base url of the web directory
 *      (defaults to empty string)
 * - language: the locale to use when needed
 *      (defaults to "en")
 * - zoom: a zoom value for thumbnails
 *      (defaults to "zoom100")
 * - displayMode: a string to determine the view type (default thumbnail or list)
 *      (defaults to "default")
 *
 * Note that if they're not provided, the manager will try to fetch the last six
 * parameters directly from the server before using their default values.
 *
 * @param name          string  Name of the picker
 * @param parameters    object  Parameters of the picker
 * @param open          boolean Whether the picker should be opened after creation (defaults to false)
 */
manager.createPicker = function(name, parameters, open) {
  if (manager.hasPicker(name)) {
    throw new Error('Picker name "' + name + '" is already in use')
  }

  if (['main', 'defaultPicker', 'shortcutPicker'].indexOf(name) !== -1) {
    throw new Error('Invalid picker name "' + name + '" (reserved for internal use)')
  }

  initialize()
  parameters = parameters || {}
  fetchMissingParameters(parameters, function() {
    var pickerParameters = buildParameters(name, parameters, true)
    views[name] = new manager.Views.Master(pickerParameters, dispatcher)
    open && dispatcher.trigger('open-picker-' + name)
  })
}

/**
 * Checks if a picker is registered.
 *
 * @param name  string
 * @returns boolean
 */
manager.hasPicker = function(name) {
  return views.hasOwnProperty(name) && views[name].parameters.isPickerMode
}

/**
 * Returns a manager
 *
 * @param name  string
 * @returns object
 */
manager.get = function(name) {
  return views[name]
}

/**
 * Opens or closes a picker by its name.
 *
 * @param name      string  Name of the picker
 * @param action    string  Action to execute (open|close)
 */
manager.picker = function(name, action) {
  if (!manager.hasPicker(name)) {
    throw new Error('Unknown picker "' + name + '"')
  }

  action = action === 'close' ? 'close' : 'open'
  dispatcher.trigger(action + '-picker-' + name)
}

manager.destroy = function(name) {
  delete views[name]
}

/**
 * Activates event dispatcher logging (debug utility).
 */
manager.logEvents = function() {
  if (!areLogsActivated) {
    initialize()
    var originalTrigger = dispatcher.trigger
    dispatcher.trigger = function(event, args) {
      originalTrigger.apply(dispatcher, [event, args])
    }
    areLogsActivated = true
  }
}

function initialize() {
  if (!isInitialized) {
    dispatcher = _.extend({}, Backbone.Events)
    server = new manager.Server(dispatcher)
    isInitialized = true
  }
}

function buildParameters(viewName, parameters, isPicker, isDefault) {
  var allowDirectorySelection = true
  if (parameters.isDirectorySelectionAllowed !== undefined)
    allowDirectorySelection = parameters.isDirectorySelectionAllowed
  var mergedParameters = {
    viewName: viewName,
    isPickerMode: isPicker,
    restrictForOwner: parameters.restrictForOwner || false,
    isWorkspace: parameters.isWorkspace || false,
    directoryId: resolveDirectoryId(parameters, isPicker, isDefault),
    preFetchedDirectory: parameters.preFetchedDirectory || fetchedParameters.preFetchedDirectory || null,
    parentElement: parameters.parentElement || $('body'),
    breadcrumbElement: isPicker ? null : parameters.breadcrumbElement || null,
    resourceTypes: resolveResourceTypes(parameters),
    language: parameters.language || fetchedParameters.language || 'en',
    webPath: parameters.webPath || fetchedParameters.webPath || '',
    zoom: parameters.zoom || fetchedParameters.zoom || 'zoom100',
    pickerCallback: parameters.callback || function() {},
    isPickerMultiSelectAllowed: isDefault || parameters.isPickerMultiSelectAllowed || false,
    isDirectorySelectionAllowed: allowDirectorySelection,
    currentDirectoryId: null,
    isTinyMce: parameters.isTinyMce || false,
    currentUsername: fetchedParameters.currentUsername,
    currentUserId: fetchedParameters.currentUserId,
    displayMode: parameters.displayMode || 'default',
    workspaceId: parameters.workspaceId || null
  }

  if (mergedParameters.preFetchedDirectory) {
    server.setPreFetchedDirectory(mergedParameters.preFetchedDirectory)
  }

  return mergedParameters
}

function resolveDirectoryId(parameters, isPicker, isDefault) {
  if (isPicker) {
    if (isDefault) {
      return parameters.pickerDirectoryId || '0'
    }

    return parameters.directoryId || fetchedParameters.directoryId || '0'
  }

  return parameters.directoryId || '0'
}

function resolveResourceTypes(parameters) {
  var types = parameters.resourceTypes || fetchedParameters.resourceTypes || {}

  if (parameters.typeWhiteList) {
    types = _.pick(types, parameters.typeWhiteList)
  } else if (parameters.typeBlackList) {
    types = _.omit(types, parameters.typeBlackList)
  }

  return types
}

function fetchMissingParameters(givenParameters, callback) {
  var expectedParameters = ['resourceTypes', 'webPath', 'language', 'zoom', 'directoryId']
  var hasMissingParameter = _.some(expectedParameters, function(parameter) {
    return !givenParameters.hasOwnProperty(parameter)
  })

  if (!hasMissingParameter || hasFetchedParameters) {
    callback()
  } else {
    server.fetchManagerParameters(function(data) {
      fetchedParameters.directoryId = data.pickerDirectoryId
      fetchedParameters.preFetchedDirectory = data.preFetchedDirectory
      fetchedParameters.resourceTypes = data.resourceTypes
      fetchedParameters.language = data.language
      fetchedParameters.webPath = data.webPath
      fetchedParameters.zoom = data.zoom
      fetchedParameters.currentUsername = data.currentUsername
      fetchedParameters.currentUserId = data.currentUserId
      hasFetchedParameters = true
      callback()
    })
  }
}

export default manager
