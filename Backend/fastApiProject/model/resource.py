from sqlalchemy import Integer, Column, Text, Enum, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from config.database import Base
from model.enums import ResourceType, ResourceStatus


class Resource(Base):
    __tablename__ = 'resource'

    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False)
    type = Column(Enum(ResourceType), nullable=False)
    quantity = Column(Integer, nullable=False)
    status = Column(Enum(ResourceStatus), nullable=False)
    assigned_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    location_id = Column(Integer, ForeignKey('locations.id'), nullable=False)
    disaster_id = Column(Integer, ForeignKey('disaster.id'), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    assigner = relationship("User")
    location = relationship("Location")
    disaster = relationship("Disaster", back_populates="resources")