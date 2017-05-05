import re

from django.conf import settings

from gmaps import Geocoding
from gmaps.errors import NoResults, GmapException, InvalidRequest

latlngreg = re.compile(r'\@([-+]?\d*\.\d+|\d+)\,([-+]?\d*\.\d+|\d+)')

__all__ = ["geocode"]

def geocode(address, api_key=None):

    api_key = getattr(settings, 'GOOGLE_API_KEY', api_key)
    if api_key and api_key.strip() == "":
        api_key = None

    api = Geocoding(api_key=api_key)
    if address.strip() != '':
        original_address = address.strip()
        try:

            latlng = latlngreg.search(original_address)
            if latlng:
                results = api.reverse(float(latlng.group(1)), float(latlng.group(2)))
            else:
                results = api.geocode(original_address)

            if len(results):
                results[0]['lng'] = results[0].get('geometry', {}).get('location', {}).get('lng', None)
                results[0]['lat'] = results[0].get('geometry', {}).get('location', {}).get('lat', None)
                return results[0]

        except NoResults as e:
            return { 'error': 'NoResults', 'message': str(e)  }
        except GmapException as e:
            return { 'error': 'GmapException', 'message': str(e) }
        except InvalidRequest as e:
            return { 'error': 'InvalidRequest', 'message': str(e) }
        except Exception as e:
            return { 'error': 'Exception', 'message': str(e) }
    return { 'error': 'EmptyAddress' }