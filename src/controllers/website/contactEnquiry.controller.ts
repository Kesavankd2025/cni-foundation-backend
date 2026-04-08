import {
    JsonController,
    Post,
    Body,
    Res,
} from "routing-controllers";
import { AppDataSource } from "../../data-source";
import { ContactEnquiry } from "../../entity/ContactEnquiry";
import { Response } from "express";

@JsonController("/contact-enquiry")
export class WebsiteContactEnquiryController {
    private contactEnquiryRepository = AppDataSource.getMongoRepository(ContactEnquiry);

    @Post("/")
    async createContactEnquiry(@Body() enquiryData: any, @Res() response: Response) {
        try {
            const {
                fullName,
                email,
                phoneNumber,
                subject,
                message
            } = enquiryData;

            if (!fullName || !email || !phoneNumber || !message) {
                return response.status(400).json({ message: "Required fields are missing" });
            }

            const newEnquiry = this.contactEnquiryRepository.create({
                fullName,
                email,
                phoneNumber,
                subject: subject || "",
                message,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDelete: 0,
            });

            await this.contactEnquiryRepository.save(newEnquiry);
            return response.status(201).json({ message: "Contact enquiry submitted successfully" });
        } catch (error) {
            console.error("Error submitting contact enquiry:", error);
            return response.status(500).json({ message: "Internal server error" });
        }
    }
}
