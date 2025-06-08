from pydantic import SecretStr, BaseModel
from models.user import DoctorModel
from beanie import PydanticObjectId as ObjectId


class UserSchema(BaseModel):
    first_name: str
    last_name: str
    gender: str
    email: str
    image_url: str
    role: str
    password: SecretStr
    phone_number: str
    medical_history: str
    doctor_information: DoctorModel

class LoginUserSchema(BaseModel):
    email: str
    password: SecretStr


class UserResponse(BaseModel):
    id: ObjectId
    token: str
    email: str
    role: str
    first_name: str
    last_name: str
    phone_number: str
    image_url: str

class DoctorSchema(BaseModel):
    role: str = "doctor"
    specialty: str
    price: float
    experience: int
    rating: float
    location: str
    waiting_time: int

class DoctorUserResponse(BaseModel):
    id: ObjectId
    first_name: str
    last_name: str
    gender: str
    email: str
    image_url: str
    phone_number: str
    role: str
    medical_history: str
    disabled: bool
    doctor_information: DoctorModel
