from contextlib import asynccontextmanager
from fastapi import FastAPI
from routes.review_router import router as review_router
from routes.user_router import router as user_router
from routes.role_request_router import router as request_role_router

from routes.appointment_router import router as appointment_router
from routes.doctor_router import router as doctor_router
from core.setup import start_beanie, create_admin_user

from starlette.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    await start_beanie()
    await create_admin_user()
    yield


app = FastAPI(
    lifespan=lifespan, swagger_ui_parameters={"syntaxHighlight.theme": "obsidian"}
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}


app.include_router(user_router, prefix="/user", tags=["User"])
app.include_router(doctor_router, prefix="/doctor", tags=["Doctors"])
app.include_router(appointment_router, prefix="/appointment", tags=["Appointment"])
app.include_router(review_router, prefix="/review", tags=["Review"])
app.include_router(request_role_router, prefix="/request", tags=["Request"])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
