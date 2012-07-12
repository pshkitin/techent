const STEP_HOURS            = 1;
const STEP_MINUTES          = 10;
const NUMBER_OF_MONTHS      = 1;
const MIN_DATE              = 0;
const MAX_DATE              = 7;
const START_HOURS           = '02';
const START_MINUTES         = '00';
const START_DURATION        = START_HOURS + ':' + START_MINUTES;

const HOURS_MINUTES_SEPARATOR = ':'
const TIME_FORMAT           = 'hh' + HOURS_MINUTES_SEPARATOR + 'mm';
const DATE_TIME_SEPARATOR   = ' @ ';

function validateDivClassForPicker(containerDiv, datetime_or_duration) {
    if (!containerDiv.hasClass('picker_div')) {
        containerDiv.addClass('picker_div');
    }
    if (datetime_or_duration == "datetime" || datetime_or_duration == "duration") {
        var className = 'picker_' + datetime_or_duration + '_div';
        if (!containerDiv.hasClass(className)) {
            containerDiv.addClass(className);
        }
    }

}

function addPickerToTr(containerDiv, label, input) {
    var tdHtml =
        '<td class="picker_td picker_label_td"><div class="picker_element_div picker_label_div"/></td>\
         <td class="picker_td picker_input_td"><div class="picker_element_div picker_input_div"/></td>'
    containerDiv.append(tdHtml);
    containerDiv.find('div.picker_label_div').append(label);
    containerDiv.find('div.picker_input_div').append(input);
}

function createDatetimePicker(containerDiv, asTableFragment, onDatetimeChanged) {
    var labelText = 'Start datetime:';

    var randomnumber = Math.floor(Math.random() * 10001)
    var inputId = "input_datetime_picker_id_" + randomnumber;

    var labelItem = $('<label/>').attr('for', inputId).addClass('picker_label picker_datetime_label').text(_getT(labelText));
    var input = $('<input />').attr('type', 'text').attr('id', inputId).addClass('picker_input picker_datetime_input');

    $containerDiv = $(containerDiv);

    if (asTableFragment) {
        addPickerToTr($containerDiv, labelItem, input);
    } else {
        validateDivClassForPicker($containerDiv, 'datetime');
        $containerDiv.append(labelItem, input);
    }

    var $startDateInput = $containerDiv.find('input.picker_input');

    $startDateInput.focusin(function() {
        $startDateInput.trigger('blur')
    });

    $startDateInput.datetimepicker({
        timeFormat:TIME_FORMAT,
        separator: DATE_TIME_SEPARATOR,
        stepHour: STEP_HOURS,
        stepMinute: STEP_MINUTES,
        hour: START_HOURS,
        minute: START_MINUTES,
        numberOfMonths: NUMBER_OF_MONTHS,
        minDate: MIN_DATE,
        maxDate: MAX_DATE,

        onClose:function() {
            if (onDatetimeChanged) {
                onDatetimeChanged($startDateInput.datetimepicker('getDate'));
            }
        }
    });
}

function createDurationPicker(containerDiv, asTableFragment, onDurationChanged) {
    var labelText = 'Duration:';

    var randomnumber = Math.floor(Math.random() * 10001)
    var inputId = "input_duration_picker_id_" + randomnumber;

    var labelItem = $('<label/>').attr('for', inputId).addClass('picker_label picker_duration_label').text(_getT(labelText));
    var input = $('<input />').attr('type', 'text').attr('id', inputId).
        addClass('picker_input picker_duration_input').val(START_DURATION);

    $containerDiv = $(containerDiv);
    if (asTableFragment) {
        addPickerToTr($containerDiv, labelItem, input);
    } else {
        validateDivClassForPicker($containerDiv, 'duration');
        $containerDiv.append(labelItem, input);
    }


    var $timeInput = $containerDiv.find('input.picker_input');

    $timeInput.focusin(function() {
        $timeInput.trigger('blur')
    });

    $timeInput.timepicker({
        timeFormat: TIME_FORMAT,
        stepHour: STEP_HOURS,
        stepMinute: STEP_MINUTES,
        hour: START_HOURS,
        minute: START_MINUTES,

        onClose:function() {
            triggerNotifiers(onDurationChanged);
        }
    });

    function triggerNotifiers(func) {
        if (func) {
            var time = $timeInput.val().split(HOURS_MINUTES_SEPARATOR);
            var hours = time[0];
            var minutes = time[1];
            func(hours, minutes);
        }
    }
}

function createDateTimeDurationPicker(datetimeDurationDiv, onDatetimeChanged, onDurationChanged) {
    $datetimeDurationDiv = $(datetimeDurationDiv);

    validateDivClassForPicker($datetimeDurationDiv, null);

    var tableHtml =
        '<table class="picker_table">\
            <tr class="picker_tr picker_datetime_tr">\
            </tr>\
            <tr class="picker_tr picker_duration_tr">\
            </tr>\
        </table>';

    $datetimeDurationDiv.append(tableHtml);

    createDatetimePicker($datetimeDurationDiv.find('tr.picker_datetime_tr'), true, onDatetimeChanged);
    createDurationPicker($datetimeDurationDiv.find('tr.picker_duration_tr'), true, onDurationChanged);
}