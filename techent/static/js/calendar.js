var _getT = globalCalendar.locale.getTranslation;

/**
 * Namespace for calendar functionality.
 */
globalCalendar.calendar = {};
var calendar = globalCalendar.calendar;

calendar.milisecondsInSecond = 1000;
calendar.milisecondsInMinute = 60 * calendar.milisecondsInSecond;
calendar.milisecondsInHour = 60 * calendar.milisecondsInMinute;
calendar.milisecondsInDay = 24 * calendar.milisecondsInHour;
calendar.milisecondsInWeek = 7 * calendar.milisecondsInDay;

/**
 * @constructor
 * One day frame in a calendar.
 *
 * @param {Date|string|int} date calendar date, can be any value accepted by new Date() constructor
 */
calendar.Day = function (date) {
    this.startDate = new Date(date);
    this.startDate.setHours(0, 0, 0, 0);
    this.events = [];
};

calendar.Day.prototype = {
    /**
     * Adds event to the day. Checks that event has right date. Throws error instead.
     *
     * @param {event.Event} event instance to add
     */
    addEvent: function(event) {
        var timeDelta = event.startDate.getTime() - this.startDate.getTime();
        if (timeDelta >= 0 && timeDelta < calendar.milisecondsInDay) {
            this.events.push(event);
            // keep events sorted
            this.events.sort(function(event1, event2) {
                var time1 = event1.startDate.getTime();
                var time2 = event2.startDate.getTime();
                if (time1 < time2) {
                    return -1;
                }
                if (time1 > time2) {
                    return 1;
                }
                return 0;
            })
        } else {
            throw 'Event day is not the same';
        }
    },

    /**
     * @returns {jQuery} HTML representation of the day
     */
    toJQuery: function () {
        var dayCell = this._createDayCell();
        for (var i in this.events) {
            dayCell.append(this._formatEvent(this.events[i]))
        }
        return dayCell;
    },

    _createDayCell: function() {
        var dayCell = $('<td/>').addClass('site-day ui-widget-content ui-corner-all');
        var todayTime = calendar.todayStartDate().getTime();
        var dayTime = this.startDate.getTime();
        if (dayTime < todayTime) {
            dayCell.addClass('site-day-past');
        } else if (dayTime > todayTime) {
            dayCell.addClass('site-day-future');
        } else {
            dayCell.addClass('site-day-today');
        }
        var month = this.startDate.getMonth();
        if (month < 10) {
            month = '0' + month;
        }
        dayCell.append($('<div/>')
            .addClass('site-day-date')
            .text(this.startDate.getDate() + '.' + month));
        return dayCell;
    },

    _formatEvent: function (event) {
        var eventBlock = $('<div/>').addClass('site-calendar-event');
        eventBlock.append($('<span/>').addClass('site-calendar-time').text(event.formatStartTime()));
        eventBlock.append(' ');
        var link = $('<a/>').text(event.title);
        eventBlock.append(link);
        link.click(function (ev) {
            new globalCalendar.event.EventUI(event).detailsPopup();
            return false;
        });
        link.attr('href', '/events/' + event.id);
        return eventBlock;
    }
};

/**
 * @constructor
 * Represents a week within calendar.
 *
 * @param {Date} date Date of the first day of a week
 */
calendar.Week = function (date) {
    this.startDate = date;
    this.startDate.setHours(0, 0, 0, 0);
    this.days = [];
    for (var i = 0; i < 7; ++i) {
        var dayDate = new Date(this.startDate.getTime() + i * calendar.milisecondsInDay);
        this.days.push(new calendar.Day(dayDate));
    }
};

calendar.Week.prototype = {
    /**
     * Adds event to a week. Check that event date is within the week. Throws error instead.
     *
     * @param {event.Event} event instance to add
     */
    addEvent: function (event) {
        var timeDelta = event.startDate.getTime() - this.startDate.getTime();
        var dayOfWeek = Math.floor(timeDelta / (calendar.milisecondsInDay));
        if (dayOfWeek >= 0 && dayOfWeek < 7) {
            this.days[dayOfWeek].addEvent(event);
        } else {
            throw 'Event week is not the same';
        }
    },

    /**
     * @returns {jQuery} HTML representatin of a week (as HTML 'tr' element)
     */
    toJQuery: function () {
        var weekLine = $('<tr/>');
        for (var day in this.days) {
            weekLine.append(this.days[day].toJQuery());
        }
        return weekLine;
    }
};

/**
 * Generate calendar view with events. Accepts single objects with options.
 *
 * @constructor
 * @param {Object} options Set of calendar options.
 *      <ul>
 *          <li>{Date|String|integer} `date` object start date</li>
 *          <li>{integer} `weeksCount` object start date</li>
 *      </ul>
 */
calendar.Calendar = function (options) {
    this.weeks = [];
    this.weeksCount = options.weeksCount ? options.weeksCount : 5;
    this.startDate = calendar.getWeekStartDate(options.date);
    for (var i = 0; i < this.weeksCount; ++i) {
        var weekDate = new Date(this.startDate.getTime() + i * calendar.milisecondsInWeek);
        this.weeks.push(new calendar.Week(weekDate));
    }
};

calendar.Calendar.prototype = {
    /**
     * Adds event to a week. Check that event date is within the calendar frame. Throws error instead.
     *
     * @param {event.Event} event instance to add
     */
    addEvent: function (event) {
        var timeDelta = event.startDate.getTime() - this.startDate.getTime();
        var weekOfFrame = Math.floor(timeDelta / (calendar.milisecondsInWeek));
        if (weekOfFrame >= 0 && weekOfFrame < this.weeksCount) {
            this.weeks[weekOfFrame].addEvent(event);
        } else {
            throw 'Event date (' + event.startDate + ') is out of frame';
        }
    },

    /**
     * @returns {jQuery} HTML representatin of a week (as HTML 'tr' element)
     */
    toJQuery: function () {
        var table = $('<table/>').addClass('site-calendar');
        var headersLine = $('<tr/>');
        if (!globalCalendar.locale.weekStartsFromMonday) {
            headersLine.append($('<th/>').text(_getT('Sunday')));
        }
        headersLine
            .append($('<th/>').text(_getT('Monday')))
            .append($('<th/>').text(_getT('Tuesday')))
            .append($('<th/>').text(_getT('Wednesday')))
            .append($('<th/>').text(_getT('Thursday')))
            .append($('<th/>').text(_getT('Friday')))
            .append($('<th/>').text(_getT('Saturday')));
        if (globalCalendar.locale.weekStartsFromMonday) {
            headersLine.append($('<th/>').text(_getT('Sunday')));
        }
        headersLine.children().addClass('ui-widget-header ui-corner-all');
        table.append(headersLine);
        for (var week in this.weeks) {
            table.append(this.weeks[week].toJQuery());
        }
        return table;
    },

    appendTo: function(element) {
        this.toJQuery().appendTo(element);
    }
};

/**
 * Calculate week start date.
 * @param {Date|string|int} date some date within a week
 * @returns {Date} Date object pointed on weeks start
 */
calendar.getWeekStartDate = function(date) {
    var dateObj = new Date(date);
    var dayOfWeek = dateObj.getDay();
    if (globalCalendar.locale.weekStartsFromMonday) {
        if (dayOfWeek == 0) {
            dayOfWeek = 7;
        }
        dayOfWeek -= 1;
    }
    var start_m_sec = dateObj.getTime();
    start_m_sec -= dayOfWeek * calendar.milisecondsInDay;
    var startDate = new Date(start_m_sec);
    startDate.setHours(0, 0, 0, 0);
    return startDate;
};

calendar.todayStartDate = function() {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};
