import enum


class UserRole(str, enum.Enum):
    ADMIN = 'ADMIN'
    COORDINATOR = 'COORDINATOR'
    VOLUNTEER = 'VOLUNTEER'


class VolunteerStatus(str, enum.Enum):
    AVAILABLE = 'available'
    BUSY = 'busy'
    OFFLINE = 'offline'


class DisasterType(str, enum.Enum):
    EARTHQUAKE = 'EARTHQUAKE'
    FLOOD = 'FLOOD'
    FIRE = 'FIRE'
    STORM = 'STORM'
    VOLCANO = 'VOLCANO'
    LANDSLIDE = 'LANDSLIDE'
    OTHER = 'OTHER'


class DisasterSeverity(str, enum.Enum):
    LOW = 'LOW'
    MEDIUM = 'MEDIUM'
    HIGH = 'HIGH'
    CRITICAL = 'CRITICAL'


class DisasterStatus(str, enum.Enum):
    ACTIVE = 'ACTIVE'
    MONITORING = 'MONITORING'
    RESOLVED = 'RESOLVED'


class DisasterSource(str, enum.Enum):
    MANUAL = "MANUAL"
    USGS = "USGS"
    GDACS = "GDACS"
    OPENWEATHER = "OPENWEATHER"


class AssignmentStatus(str, enum.Enum):
    PENDING = 'PENDING'
    ACCEPTED = 'ACCEPTED'
    REJECTED = 'REJECTED'
    COMPLETED = 'COMPLETED'


class ResourceType(str, enum.Enum):
    WATER = "water"
    FOOD = "food"
    MEDICAL = "medical"
    SHELTER = "shelter"
    VEHICLE = "vehicle"
    OTHER = "other"


class ResourceStatus(str, enum.Enum):
    AVAILABLE = "available"
    ASSIGNED = "assigned"
    DEPLETED = "depleted"


class NotificationType(str, enum.Enum):
    NEW_DISASTER = "new_disaster"
    ASSIGNMENT = "assignment"
    RESOURCE_UPDATE = "resource_update"
