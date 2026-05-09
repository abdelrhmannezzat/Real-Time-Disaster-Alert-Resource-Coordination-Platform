from sqlalchemy import Column, Integer, ForeignKey, Text, Numeric, DateTime, Enum, func
from sqlalchemy.orm import relationship

from config.database import Base
from model.enums import DisasterType, DisasterSeverity, DisasterSource, DisasterStatus


class Disaster(Base):
    __tablename__ = 'disaster'

    id = Column(Integer, primary_key=True)
    created_by = Column(Integer, ForeignKey('users.id'))
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    type = Column(Enum(DisasterType), nullable=False)
    severity = Column(Enum(DisasterSeverity), nullable=False)
    source = Column(Enum(DisasterSource), nullable=False)
    status = Column(Enum(DisasterStatus), nullable=False)
    radius = Column(Numeric, nullable=False)
    location_id = Column(Integer, ForeignKey('locations.id'))
    external_id = Column(Text, nullable=True, unique=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())


    # Relationships
    creator = relationship("User")
    location = relationship("Location")
    assignments = relationship("Assignment", back_populates="disaster")
    resources = relationship("Resource", back_populates="disaster")
