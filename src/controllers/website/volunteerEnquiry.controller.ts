import {
    JsonController,
    Post,
    Body,
    Res,
} from "routing-controllers";
import { AppDataSource } from "../../data-source";
import { VolunteerEnquiry } from "../../entity/VolunteerEnquiry";
import { Response } from "express";

@JsonController("/volunteer-enquiry")
export class WebsiteVolunteerEnquiryController {
    private volunteerEnquiryRepository = AppDataSource.getMongoRepository(VolunteerEnquiry);

    @Post("/")
    async createVolunteerEnquiry(@Body() enquiryData: any, @Res() response: Response) {
        try {
            const {
                fullName,
                phoneNumber,
                email,
                location,
                areaOfInterest,
                availability,
                motivation
            } = enquiryData;

            const newEnquiry = this.volunteerEnquiryRepository.create({
                fullName,
                phoneNumber,
                email,
                location,
                areaOfInterest,
                availability,
                motivation,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDelete: 0,
            });

            await this.volunteerEnquiryRepository.save(newEnquiry);
            return response.status(201).json({ message: "Volunteer enquiry submitted successfully" });
        } catch (error) {
            console.error("Error submitting volunteer enquiry:", error);
            return response.status(500).json({ message: "Internal server error" });
        }
    }
}
