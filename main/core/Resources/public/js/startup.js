/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/* Global Translator */

(function () {
    'use strict';

    var env = $('#sf-environement').attr('data-env');
    var stackedRequests = 0;
    var modal = window.Claroline.Modal;
    var translator = window.Translator;

    var ajaxServerErrorHandler = function (statusCode, responseText) {
        if (env !== 'prod') {
            var w = window.open();
            $(w.document.body).html(responseText);
        } else {
            modal.confirmContainer(translator.trans('error', {}, 'platform'), responseText);
        }
    };

    var ajaxAuthenticationErrorHandler = function (form) {
        modal.create(form).on('submit', '#login-form', function (e) {
            var $this = $(e.currentTarget);
            var inputs = {};
            e.preventDefault();

            // Send all form's inputs
            $.each($this.find('input'), function (i, item) {
                var $item = $(item);
                inputs[$item.attr('name')] = $item.val();
            });

            $.ajax({
                type: 'POST',
                url: e.currentTarget.action,
                cache: false,
                data: inputs,
                success: function (data) {
                    if (data.has_error) {
                        $('.form-group', $this).addClass('has-error');
                    } else {
                        window.location.reload();
                    }
                }
            });
        });
    };

    $(document).bind('ajaxSend', function () {
        stackedRequests++;
        $('.please-wait').show();
    }).bind('ajaxComplete', function () {
        stackedRequests--;

        if (stackedRequests === 0) {
            $('.please-wait').hide();
        }
    });

    $(document).ajaxError(function (event, jqXHR) {
        if (jqXHR.status === 403 && jqXHR.getResponseHeader('XXX-Claroline') !== 'resource-error') {
            ajaxAuthenticationErrorHandler(jqXHR.responseText);
        } else if (jqXHR.status === 500 || jqXHR.status === 422 || jqXHR.status === 403) {
            ajaxServerErrorHandler(jqXHR.status, jqXHR.responseText);
        }
    });
})();
