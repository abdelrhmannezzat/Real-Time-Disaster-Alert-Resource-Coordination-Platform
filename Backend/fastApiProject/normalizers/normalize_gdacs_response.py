import reverse_geocode

from model.enums import DisasterSeverity, DisasterType, DisasterSource, DisasterStatus
from schema.dtos.normalized_disaster_dto import NormalizedDisasterDto


def get_severity(alert_level: str):
    if alert_level == "Green":
        return DisasterSeverity.LOW
    if alert_level == 'Orange':
        return DisasterSeverity.MEDIUM
    if alert_level == 'Red':
        return DisasterSeverity.HIGH
    return DisasterSeverity.CRITICAL


def get_type(tp: str):
    if tp == 'EQ':
        return DisasterType.EARTHQUAKE
    if tp == 'WF':
        return DisasterType.FIRE
    if tp == 'VO':
        return DisasterType.VOLCANO
    if tp == 'FL':
        return DisasterType.FLOOD
    return DisasterType.OTHER


def estimate_radius(color: str):
    if color == 'Green':
        return 10.0
    if color == 'Orange':
        return 50.0
    if color == 'Red':
        return 100.0
    return 2000.0


def normalize_gdacs_response(response):
    disasters = []
    events = response.get('features')
    for event in events:
        longitude = event.get('geometry').get('coordinates')[0]
        latitude = event.get('geometry').get('coordinates')[1]

        temp = reverse_geocode.search([(latitude, longitude)])
        city = temp[0].get('city')
        country = temp[0].get('country')

        normalized_disaster = NormalizedDisasterDto(
            title=event.get('properties').get('name'),
            description=event.get('properties').get('htmldescription'),
            type=get_type(event.get('properties').get('eventtype')),
            severity=get_severity(event.get('properties').get('alertlevel')),
            source=DisasterSource.GDACS,
            status=DisasterStatus.ACTIVE,
            radius=estimate_radius(event.get('properties').get('alertlevel')),
            external_id=str(event.get('properties').get('eventid')),
            start_time=event.get('properties').get('fromdate'),
            end_time=event.get('properties').get('todate'),
            latitude=latitude,
            longitude=longitude,
            city=city,
            country=country
        )
        disasters.append(normalized_disaster)

    return disasters
