from fastapi import Depends
from sqlalchemy.orm import Session

from repository.interfaces.user_repo_interface import IUserRepository


class UserService:
    def __init__(self, user_repository: IUserRepository, db: Session):
        self.user_repository = user_repository
        self.db = db

    def activate_user(self, user_id: int):
        self.user_repository.activate_user(user_id, self.db)

    def deactivate_user(self, user_id: int):
        self.user_repository.deactivate_user(user_id, self.db)

    def get_users(self):
        return self.user_repository.get_users(self.db)
