/**
 * User Progression Service
 */
(function () {
    'use strict';

    angular.module('UserProgressionModule').factory('UserProgressionService', [
        '$http',
        '$q',
        'AlertService',
        function UserProgressionService($http, $q, AlertService) {
            /**
             * Progression of the current User
             * @type {object}
             */
            var progression = {};

            return {
                /**
                 * Get User progression for the current Path
                 * @returns {Object}
                 */
                get: function get() {
                    return progression;
                },

                /**
                 * Set User progression for the current Path
                 * @param value
                 */
                set: function set(value) {
                    progression = value;
                },

                /**
                 * Get the User progression for the specified Step
                 * @param step
                 * @returns {Object|null}
                 */
                getForStep : function getForStep(step) {
                    var stepProgression = null;
                    if (angular.isObject(progression) && angular.isObject(progression[step.resourceId])) {
                        stepProgression = progression[step.resourceId];
                    }

                    return stepProgression;
                },

                /**
                 * Create a new Progression for the Step
                 * @param step
                 * @param authorized
                 * @param [status]
                 * @returns {object}
                 */
                create: function create(step, status, authorized) {
                    var deferred = $q.defer();

                    var params = { id: step.resourceId };
                    if (typeof authorized !== 'undefined' && null !== authorized) {
                        params.authorized = authorized;
                    }
                    if (typeof status !== 'undefined' && null !== status && status.length !== 0) {
                        params.status = status;
                    }
                    $http
                        .post(Routing.generate('innova_path_progression_create', params))

                        .success(function (response) {
                            // Store step progression in the Path progression array
                            progression[response.stepId] = response;

                            deferred.resolve(response);
                        })

                        .error(function (response) {
                            AlertService.addAlert('error', Translator.trans('progression_save_error', {}, 'path_wizards'));

                            deferred.reject(response);
                        });

                    return deferred.promise;
                },

                /**
                 * Update Progression of the User for a Step
                 * @param step
                 * @param status
                 * @param authorized
                 */
                update: function update(step, status, authorized) {
                    var deferred = $q.defer();
                    $http
                        .put(Routing.generate('innova_path_progression_update', { id: step.resourceId, status: status, authorized: authorized }))

                        .success(function (response) {
                            // Store step progression in the Path progression array
                            if (!angular.isObject(progression[response.stepId])) {
                                progression[response.stepId] = response;
                            } else {
                                progression[response.stepId].status = response.status;
                                progression[response.stepId].authorized = response.authorized;
                            }
                            deferred.resolve(response.status);
                        })

                        .error(function (response) {
                            AlertService.addAlert('error', Translator.trans('progression_save_error', {}, 'path_wizards'));

                            deferred.reject(response);
                        });

                    return deferred.promise;
                },

                /**
                 * Set lock for Progression of the User for a Step (calls Controller).
                 * @param step
                 * @param lock
                 */
                setlock: function setlock(step, lock) {
                    var deferred = $q.defer();
                    $http
                        .put(Routing.generate('innova_path_progression_setlock', { id: step.resourceId, lock: lock }))
                        .success(function (response) {
                            deferred.resolve(response.status);
                        })
                        .error(function (response) {
                            AlertService.addAlert('error', Translator.trans('user_progression_setlock_error', {}, 'path_wizards'));
                            deferred.reject(response);
                        });
                    return deferred.promise;
                },

                /**
                 * call for unlock step : call Controller method that triggers log listener and notification
                 */
                callForUnlock: function callForUnlock(step) {
                    var deferred = $q.defer();
                    var params = {step:step.resourceId};
                    $http
                        .get(Routing.generate('innova_path_step_callforunlock', params))
                        //returns a propression object
                        .success(function (response) {
                            //update progression
                            if (!angular.isObject(progression[step.stepId])) {
                                progression[response.stepId] = response;
                            } else {
                                progression[response.stepId].lockedcall = response.lockedcall;
                            }
                            //display message to user that indicates the call has been sent
                            //AlertService.addAlert('success', Translator.trans('user_progression_lockedcall_sent', {}, 'path_wizards'));
                            deferred.resolve(response);
                        }.bind(this)) //to access this object method and attributes
                        .error(function (response) {
                            deferred.reject(response);
                        });
                    return deferred.promise;
                },

                setUnlock: function setUnlock(step) {
                    var deferred = $q.defer();
                    var params = {step:step.resourceId};
                    $http
                        .get(Routing.generate('innova_path_step_unlock', params))
                        .success(function (response) {
                            //update progression
                            if (!angular.isObject(progression[step.stepId])) {
                                progression[response.stepId] = response;
                            } else {
                                progression[response.stepId].lockedcall = response.lockedcall;
                            }
                            //display message to user that indicates the lock has been removed
                            AlertService.addAlert('success', Translator.trans('user_progression_unlock_sent', {}, 'path_wizards'));
                            deferred.resolve(response);
                        }.bind(this)) //to access this object method and attributes
                        .error(function (response) {
                            deferred.reject(response);
                        });
                    return deferred.promise;
                }
            }
        }
    ]);
})();
