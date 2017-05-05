import re
from django.utils.safestring import mark_safe
from babel import Locale
from babel.numbers import format_number, format_decimal, format_percent


DEFAULT_CURRENCY = 'EUR'
# Send in data way to assets/js/input_format.js
CURRENCY_PATTERNS = {
    'EUR': { 'format': u'%s €', 'locale': 'fr_FR', 'spacing': ' ', 'decimal': ',', 'placeholder': 'EUR' },
    'USD': { 'format': u'$%s', 'locale': 'en_US', 'spacing': ',', 'decimal': '.', 'placeholder': 'USD' },
}

__all__ = [
    'price_format_decimal_to_currency',
    'price_format_currency_to_decimal',
    'formatted_price',
    'formatted_price_html'
]

def price_format_decimal_to_currency(value, currency='EUR'):
    if value:
        try:
            if currency in CURRENCY_PATTERNS.keys():
                value = CURRENCY_PATTERNS[currency]['format'] % format_number(value, locale = CURRENCY_PATTERNS[currency]['locale'])
            else:
                return value
        except:
            return value
    return value

def price_format_currency_to_decimal(value, currency='EUR'):
    if value == None:
        return None
    value = unicode(value)
    if value.strip() == '':
        return None

    float_value = ""
    float_lock = False
    for c in value[::-1]:
        if c.isdigit():
            float_value += c
        if not float_lock and (c == '.' or c == ','):
            float_value += '.'
            float_lock = True

    try:
        return float(float_value[::-1]);
    except:
        return None

def formatted_price(value, currency='EUR'):
    price = price_format_decimal_to_currency(value, currency)
    return price

def formatted_price_html(value, currency='EUR', spacing=None):

    currency_extra = currency.split(',')
    currency = currency_extra[0]
    if len(currency_extra) > 1:
        spacing = currency_extra[1].strip()

    price = formatted_price(value, currency)
    if price:
        price = price.replace(u' €', u'<sup>€</sup>')
        price = price

    if spacing != None:
        price = re.sub(r'[\s\xa0]', spacing, price)

    return mark_safe(price)