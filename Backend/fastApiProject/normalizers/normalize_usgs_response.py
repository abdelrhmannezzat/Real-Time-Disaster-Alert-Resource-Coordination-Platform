from datetime import datetime, timezone, timedelta
import reverse_geocode
from model.enums import DisasterSeverity, DisasterSource, DisasterStatus
from schema.dtos.normalized_disaster_dto import NormalizedDisasterDto


def get_severity(mag: float) -> DisasterSeverity:
    if mag < 5:
        return DisasterSeverity.LOW
    elif mag < 6:
        return DisasterSeverity.MEDIUM
    elif mag < 7:
        return DisasterSeverity.HIGH
    return DisasterSeverity.CRITICAL


def estimate_radius(mag: float):
    if mag < 4:
        return 15.0
    if mag < 5:
        return 65.0
    if mag < 6:
        return 150.0
    if mag < 7:
        return 450.0
    if mag < 8:
        return 1000.0
    return 2000.0


def normalize_usgs_response(response):
    disasters = []
    events = response.get('features')
    for event in events:
        mag = float(event.get('properties').get('mag'))

        severity = get_severity(mag)

        longitude = float(event.get('geometry').get('coordinates')[0])
        latitude = float(event.get('geometry').get('coordinates')[1])

        temp = reverse_geocode.search([(latitude, longitude)])
        city = temp[0].get('city')
        country = temp[0].get('country')

        # We still need to create location first
        normalized_disaster = NormalizedDisasterDto(
            title=event.get('properties').get('title'),
            type=event.get('properties').get('type'),
            severity=severity,
            source=DisasterSource.USGS,
            status=DisasterStatus.ACTIVE,
            radius=estimate_radius(mag),
            external_id=event.get('id'),
            start_time=datetime.fromtimestamp(
                int(event.get('properties').get('time')) / 1000.0,
                tz=timezone(timedelta(hours=3))
            ),
            latitude=latitude,
            longitude=longitude,
            city=city,
            country=country
        )
        disasters.append(normalized_disaster)

    return disasters
