# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-26 23:31
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workon_notification', '0005_notification_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='context_content_type',
        ),
        migrations.RemoveField(
            model_name='notification',
            name='receiver',
        ),
        migrations.DeleteModel(
            name='Notification',
        ),
    ]