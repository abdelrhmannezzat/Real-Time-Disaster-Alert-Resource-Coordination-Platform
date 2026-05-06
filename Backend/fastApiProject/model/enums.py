import enum


class UserRole(str, enum.Enum):
    ADMIN = 'admin'
    COORDINATOR = 'coordinator'
    VOLUNTEER = 'volunteer'


class VolunteerStatus(str, enum.Enum):
    AVAILABLE = 'available'
    BUSY = 'busy'
    OFFLINE = 'offline'


class DisasterType(str, enum.Enum):
    EARTHQUAKE = 'earthquake'
    FLOOD = 'flood'
    FIRE = 'fire'
    STORM = 'storm'
    VOLCANO = 'volcano'
    LANDSLIDE = 'landslide'
    OTHER = 'other'


class DisasterSeverity(str, enum.Enum):
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'
    CRITICAL = 'critical'


class DisasterStatus(str, enum.Enum):
    ACTIVE = 'active'
    MONITORING = 'monitoring'
    RESOLVED = 'resolved'


class DisasterSource(str, enum.Enum):
    MANUAL = "manual"
    USGS = "usgs"
    GDACS = "gdacs"
    OPENWEATHER = "openweather"


class AssignmentStatus(str, enum.Enum):
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'
    COMPLETED = 'completed'


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
