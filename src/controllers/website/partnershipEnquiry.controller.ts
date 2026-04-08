import {
    JsonController,
    Post,
    Body,
    Res,
} from "routing-controllers";
import { AppDataSource } from "../../data-source";
import { PartnershipEnquiry } from "../../entity/PartnershipEnquiry";
import { Response } from "express";

@JsonController("/partnership-enquiry")
export class WebsitePartnershipEnquiryController {
    private partnershipEnquiryRepository = AppDataSource.getMongoRepository(PartnershipEnquiry);

    @Post("/")
    async createPartnershipEnquiry(@Body() enquiryData: any, @Res() response: Response) {
        try {
            const {
                fullName,
                phoneNumber,
                email,
                organizationName,
                partnershipType,
                proposal
            } = enquiryData;

            const newEnquiry = this.partnershipEnquiryRepository.create({
                fullName,
                phoneNumber,
                email,
                organizationName,
                partnershipType,
                proposal,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDelete: 0,
            });

            await this.partnershipEnquiryRepository.save(newEnquiry);
            return response.status(201).json({ message: "Partnership enquiry submitted successfully" });
        } catch (error) {
            console.error("Error submitting partnership enquiry:", error);
            return response.status(500).json({ message: "Internal server error" });
        }
    }
}
