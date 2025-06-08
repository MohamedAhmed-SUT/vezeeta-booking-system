from beanie import init_beanie
from models.role_request import RoleRequest
from models.review import Review
from models.user import UserModel
from models.blacklist_token import BlacklistToken
from models.appointment import AppointmentModel
from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_CONNECTION_STRING


async def create_admin_user():
    admin_user = await UserModel.find_one(UserModel.email == "admin")
    if admin_user:
        return

    admin_user = UserModel(
        first_name="admin",
        last_name="admin",
        email="admin",
        role="admin",
        gender="male",
        image_url=None,
        hashed_password="$2b$12$BW3BYqtTPdWy/V6j4hMTYOJgZomIuqO3LQtJDp0YWZwITKY/8trl2",
        phone_number="01554339161",
        medical_history="",
        doctor_information=None,
    )

    await UserModel.save(admin_user)


async def start_beanie():
    client = AsyncIOMotorClient(MONGO_CONNECTION_STRING)
    await init_beanie(
        database=client.vezeeta,
        document_models=[
            UserModel,
            BlacklistToken,
            AppointmentModel,
            Review,
            RoleRequest,
        ],
    )
