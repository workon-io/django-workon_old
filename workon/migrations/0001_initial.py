
from django.db import migrations, models
from django.contrib.postgres.operations import TrigramExtension, UnaccentExtension, BtreeGinExtension

class Migration(migrations.Migration):


    operations = [
        TrigramExtension(),
        BtreeGinExtension(),
        UnaccentExtension(),
        migrations.RunSQL(
            "CREATE TEXT SEARCH CONFIGURATION french_unaccent( COPY = french )",
            "ALTER TEXT SEARCH CONFIGURATION french_unaccent ALTER MAPPING FOR hword, hword_part, word WITH unaccent, french_stem"
        )
    ]
