from typing import Protocol

from sqlalchemy.orm import Session


class IVolunteerProfileRepository(Protocol):
    def create_volunteer_profile(self, loc_id: int, user_id: int, db: Session):
        ...
