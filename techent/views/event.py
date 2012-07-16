# -*- coding: utf-8 -*-
from flask import Blueprint, request, redirect, url_for, render_template

from techent.forms import EventForm
from techent.models import Event, Tag
from mongoengine.queryset import DoesNotExist
from sets import Set

event = Blueprint("event", __name__)

@event.route("/event", methods = ["GET", "POST"])
def create_event():
    form = EventForm(request.form, csrf_enabled = False) 
    if form.validate_on_submit():
        tags = []
        if form.tags.data:
            tags = form.tags.data.split(",")
            store_tag_metainformation(tags)

        start_date = form.iso_date(form.start_date.data)
        end_date = form.iso_date(form.end_date.data)
        event = Event(subject = form.subject.data,
                        start_date = start_date,
                        end_date = end_date,
                        description = form.description.data,
                        hosts = form.hosts.data,
                        tags = tags)
        if request.files[form.logo.name]:
            event.logo.put(request.files[form.logo.name])
        event.save()
        return redirect(url_for("main.frontpage"))
    return render_template("create_event.html", form = form)

def store_tag_metainformation(tag_names):
    for tag_name in tag_names:
        try:
            tag = Tag.objects.get(name = tag_name)
        except DoesNotExist:
            tag = Tag(name = tag_name, count = 0, related_tags = [])

        #Increment count of posts on the tag
        tag.count += 1
        related_tags = Set(tag_names)
        related_tags.remove(tag_name)
        tag.related_tags = list(Set(tag.related_tags) | (related_tags))

        tag.save()
