from fastapi import Depends

from repository.user_repo import UserRepository


class UserService:
    def __init__(self, user_repository: UserRepository = Depends(UserRepository)):
        self.user_repository = user_repository

    def activate_user(self, user_id: int):
        self.user_repository.activate_user(user_id)

    def deactivate_user(self, user_id: int):
        self.user_repository.deactivate_user(user_id)
