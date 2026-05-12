from fastapi import Depends
from sqlalchemy.orm import Session

from config.database import get_db
from repository.user_repo import UserRepository
from service.user_service import UserService


def get_user_service(db: Session = Depends(get_db)):
    user_repo = UserRepository()
    return UserService(user_repo, db)
