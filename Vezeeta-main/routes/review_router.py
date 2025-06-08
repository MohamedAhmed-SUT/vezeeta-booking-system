from fastapi import APIRouter, Depends, HTTPException
from beanie import PydanticObjectId as ObjectId
from schemas.review import ReviewSchema
from core.security import get_current_user_instance
from models.user import UserModel
from models.review import Review

router = APIRouter()


@router.get("/{doctor_id}/allReviews", response_model=list[Review])
async def get_all_reviews(doctor_id: ObjectId):
    reviews = await Review.find(Review.doctor_id == doctor_id).to_list()
    return reviews


@router.post("/setReview", response_model=Review)
async def post_review(
    review: ReviewSchema,
    user_instance: UserModel = Depends(get_current_user_instance),
):
    review_model = Review(
        patient_id=user_instance.id,
        doctor_id=review.doctor_id,
        rating=review.rating,
        comment=review.comment,
        angry=review.angry,
    )

    doctor = await UserModel.get(review.doctor_id)
    if not doctor or doctor.role != "doctor":
        raise HTTPException(status_code=404, detail="Doctor not found")

    total_reviews = await Review.find(Review.doctor_id == review.doctor_id).count()
    current_total_rating = doctor.doctor_information.rating * total_reviews
    new_average_rating = (current_total_rating + review.rating) / (total_reviews + 1)

    doctor.doctor_information.rating = new_average_rating
    await doctor.save()

    result = await Review.insert_one(review_model)
    return result
