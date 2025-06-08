from datetime import datetime, timedelta, timezone
from typing import List, Optional, cast

from fastapi import Depends, FastAPI, HTTPException
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel
from fastapi.security import OAuth2
from fastapi.security.utils import get_authorization_scheme_param
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, ValidationError
from starlette.requests import Request
from models.blacklist_token import BlacklistToken
from config import JWT_TOKEN_EXPIRY, JWT_SECRET, JWT_ALGORITHM


from core.exceptions import (
    CredentialsException,
    NotAuthenticatedException,
    NotEnoughPermissionsException,
    TokenBlackListedException,
)
from models.user import UserModel
from schemas.user import UserResponse


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenContent(BaseModel):
    email: str
    role: str


PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")


class OAuth2PasswordToken(OAuth2):
    def __init__(
        self,
        tokenUrl: str,
        scheme_name: Optional[str] = None,
        scopes: Optional[dict] = None,
    ):
        if not scopes:
            scopes = {}
        flows = OAuthFlowsModel(password={"tokenUrl": tokenUrl, "scopes": scopes})
        super().__init__(flows=flows, scheme_name=scheme_name, auto_error=False)

    async def __call__(self, request: Request) -> Optional[str]:
        authorization: str = request.headers.get("Authorization")
        scheme, param = get_authorization_scheme_param(authorization)
        if not authorization or scheme.lower() != "bearer":
            return None
        return cast(str, param)


OAUTH2_SCHEME = OAuth2PasswordToken(tokenUrl="/user/login")

app = FastAPI()


def verify_password(plain_password, hashed_password):
    return PWD_CONTEXT.verify(plain_password, hashed_password)


def get_password_hash(password):
    return PWD_CONTEXT.hash(password)


async def get_user_instance(email: Optional[str] = None) -> Optional[UserModel]:
    """Get a user instance from its email"""
    if email is not None:
        query = UserModel.email == email
    else:
        return None
    user = await UserModel.find_one(query)
    return user


async def authenticate_user(email: str, password: str) -> Optional[UserModel]:
    """Verify the email/Password pair against the DB content"""
    user = await get_user_instance(email=email)
    if user is None:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_access_token(user: UserModel) -> str:
    token_content = TokenContent(email=user.email, role=user.role)
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_TOKEN_EXPIRY)
    to_encode = {"exp": expire, "sub": token_content.model_dump_json()}

    encoded_jwt = jwt.encode(
        to_encode,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )
    return str(encoded_jwt)


async def add_token_to_blacklist(token: str):
    """Add a token to the blacklist"""
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
        )
    except JWTError:
        raise CredentialsException()

    try:
        token_content = datetime.fromtimestamp(payload.get("exp"))
    except ValidationError:
        raise CredentialsException()
    except Exception:
        raise CredentialsException()

    blacklist_token = BlacklistToken(token=token, expiry=token_content)
    await BlacklistToken.insert_one(blacklist_token)


async def is_token_blacklisted(token: str) -> bool:
    """Check if a token is in the blacklist"""
    blacklist_entry = await BlacklistToken.find_one(BlacklistToken.token == token)
    if blacklist_entry:
        if blacklist_entry.expiry < datetime.now():
            await BlacklistToken.find_one(BlacklistToken.token == token).delete(
                blacklist_entry
            )
            return False
        return True
    return False


async def get_current_user_instance(
    token: Optional[str] = Depends(OAUTH2_SCHEME),
) -> UserModel:
    """Decode the JWT and return the associated User"""
    if token is None:
        raise NotAuthenticatedException()

    if await is_token_blacklisted(token):
        raise TokenBlackListedException()

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
        )
    except JWTError:
        raise CredentialsException()

    try:
        token_content = TokenContent.model_validate_json(payload.get("sub"))
    except ValidationError:
        raise CredentialsException()

    user = await get_user_instance(email=token_content.email)
    if user is None:
        raise CredentialsException()
    return user


async def get_current_user_optional_instance(
    token: str = Depends(OAUTH2_SCHEME),
) -> Optional[UserModel]:
    try:
        user = await get_current_user_instance(token)
        return user
    except HTTPException:
        return None


async def get_current_user(
    user_instance: UserModel = Depends(get_current_user_instance),
    token: str = Depends(OAUTH2_SCHEME),
) -> UserResponse:
    return UserResponse(token=token, **user_instance.model_dump())


async def verify_token_contents(token: str, role: str) -> bool:
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
        )
    except JWTError:
        raise CredentialsException()

    try:
        token_content = TokenContent.model_validate_json(payload.get("sub"))
    except ValidationError:
        raise CredentialsException()

    if token_content.role != role:
        return False

    return True


class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    async def __call__(self, user: UserModel = Depends(get_current_user_instance)):
        if user.role in self.allowed_roles:
            return True
        raise NotEnoughPermissionsException()
