import {
    JsonController,
    Post,
    Body,
    Res,
} from "routing-controllers";
import { AppDataSource } from "../../data-source";
import { InternshipEnquiry } from "../../entity/InternshipEnquiry";
import { Response } from "express";

@JsonController("/internship-enquiry")
export class WebsiteInternshipEnquiryController {
    private internshipEnquiryRepository = AppDataSource.getMongoRepository(InternshipEnquiry);

    @Post("/")
    async createInternshipEnquiry(@Body() enquiryData: any, @Res() response: Response) {
        try {
            const {
                fullName,
                phoneNumber,
                email,
                college,
                course,
                areaOfInterest,
                resumeLink,
                motivation
            } = enquiryData;

            const newEnquiry = this.internshipEnquiryRepository.create({
                fullName,
                phoneNumber,
                email,
                college,
                course,
                areaOfInterest,
                resumeLink,
                motivation,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDelete: 0,
            });

            await this.internshipEnquiryRepository.save(newEnquiry);
            return response.status(201).json({ message: "Internship enquiry submitted successfully" });
        } catch (error) {
            console.error("Error submitting internship enquiry:", error);
            return response.status(500).json({ message: "Internal server error" });
        }
    }
}
