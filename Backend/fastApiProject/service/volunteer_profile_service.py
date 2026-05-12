from sqlalchemy.orm import Session
from repository.interfaces.volunteer_profile_repo_interface import IVolunteerProfileRepository


class VolunteerProfileService:
    def __init__(self, volunteer_profile_repo: IVolunteerProfileRepository, db: Session):
        self.volunteer_profile_repo = volunteer_profile_repo
        self.db = db

    def create_volunteer_profile(self, loc_id: int, user_id: int, db: Session):
        return self.volunteer_profile_repo.create_volunteer_profile(loc_id, user_id, db)


