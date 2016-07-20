/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

(function () {
    'use strict';

    window.Claroline = window.Claroline || {};
    var currentSearch = $('#courses-registration-widget-datas-box').data('search');
    var currentMax = $('#courses-registration-widget-datas-box').data('max');
    var currentOrderedBy = $('#courses-registration-widget-datas-box').data('ordered-by');
    var currentOrder = $('#courses-registration-widget-datas-box').data('order');
    var widgetInstanceId = $('#courses-registration-widget-datas-box').data('widget-instance-id');
    var mode = $('#courses-registration-widget-datas-box').data('mode')
    var sessionsIdx = 'sessions_' + widgetInstanceId;
    var sessions = (typeof window[sessionsIdx] === 'undefined') ? [] : JSON.parse(window[sessionsIdx]);

    console.log(sessionsIdx);
    console.log(sessions);
    var events = [];
    //var events = [
    //  {id: 1, title: 'event 1', start: new Date(), end: new Date(), editable: false},
    //  {id: 2, title: 'event 2', start: new Date(), end: new Date(), editable: false}
    //]

    //window.Claroline = window.Claroline || {};
    //var calendar = window.Claroline.Calendar = {};
    //var calendarElement = $('#courses-widget-calendar-' + widgetInstanceId);
    
    function refreshCoursesList()
    {
        var route = mode === 'list' ?
          Routing.generate(
              'claro_cursus_courses_list_for_registration_widget',
              {
                  'widgetInstance': widgetInstanceId,
                  'search': currentSearch,
                  'max': currentMax,
                  'orderedBy': currentOrderedBy,
                  'order': currentOrder
              }
          ) :
          Routing.generate(
              'claro_cursus_courses_list_for_registration_widget_calendar',
              {'widgetInstance': widgetInstanceId, 'search': currentSearch}
          );

        $.ajax({
            url: route,
            type: 'GET',
            success: function (datas) {
                $('#courses-list').html(datas);

                if (mode === 'calendar') {
                    initializeCalendar();
                }
            }
        });
    }
    
    $('#courses-registration-widget').on('click', 'a', function (event) {
        event.preventDefault();
        var element = event.currentTarget;
        var route = $(element).attr('href');

        $.ajax({
            url: route,
            type: 'GET',
            success: function (datas) {
                $('#courses-list').html(datas);
            }
        });
    });

    $('#courses-registration-widget').on('click', '#search-course-btn', function () {
        currentSearch = $('#search-course-input').val();
        refreshCoursesList();
    });

    $('#courses-registration-widget').on('keypress', '#search-course-input', function(e) {
        
        if (e.keyCode === 13) {
            e.preventDefault();
            currentSearch = $(this).val();
            refreshCoursesList();
        }
    });

    $('#courses-registration-widget').on('click', '.session-register-btn', function () {
        var sessionId = $(this).data('session-id');

        window.Claroline.Modal.confirmRequest(
            Routing.generate(
                'claro_cursus_course_session_self_register',
                {'session': sessionId}
            ),
            removeRegistrationBtn,
            sessionId,
            Translator.trans('session_self_registration_message', {}, 'platform'),
            Translator.trans('session_registration', {}, 'platform')
        );
    });

    $('#courses-registration-widget').on('click', '.course-queue-request-btn', function () {
        var courseId = $(this).data('course-id');
        
        window.Claroline.Modal.confirmRequest(
            Routing.generate(
                'claro_cursus_course_queue_register',
                {'course': courseId}
            ),
            updateCourseQueueRequetBtn,
            courseId,
            Translator.trans('next_session_registration_request_message', {}, 'platform'),
            Translator.trans('next_session_registration_request', {}, 'platform')
        );
    });

    $('#courses-registration-widget').on('click', '.cancel-course-queue-request-btn', function () {
        var courseId = $(this).data('course-id');
        
        window.Claroline.Modal.confirmRequest(
            Routing.generate(
                'claro_cursus_course_queue_cancel',
                {'course': courseId}
            ),
            updateCourseQueueRequetCancelBtn,
            courseId,
            Translator.trans('next_session_registration_request_cancel_message', {}, 'platform'),
            Translator.trans('next_session_registration_request_cancel', {}, 'platform')
        );
    });

    $('#courses-registration-widget').on('click', '#calendar-view-button', function () {
        var route = Routing.generate(
            'claro_cursus_courses_list_for_registration_widget_calendar',
            {
                'widgetInstance': widgetInstanceId,
                'search': currentSearch,
                'max': currentMax,
                'orderedBy': currentOrderedBy,
                'order': currentOrder
            }
        );

        $.ajax({
            url: route,
            type: 'GET',
            success: function (datas) {
                $('#courses-list').html(datas);
                mode = 'calendar';
                initializeCalendar();
            }
        });
    });

    $('#courses-registration-widget').on('click', '#list-view-button', function () {
        var route = Routing.generate(
            'claro_cursus_courses_list_for_registration_widget',
            {'widgetInstance': widgetInstanceId, 'search': currentSearch}
        );

        $.ajax({
            url: route,
            type: 'GET',
            success: function (datas) {
                $('#courses-list').html(datas);
                mode = 'list';
            }
        });
    });
    
    var removeRegistrationBtn = function (event, sessionId) {
        $('#session-registration-btn-' + sessionId).empty();
        var element = '<span class="label label-success"><i class="fa fa-check"></i></span>';
        $('#session-registration-btn-' + sessionId).html(element);
    };
    
    var updateCourseQueueRequetBtn = function (event, courseId) {
        var courseQueueBtn = $('#course-queue-btn-' + courseId);
        courseQueueBtn.removeClass('course-queue-request-btn');
        courseQueueBtn.addClass('cancel-course-queue-request-btn');
        courseQueueBtn.empty();
        var element = '<span class="label label-success">' +
            Translator.trans('request_done', {}, 'platform') +
            '</span>';
        courseQueueBtn.html(element);
    };
    
    var updateCourseQueueRequetCancelBtn = function (event, courseId) {
        var courseQueueBtn = $('#course-queue-btn-' + courseId);
        courseQueueBtn.removeClass('cancel-course-queue-request-btn');
        courseQueueBtn.addClass('course-queue-request-btn');
        courseQueueBtn.empty();
        var element = '<span class="label label-info">' +
            Translator.trans('next_session_registration_request', {}, 'platform') +
            '</span>';
        courseQueueBtn.html(element);
    };

    //$('#courses-widget-calendar-' + widgetInstanceId).fullCalendar({});

    function t(key) {
        if (typeof key === 'object') {
            var transWords = [];
            for (var i = 0; i < key.length; i++) {
                transWords.push(Translator.trans(key[i], {}, 'agenda'));
            }
            return transWords;
        }
        return Translator.trans(key, {}, 'agenda');
    }

    function initializeEvents () {
      sessions.forEach(s => {
          events.push({
              id: s['id'],
              title: s['course']['title'],
              start: s['startDate'],
              end: s['endDate'],
              editable: false,
              allDay: true
          })
      })
    }

    function initializeCalendar () {
        $('#courses-widget-calendar-' + widgetInstanceId).fullCalendar({
            header: {
                left: 'prev,next, today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            columnFormat: {
                month: 'ddd',
                week: 'ddd D/M',
                day: 'dddd D/M'
            },
            buttonText: {
                prev: t('prev'),
                next: t('next'),
                prevYear: t('prevYear'),
                nextYear: t('nextYear'),
                today: t('today'),
                month: t('month_'),
                week: t('week'),
                day: t('day_')
            },
            firstDay: 1,
            monthNames: t(['month.january', 'month.february', 'month.march', 'month.april', 'month.may', 'month.june', 'month.july', 'month.august', 'month.september', 'month.october', 'month.november', 'month.december']),
            monthNamesShort: t(['month.jan', 'month.feb', 'month.mar', 'month.apr', 'month.may', 'month.ju', 'month.jul', 'month.aug', 'month.sept',  'month.oct', 'month.nov', 'month.dec']),
            dayNames: t(['day.sunday', 'day.monday', 'day.tuesday', 'day.wednesday', 'day.thursday', 'day.friday', 'day.saturday']),
            dayNamesShort: t(['day.sun', 'day.mon', 'day.tue', 'day.wed', 'day.thu', 'day.fri', 'day.sat']),
            //This is the url which will get the events from ajax the 1st time the calendar is launched
            events: events,
            axisFormat: 'HH:mm',
            timeFormat: 'H:mm',
            agenda: 'h:mm{ - h:mm}',
            allDayText: t('isAllDay'),
            lazyFetching : false,
            fixedWeekCount: false,
            eventLimit: 4,
            timezone: 'local',
            eventDrop: function () {console.log('eventDrop');},
            eventDragStart: function () {console.log('eventDragStart');},
            dayClick: function () {console.log('dayClick');},
            eventClick:  onEventClick,
            eventDestroy: function () {console.log('eventDestroy');},
            eventRender: function (event, element) {
                //event.stopPropagation();
                //event.preventDefault();
                //console.log(event)
                //console.log(element)
                console.log('eventRender');
            },
            eventResize: function () {console.log('eventResize');},
            eventResizeStart: function () {console.log('eventResizeStart');}
        });
    }

    function onEventClick(event, jsEvent)
    {
        console.log('onEventClick');
        console.log(event);
        console.log(jsEvent);
        jsEvent.stopPropagation();
        jsEvent.preventDefault();
        //var workspaceId = event.workspace_id ? event.workspace_id : 0;
        //
        //if (workspacePermissions[workspaceId] && event.editable !== false) {
        //    // If the user can edit the event
        //    var $this = $(this);
        //    // If click on the check symbol of a task, mark this task as "to do"
        //    if ($(jsEvent.target).hasClass('fa-check-square-o')) {
        //        markTaskAsToDo(event, jsEvent, $this);
        //    }
        //    // If click on the checkbox of a task, mark this task as done
        //    else if ($(jsEvent.target).hasClass('fa-square-o')) {
        //        markTaskAsDone(event, jsEvent, $this);
        //    }
        //}
    }

    initializeEvents()
    initializeCalendar();
})();