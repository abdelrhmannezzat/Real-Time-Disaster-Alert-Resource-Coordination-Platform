from fastapi import Depends
from sqlalchemy.orm import Session

from config.database import get_db
from repository.volunteer_profile_repo import VolunteerProfileRepository
from service.volunteer_profile_service import VolunteerProfileService


def get_volunteer_profile_service(db: Session = Depends(get_db)):
    volunteer_repo = VolunteerProfileRepository()
    return VolunteerProfileService(volunteer_repo, db)
