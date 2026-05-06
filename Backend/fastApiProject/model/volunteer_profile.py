from sqlalchemy import Column, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship

from config.database import Base
from model.enums import VolunteerStatus


class VolunteerProfile(Base):
    __tablename__ = 'volunteer_profile'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    status = Column(Enum(VolunteerStatus), nullable=False)
    location_id = Column(Integer, ForeignKey('locations.id'))

    # Relationships
    users = relationship('User', back_populates='volunteer_profiles')
    location = relationship('Location')
