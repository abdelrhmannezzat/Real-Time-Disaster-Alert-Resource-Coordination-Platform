from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from config.database import get_db
from model import User
from repository.interfaces.user_repo_interface import IUserRepository
from schema.request.user_registration_request import UserRegistrationRequest
from utils.hashing import hash_password


class UserRepository(IUserRepository):
    def __init__(self):
        pass

    def get_user_by_email(self, email: str, db: Session) -> User | None:
        return db.query(User).filter(User.email == email).first()

    def add_user(self, user: UserRegistrationRequest, db: Session) -> User:
        new_user = User(
            email=user.email,
            password_hash=hash_password(user.password),
            role=user.role
        )
        db.add(new_user)
        db.flush()
        return new_user

    def activate_user(self, user_id: int, db: Session):
        user = db.query(User).filter(User.id == user_id).first()

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User is not found"
            )

        user.approved = True
        db.commit()

    def deactivate_user(self, user_id: int, db: Session):
        user = db.query(User).filter(User.id == user_id).first()

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User is not found"
            )

        user.approved = False
        db.commit()
