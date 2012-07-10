# -*- coding: utf-8 -*-
from flask import Blueprint, render_template
from techent.models import Tag, Event

main = Blueprint('main', __name__)

@main.route('/')
def frontpage():
    tags = list(Tag.objects.order_by("-count")[0:30])
    last_events = list(Event.objects.order_by("-start_date")[0:5])
    return render_template('index.html', events = last_events, tags = tags)
