from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship

from config.database import Base
from model.enums import AssignmentStatus


class Assignment(Base):
    __tablename__ = 'assignment'

    id = Column(Integer, primary_key=True)
    description = Column(Text)
    status = Column(Enum(AssignmentStatus), default=AssignmentStatus.PENDING, nullable=False)
    assigned_to = Column(Integer, ForeignKey('users.id'), nullable=False)
    assigned_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    disaster_id = Column(Integer, ForeignKey('disaster.id'), nullable=False)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    # Relationships
    volunteer = relationship("User", back_populates="assignments_received", foreign_keys=[assigned_to])
    coordinator = relationship("User", back_populates="assignments_given", foreign_keys=[assigned_by])
    disaster = relationship("Disaster", back_populates="assignments")
