# Generated by Django 5.2.1 on 2025-05-17 00:02

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('balance', models.DecimalField(decimal_places=2, default=1000.0, max_digits=10, verbose_name='Saldo')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='player_profile', to=settings.AUTH_USER_MODEL, verbose_name='Użytkownik')),
            ],
            options={
                'verbose_name': 'Gracz',
                'verbose_name_plural': 'Gracze',
            },
        ),
        migrations.CreateModel(
            name='GameHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bet_type', models.CharField(choices=[('number', 'Konkretny numer'), ('color', 'Kolor'), ('even_odd', 'Parzyste/Nieparzyste'), ('dozen', 'Tuzin'), ('column', 'Kolumna'), ('high_low', 'Wysokie/Niskie')], max_length=20, verbose_name='Typ zakładu')),
                ('bet_value', models.CharField(max_length=50, verbose_name='Wartość zakładu')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Kwota zakładu')),
                ('result', models.CharField(max_length=50, verbose_name='Wynik')),
                ('payout', models.DecimalField(decimal_places=2, default=0.0, max_digits=10, verbose_name='Wygrana')),
                ('timestamp', models.DateTimeField(auto_now_add=True, verbose_name='Data i czas')),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='game_history', to='roulette.player', verbose_name='Gracz')),
            ],
            options={
                'verbose_name': 'Historia gry',
                'verbose_name_plural': 'Historie gier',
                'ordering': ['-timestamp'],
            },
        ),
    ]
