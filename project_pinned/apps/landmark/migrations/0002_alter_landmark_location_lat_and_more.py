# Generated by Django 4.2.2 on 2023-06-28 06:36

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("landmark", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="landmark",
            name="location_lat",
            field=models.DecimalField(decimal_places=10, max_digits=15),
        ),
        migrations.AlterField(
            model_name="landmark",
            name="location_lon",
            field=models.DecimalField(decimal_places=10, max_digits=15),
        ),
    ]
