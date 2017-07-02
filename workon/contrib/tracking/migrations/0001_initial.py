# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-06-01 14:01
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='TrackedFieldModification',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('field', models.CharField(editable=False, max_length=40, verbose_name='Field')),
                ('old_value', models.TextField(editable=False, help_text='JSON serialized', null=True, verbose_name='Old value')),
                ('new_value', models.TextField(editable=False, help_text='JSON serialized', null=True, verbose_name='New value')),
            ],
            options={
                'db_table': 'workon_tracking_tracked_field_modification',
                'verbose_name': 'Tracking field modification',
                'verbose_name_plural': 'Tracking field modifications',
            },
        ),
        migrations.CreateModel(
            name='TrackingEvent',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date', models.DateTimeField(auto_now_add=True, verbose_name='Date')),
                ('action', models.CharField(choices=[('CREATE', 'Create'), ('UPDATE', 'Update'), ('DELETE', 'Delete'), ('ADD', 'Add'), ('REMOVE', 'Remove'), ('CLEAR', 'Clear')], editable=False, max_length=6, verbose_name='Action')),
                ('object_id', models.PositiveIntegerField(editable=False, null=True)),
                ('object_repr', models.CharField(editable=False, help_text='Object representation, useful if the object is deleted later.', max_length=250, verbose_name='Object representation')),
                ('user_id', models.PositiveIntegerField(editable=False, null=True)),
                ('user_repr', models.CharField(editable=False, help_text='User representation, useful if the user is deleted later.', max_length=250, verbose_name='User representation')),
                ('object_content_type', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, related_name='workon_tracking_object_content_type', to='contenttypes.ContentType')),
                ('user_content_type', models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='workon_tracking_user_content_type', to='contenttypes.ContentType')),
            ],
            options={
                'ordering': ['-date'],
                'db_table': 'workon_tracking_tracking_event',
                'verbose_name': 'Tracking event',
                'verbose_name_plural': 'Tracking events',
            },
        ),
        migrations.AddField(
            model_name='trackedfieldmodification',
            name='event',
            field=models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, related_name='fields', to='workon_tracking.TrackingEvent', verbose_name='Event'),
        ),
    ]
