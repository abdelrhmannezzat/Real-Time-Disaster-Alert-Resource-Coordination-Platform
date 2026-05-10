from sqlalchemy import Column, Integer, Text, Numeric, DateTime, func
from geoalchemy2 import Geography
from config.database import Base


class Location(Base):
    __tablename__ = 'locations'

    id = Column(Integer, primary_key=True)
    latitude = Column(Numeric, nullable=False)
    longitude = Column(Numeric, nullable=False)
    city = Column(Text, nullable=True)
    country = Column(Text, nullable=True)
    coordinates = Column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
