from fastapi import APIRouter, HTTPException, status

from schemas import LoginRequest, TokenResponse
from auth import authenticate_admin, create_access_token

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest):
    admin = authenticate_admin(request.email, request.password)

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token(
        data={"sub": admin["email"], "role": admin["role"]}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }