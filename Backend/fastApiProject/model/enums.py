import enum


class UserRole(str, enum):
    ADMIN = 'admin'
    COORDINATOR = 'coordinator'
    VOLUNTEER = 'volunteer'


class VolunteerStatus(str, enum):
    AVAILABLE = 'available'
    BUSY = 'busy'
    OFFLINE = 'offline'


class DisasterType(str, enum):
    EARTHQUAKE = 'earthquake'
    FLOOD = 'flood'
    FIRE = 'fire'
    STORM = 'storm'
    VOLCANO = 'volcano'
    LANDSLIDE = 'landslide'
    OTHER = 'other'


class DisasterSeverity(str, enum):
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'
    CRITICAL = 'critical'


class DisasterStatus(str, enum):
    ACTIVE = 'active'
    MONITORING = 'monitoring'
    RESOLVED = 'resolved'


class DisasterSource(str, enum):
    MANUAL = "manual"
    USGS = "usgs"
    GDACS = "gdacs"
    OPENWEATHER = "openweather"


class AssignmentStatus(str, enum):
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'
    COMPLETED = 'completed'


class ResourceType(str, enum):
    WATER = "water"
    FOOD = "food"
    MEDICAL = "medical"
    SHELTER = "shelter"
    VEHICLE = "vehicle"
    OTHER = "other"


class ResourceStatus(str, enum):
    AVAILABLE = "available"
    ASSIGNED = "assigned"
    DEPLETED = "depleted"


class NotificationType(str, enum):
    NEW_DISASTER = "new_disaster"
    ASSIGNMENT = "assignment"
    RESOURCE_UPDATE = "resource_update"
