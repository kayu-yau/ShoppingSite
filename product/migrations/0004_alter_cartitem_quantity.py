# Generated by Django 4.2.16 on 2024-10-30 04:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0003_cart_cartitem'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cartitem',
            name='quantity',
            field=models.IntegerField(default=0),
        ),
    ]
