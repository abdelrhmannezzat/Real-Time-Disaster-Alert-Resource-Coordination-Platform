from pydantic import BaseModel


class UserLoginRequest(BaseModel):
    email: str
    password: str

    class Config:
        from_attributes = True
