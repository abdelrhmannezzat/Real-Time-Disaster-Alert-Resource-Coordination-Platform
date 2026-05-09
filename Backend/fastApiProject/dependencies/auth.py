from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from config.database import get_db
from model import User
from utils import jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/v1/auth/login') # tokenurl is just for documentation


def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    # Decode jwt token to get payload
    payload = jwt.decode_access_token(token)

    # Fetch user's id from the payload
    current_user_email = payload.get("sub")

    # if the user's id is None then the payload is not correct
    if current_user_email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Payload is not valid'
        )

    # Query user from the database
    current_user = db.query(User).filter(User.email == current_user_email).first()

    # If user is not there raise an error
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is not Found"
        )
    return current_user


def require_roles(*allowed_roles):
    def checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Not enough permissions'
            )
        return current_user

    return checker
