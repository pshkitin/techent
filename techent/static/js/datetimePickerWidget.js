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

function createDatetimePicker(dateInput, dateInputId, asTableFragment, onDatetimeChanged) {

    $(dateInput).wrap('<div class = "containerEventDate"/>');
    $containerDiv = $(dateInput).parent();
    var input = $containerDiv.children('#'+dateInputId).addClass('picker_input picker_datetime_input');

    if (asTableFragment) {
        addPickerToTr($containerDiv, input);
    } else {
        validateDivClassForPicker($containerDiv, 'datetime');
        $containerDiv.append(input);
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
