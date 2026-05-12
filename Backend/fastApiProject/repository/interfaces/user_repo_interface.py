from typing import Protocol

from sqlalchemy.orm import Session

from model import User
from schema.request.user_registration_request import UserRegistrationRequest


class IUserRepository(Protocol):
    def get_user_by_email(self, email: str, db: Session) -> User | None:
        ...

    def add_user(self, user: UserRegistrationRequest, db: Session) -> User:
        ...

    def activate_user(self, user_id: int, db: Session):
        ...

    def deactivate_user(self, user_id: int, db: Session):
        ...
