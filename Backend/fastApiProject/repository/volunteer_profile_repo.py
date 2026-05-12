from sqlalchemy.orm import Session

from model import VolunteerProfile
from model.enums import VolunteerStatus
from repository.interfaces.volunteer_profile_repo_interface import IVolunteerProfileRepository


class VolunteerProfileRepository(IVolunteerProfileRepository):
    def __init__(self):
        pass

    def create_volunteer_profile(self, loc_id: int, user_id: int, db: Session):
        volunteer = VolunteerProfile(
            user_id=user_id,
            status=VolunteerStatus.AVAILABLE,
            location_id=loc_id
        )
        db.add(volunteer)
        db.flush()
        return volunteer
