from sqlalchemy import Column, Integer, Text, DateTime, Enum, Boolean, func
from sqlalchemy.orm import relationship

from config.database import Base
from model.enums import UserRole


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(Text, unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    approved = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    volunteer_profile = relationship("VolunteerProfile", back_populates="user", uselist=False)
    assignments_received = relationship("Assignment", back_populates="volunteer", foreign_keys="Assignment.assigned_to")
    assignments_given = relationship("Assignment", back_populates="coordinator", foreign_keys="Assignment.assigned_by")
    notifications = relationship("Notification", back_populates="user")
