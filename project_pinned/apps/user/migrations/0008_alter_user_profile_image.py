# Generated by Django 4.2.2 on 2023-09-02 12:10

import apps.user.models
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("user", "0007_userdevice"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="profile_image",
            field=models.ImageField(
                blank=True, null=True, upload_to=apps.user.models.user_directory_path
            ),
        ),
    ]
