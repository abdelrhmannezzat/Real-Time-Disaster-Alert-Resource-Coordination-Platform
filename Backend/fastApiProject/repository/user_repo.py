from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from config.database import get_db
from model import User
from schema.request.user_registration_request import UserRegistrationRequest
from utils.hashing import hash_password


class UserRepository:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def get_user_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()

    def add_user(self, user: UserRegistrationRequest) -> User:
        new_user = User(
            email=user.email,
            password_hash=hash_password(user.password),
            role=user.role
        )
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user

    def activate_user(self, user_id: int):
        user = self.db.query(User).filter(User.id == user_id).first()

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User is not found"
            )

        user.approved = True
        self.db.commit()
