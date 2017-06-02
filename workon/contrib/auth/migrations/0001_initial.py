# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-02 12:19
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ActivationToken',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Créé le')),
                ('updated_at', models.DateTimeField(auto_now=True, db_index=True, verbose_name='Modifié le')),
                ('token', models.CharField(db_index=True, max_length=64, verbose_name="Token d'activation")),
                ('is_used', models.BooleanField(default=False, verbose_name='Utilisé ?')),
                ('expire_at', models.DateTimeField(blank=True, db_index=True, null=True, verbose_name='Expire le')),
                ('actived_at', models.DateTimeField(blank=True, null=True, verbose_name='Activé le')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Utilisateur')),
            ],
            options={
                'verbose_name': "Clé d'activation",
                'verbose_name_plural': "Clés d'activation",
                'ordering': ('created_at', 'actived_at'),
            },
        ),
        migrations.AlterUniqueTogether(
            name='activationtoken',
            unique_together=set([('user', 'token')]),
        ),
    ]
