from fastapi import HTTPException, status


class NotFoundException(HTTPException):
    def __init__(self, message: str) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{message} not found",
        )

    def __repr__(self):
        return f"{self.message}NotFoundException"


class UnprocessableEntityException(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Request body invalid",
        )

    def __repr__(self):
        return f"UnprocessableEntityException"


class NotAuthenticatedException(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Token"},
        )


class CredentialsException(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Token"},
        )


class TokenBlackListedException(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been blacklisted",
            headers={"WWW-Authenticate": "Token"},
        )


class InvalidCredentialsException(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Token"},
        )


class DuplicateCredentialsException(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="duplicate email",
            headers={"WWW-Authenticate": "Token"},
        )


class NotEnoughPermissionsException(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You don't have enough permissions",
            headers={"WWW-Authenticate": "Token"},
        )
