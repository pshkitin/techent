var _getT = globalCalendar.locale.getTranslation;
var _getP = globalCalendar.locale.getPlural;

/**
 * Event namespace
 */
globalCalendar.event = {};
var event = globalCalendar.event;

event.Event = function (options) {
    this.id = options.id;
    this.author = options.author;
    this.title = options.title;
    this.location = options.location;
    this.category = options.category;
    if (options instanceof Date) {
        this.startDate = options.startDate;
    } else {
        this.startDate = new Date(options.startDate);
    }
    this.duration = options.duration;
    this.fee = options.fee;
    this.address = options.address;
    this.addressRoots = options.addressRoots;
    this.description = options.description;
    this.contacts = options.contacts;
    this.email = options.email;
};

event.Event.prototype = {
    formatStartTime: function() {
        return this._formatTime(this.startDate);
    },

    formatStartDate: function () {
        var date = this.startDate;
        var dateStr = this._prependZero(date.getDate());
        var monthStr = this._prependZero(date.getMonth())
        return dateStr + '.' + monthStr + '.' + date.getFullYear();
    },

    formatStartDateFull: function () {
        return this.formatStartDate() + '&nbsp;' + this.formatStartTime();
    },

    formatEndDate: function () {
        var endDate = new Date(this.startDate.getTime() + this.duration * calendar.milisecondsInMinute);
        var endDateStr = this._formatTime(endDate);
        if (endDate.getDate() != this.startDate.getDate()) {
            endDateStr += '&nbsp;' + _getT('(next&nbsp;day)');
        }
        return endDateStr;
    },

    formatDuration: function() {
        var hours = Math.ceil(this.duration / 60);
        var minutes = this.duration % 60;
        var minutesStr = this._prependZero(minutes);
        var durationStr = '';
        if (hours > 0) {
            durationStr += hours + '&nbsp;' + _getP(hours, 'hour', 'hours');
        }
        if (minutes > 0) {
            if (durationStr.length > 0) {
                durationStr += '&nbsp;';
            }
            durationStr += minutesStr + '&nbsp;' + _getP(minutes, 'minute', 'minutes');
        }
        if (durationStr.length == 0) {
            durationStr = '0';
        }
        return durationStr;
    },

    toJSON: function () {

    },

    _formatTime: function (date) {
        var hours = date.getHours();
        var hoursStr = this._prependZero(hours);
        var minutes = date.getMinutes();
        var minutesStr = this._prependZero(minutes);
        return hoursStr + ':' + minutesStr;
    },

    _prependZero: function (value) {
        if (value < 10) {
            return '0' + value.toString();
        }
        return value.toString();
    }
};

event.EventUI = function(event) {
    this.event = event;
};

event.EventUI.prototype = {
    formatDetails: function () {
        var titleLink = $('<a/>')
            .text(this.event.title)
            .attr('href', 'events/' + this.event.id);
        var title = $('<h1/>')
            .addClass('site-event-details-header')
            .append(titleLink)
            .append('&nbsp;(' + this.event.formatStartDate() + ')');
        var author = $('<div/>')
            .addClass('site-event-details-author')
            .text(this.event.author.displayName);
        var category = $('<div/>')
            .addClass('site-event-details-category')
            .text(this.event.category.representation);
        var addressSearchLink = $('<a/>')
            .attr('href', 'http://maps.yandex.ru?text=' + this.event.address)
            .attr('target', "_blank")
            .text('Show on a map');
        var fee = $('<div/>')
            .addClass('site-event-details-fee')
            .html(this.event.fee[0] + '&nbsp;' + { RUB: 'р.', EUR: '&euro;', USD: '$'}[this.event.fee[1]]);
        var address = $('<div/>')
            .addClass('site-event-details-address')
            .append(this.event.address)
            .append($('<br/>'))
            .append(this.event.addressRoots)
            .append($('<br/>'))
            .append(addressSearchLink);
        return $('<div/>')
            .addClass('site-event-details')
            .append(title)
            .append(this._formatDate())
            .append(this._formatAddress())
            .append(author)
            .append(category)
            .append(fee);
    },

    _formatDate: function() {
        var starts = $('<span/>')
            .addClass('site-event-details-label site-event-details-label-starts')
            .text(_getT('Starts:'));
        var ends = $('<span/>')
            .addClass('site-event-details-label site-event-detailt-label-ends')
            .text(_getT('Ends:'));
        var duration = $('<span/>')
            .addClass('site-event-details-label site-event-details-label-duration')
            .text(_getT('Duration:'));
        return $('<div/>')
            .addClass('site-event-details-date')
            .append(starts)
            .append('&nbsp;' + this.event.formatStartTime() + '&nbsp;')
            .append(ends)
            .append('&nbsp;' + this.event.formatEndDate() + '&nbsp;')
            .append(duration)
            .append('&nbsp;' + this.event.formatDuration());
    },

    _formatAddress: function () {
        var addressLabel = $('<span/>')
            .addClass('site-event-details-label site-event-details-label-address')
            .text(_getT('Address:'));
        var address = $('<a/>')
            .attr('href', 'http://maps.yandex.ru?text=' + this.event.address)
            .attr('target', '_blank')
            .text(this.event.address);
        var addressDiv = $('<div/>')
            .addClass('site-events-details-address')
            .append(addressLabel)
            .append('&nbsp;')
            .append(address);
        if (this.event.addressRoots && this.event.addressRoots.length > 0) {
            var roots = $('<span/>')
                .addClass('site-event-details-label site-event-details-label-roots')
                .text(_getT('How to find:'));
            addressDiv
                .append('<br/>')
                .append(roots)
                .append('&nbsp;' + this.event.addressRoots);
        }
        return addressDiv;
    },

    detailsPopup: function() {
        this.formatDetails().dialog({
            title: _getT('Event Details'),
            modal: true,
            show: 'fade',
            hide: 'fade',
            width: '60%'
        });
    }
};
