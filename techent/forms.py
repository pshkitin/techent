# -*- coding: utf-8 -*-
from  flaskext.wtf import (Form, TextField,
                           FileField, ValidationError, validators)
from wtforms.fields.core import SelectField
from techent.models import Event
from mongoengine.queryset import DoesNotExist
from isodate import parse_datetime
from isodate.isoerror import ISO8601Error

class EventForm(Form):
    subject = TextField("Subject", [validators.Required()])
    logo = FileField("Logo")
    start_date = TextField("Event start", [validators.Required()])
    end_date = TextField("Event end", [validators.Required()])
    description = TextField("Description")
    location = SelectField('City', choices=[('moscow', 'Moscow'), ('saratov', 'Saratov'), ('st_petersburg', 'St.Petersburg'), ('usa_city','USA City')])
    hosts = TextField("Hosts description")
    domain = TextField("Domain", [validators.Required(), validators.URL()])
    tags = TextField("Tags")

    def validate_start_date(self, field):
        self.iso_date_validation(field.data)

    def validate_end_date(self, field):
        end_dt = self.iso_date_validation(field.data)
        # Compare date
        # Validate start date because of nobody can garantie the order of field validation
        try:
            start_dt = self.iso_date_validation(self.start_date.data)
        except ValidationError:
            return
        if start_dt > end_dt:
            raise ValidationError("End date should be less then start date")

    def validate_domain(self, field):
        try:
            event = Event.objects.get(domain = field.data)
        except DoesNotExist:
            return
        raise ValidationError("Domain isn't available")

    def iso_date_validation(self, date_string):
        try:
            # TODO: replase this parser to more strict, because this parser can parse
            # this 2008-09hhkjhkjhjk-03T20:56:35.asdads450686+00:01
            return parse_datetime(date_string)
        except (ValueError, ISO8601Error):
            raise ValidationError("Date is in invalid format")