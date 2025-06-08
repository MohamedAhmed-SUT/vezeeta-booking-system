from typing import Annotated, Optional
from beanie import Document, Indexed
from pydantic import field_validator, Field, BaseModel
import phonenumbers

class DoctorModel(BaseModel):
    specialty: str
    experience: int
    price: int
    rating: float
    location: str
    waiting_time: int
    
class UserModel(Document):
    first_name: str
    last_name: str
    gender: str
    email: Annotated[str, Indexed(unique=True)]
    image_url: Optional[str] = None
    phone_number: Annotated[str, Indexed(unique=True)]
    medical_history: Optional[str] = None  
    hashed_password: str
    role: str = Field(default="patient")
    doctor_information: Optional[DoctorModel] = None
    disabled: bool = Field(default=False)
    valid_token: str = Field(default="")


    @field_validator("phone_number")
    def validate_phone_number(cls, v):

        try:
            parsed_number = phonenumbers.parse(v, "EG")
            if not phonenumbers.is_valid_number_for_region(parsed_number, "EG"):
                raise ValueError("Invalid phone number")
        except phonenumbers.phonenumberutil.NumberParseException as e:
            raise ValueError(f"Error parsing phone number: {e}")
        return phonenumbers.format_number(
            parsed_number, phonenumbers.PhoneNumberFormat.E164
        )