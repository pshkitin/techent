globalCalendar.messages = {};

/**
 *
 *
 * @param {string} message Message text (HTML is supported)
 * @param {string} style one of 'success', 'error', 'info'
 * @param {int|undefined} duration auto hide message after this time in seconds
 */
globalCalendar.messages.Message = function (message, style, duration) {
    this.message = message;
    this.style = style == undefined ? 'info' : style;
    this.duration = duration;
};

globalCalendar.messages.Message.prototype = {
    show: function () {
        var div = this._getDiv();
        $('#messages-container').append(div);
        div.fadeIn();
        var msgObject = this;
        if (this.duration != undefined) {
            window.setTimeout(function () {
                msgObject.hide()
            }, this.duration * 1000);
        }
    },

    hide: function () {
        this._getDiv().fadeOut(function () {
            $('#messages-container').children().filter(':hidden').remove();
        });
    },

    _getDiv: function () {
        if (this._div == undefined) {
            var closeButton = $('<button/>')
                .addClass('site-message-close')
                .text('Hide')
                .button({
                    icons: {
                        primary: 'ui-icon-close'
                    },
                    text: false
                })
                .click(this, function (event) {
                    event.data.hide();
                });
            this._div = $('<div/>')
                .addClass('site-message site-message-' + this.style + ' ui-helper-clearfix ui-corner-all')
                .html(this.message)
                .append(closeButton)
                .hide();
        }
        return this._div;
    }
};

globalCalendar.messages.show = function (msg, style, duration) {
    new globalCalendar.messages.Message(msg, style, duration).show();
};

globalCalendar.info = function (msg, duration) {
    globalCalendar.messages.show(msg, 'info', duration);
};

globalCalendar.success = function (msg, duration) {
    globalCalendar.messages.show(msg, 'success', duration);
};

globalCalendar.error = function (msg, duration) {
    globalCalendar.messages.show(msg, 'error', duration);
};

$(document).ready(function () {
    function show (msg, i) {
        window.setTimeout(function () {
            globalCalendar.messages.show(msg.text, msg.type, 10);
        }, 500 * i);
    }

    jQuery.getJSON('messages.json', {}, function (messages) {
        for (var i in messages) {
            show(messages[i], i)
        }
    });
});