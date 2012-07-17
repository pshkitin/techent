# -*- coding: utf-8 -*-
from  flaskext.wtf import (Form, TextField,
                           FileField, ValidationError, validators, TextAreaField)
from wtforms.fields.core import SelectField
from techent.models import Event
from mongoengine.queryset import DoesNotExist
from isodate import parse_datetime
from isodate.isoerror import ISO8601Error
import datetime

class EventForm(Form):
    subject = TextField("Subject", [validators.Required()])
    logo = FileField("Logo")
    start_date = TextField("Event start", [validators.Required()])
    end_date = TextField("Event end", [validators.Required()])
    description = TextField("Description")
    location = SelectField('City', choices=[('moscow', 'Moscow'), ('saratov', 'Saratov'), ('st_petersburg', 'St.Petersburg'), ('usa_city','USA City')])
    hosts = TextField("Hosts description")
    tags = TextField("Tags")
    comments = TextField("Comment")

    def validate_start_date(self, field):
        self.iso_date(field.data)

    def validate_end_date(self, field):
        end_dt = self.iso_date(field.data)
        # Compare date
        # Validate start date because of nobody can garantie the order of field validation
        try:
            start_dt = self.iso_date(self.start_date.data)
        except ValidationError:
            return
        if start_dt > end_dt:
            raise ValidationError("End date should be less then start date")

    def iso_date(self, date_string):
        try:
            # TODO: replase this parser to more strict, because this parser can parse
            # this 2008-09hhkjhkjhjk-03T20:56:35.asdads450686+00:01
            date = datetime.datetime.strptime(date_string, "%d.%m.%Y @ %H:%M")
            return date
        except (ValueError, ISO8601Error):
            raise ValidationError("Date is in invalid format")

class CommentForm(Form):
    comment = TextAreaField("Comment", [validators.Required()])