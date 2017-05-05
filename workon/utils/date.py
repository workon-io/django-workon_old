import datetime
from django.utils.safestring import mark_safe
from django.utils import formats
from django.utils.dateformat import format
from django.utils.text import force_text
from workon.utils.number import is_float

__all__ = ["value_to_datetime", "format_date_range", "date_range_to_html"]

def value_to_datetime(value, default=None):
    if not value:
        return value
    elif is_float(value):
        try:
            value = datetime.fromtimestamp(float(value))
        except Exception:
            value = None
    elif not isinstance(value, datetime.datetime):
        # all timestamps are in UTC, but the marker is optional
        if value.endswith('Z'):
            value = value[:-1]
        if '.' in value:
            # Python doesn't support long microsecond values
            # https://github.com/getsentry/sentry/issues/1610
            ts_bits = value.split('.', 1)
            value = '%s.%s' % (ts_bits[0], ts_bits[1][:2])
            fmt = '%Y-%m-%dT%H:%M:%S.%f'
        else:
            fmt = '%Y-%m-%dT%H:%M:%S'
        try:
            value = datetime.datetime.strptime(value, fmt)
        except Exception:
            value = None

    return value if value else default

def format_date_range(
    start_date=None,
    end_date=None,
    start_hour=None,
    end_hour=None,
    divider=' '):

    fdate = None


    if end_date and start_date:
        if  start_date.day == end_date.day and \
            start_date.month == end_date.month and \
            start_date.year == end_date.year:

            if start_hour and end_hour:
                fdate = u"Le %s %s de %s à %s" % (
                    format(start_date, "l d F"),
                    divider,
                    format(start_hour, "G\:i"),
                    format(end_hour, "G\:i"),
                )
            elif start_hour:
                fdate = u"Le %s %s à partir de %s" % (
                    format(start_date, "l d F"),
                    divider,
                    format(start_hour, "G\:i"),
                )
            elif end_hour:
                fdate = u"Le %s %s jusqu'à %s" % (
                    format(start_date, "l d F"),
                    divider,
                    format(end_hour, "G\:i"),
                )
            else:
                fdate = u"Le %s %s toute la journée" % (
                    format(start_date, "l d F"),
                    divider
                )

        else:
            if start_hour and end_hour:

                fdate = u"Du %s %s à %s %s jusqu'au %s %s à %s" % (
                    format(start_date, "l d F"),
                    divider,
                    format(start_hour, "G\:i"),
                    divider,
                    format(end_date, "l d F"),
                    divider,
                    format(end_hour, "G\:i"),
                )
            elif start_hour:
                fdate = u"Du %s %s à %s %s jusqu'au %s" % (
                    format(start_date, "l d F"),
                    divider,
                    format(start_hour, "G\:i"),
                    divider,
                    format(end_date, "l d F"),
                )
            elif end_hour:
                fdate = u"Du %s %s jusqu'au %s %s à %s " % (
                    format(start_date, "l d F"),
                    divider,
                    format(end_date, "l d F"),
                    divider,
                    format(end_hour, "G\:i"),
                )
            else:
                fdate = u"Du %s %s jusqu'au %s" % (
                    format(start_date, "l d F"),
                    divider,
                    format(end_date, "l d F"),
                )
    elif start_date:
        if start_hour and end_hour:
            fdate = u"À partir du %s %s de %s à %s" % (
                format(start_date, "l d F"),
                divider,
                format(start_hour, "G\:i"),
                format(end_hour, "G\:i"),
            )
        elif start_hour:
            fdate = u"À partir du %s %s à %s" % (
                format(start_date, "l d F"),
                divider,
                format(start_hour, "G\:i")
            )
        elif end_hour:
            fdate = u"À partir du %s %s jusqu'à %s" % (
                format(start_date, "l d F"),
                divider,
                format(end_hour, "G\:i"),
            )
        else:
            fdate = u"À partir du %s" % (
                format(start_date, "l d F")
            )

    elif end_date:
        if start_hour and end_hour:
            fdate = u"Jusqu'au %s %s de %s à %s" % (
                format(end_date, "l d F"),
                divider,
                format(start_hour, "G\:i"),
                format(end_hour, "G\:i"),
            )
        elif start_hour:
            fdate = u"Jusqu'au %s %s à partir de %s" % (
                format(end_date, "l d F"),
                divider,
                format(start_hour, "G\:i")
            )
        elif end_hour:
            fdate = u"Jusqu'au %s %s à %s" % (
                format(end_date, "l d F"),
                divider,
                format(end_hour, "G\:i")
            )
        else:
            fdate = u"Jusqu'au %s" % (
                format(end_date, "l d F")
            )
    else:
        if start_hour and end_hour:
            fdate = u"Aujourd'hui %s de %s à %s" % (
                divider,
                format(start_hour, "G\:i"),
                format(end_hour, "G\:i"),
            )
        elif start_hour:
            fdate = u"Aujourd'hui %sà %s" % (
                divider,
                format(start_hour, "G\:i")
            )
        elif end_hour:
            fdate = u"Aujourd'hui %s jusqu'à %s" % (
                divider,
                format(end_hour, "G\:i"),
            )
        else:
            fdate = None

    return mark_safe(fdate) if fdate else None


def date_range_to_html(start_date=None, end_date=None, start_hour=None, end_hour=None, divider='<br/>'):
    return format_date_range(start_date=start_date, end_date=end_date, start_hour=start_hour, end_hour=end_hour, divider=divider)


