from pydantic import BaseModel, Field
from beanie import PydanticObjectId as ObjectId
from typing import Optional


class ReviewSchema(BaseModel):
    doctor_id: ObjectId
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str]
    angry: Optional[bool]
