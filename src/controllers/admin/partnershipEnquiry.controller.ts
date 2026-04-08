import {
    JsonController,
    Get,
    Res,
    Req,
    UseBefore,
    Param,
} from "routing-controllers";
import { ObjectId } from "mongodb";
import { AppDataSource } from "../../data-source";
import { PartnershipEnquiry } from "../../entity/PartnershipEnquiry";
import { Response, Request } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { handleErrorResponse, pagination } from "../../utils";

@JsonController("/partnership-enquiry")
@UseBefore(AuthMiddleware)
export class AdminPartnershipEnquiryController {
    private partnershipEnquiryRepository = AppDataSource.getMongoRepository(PartnershipEnquiry);

    @Get("/")
    async getAllEnquiries(@Req() req: Request, @Res() response: Response) {
        try {
            const page = Number(req.query.page ?? 0);
            const limit = Number(req.query.limit ?? 10);
            const search = req.query.search?.toString();

            const match: any = { isDelete: 0 };

            if (search) {
                match.$or = [
                    { fullName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { phoneNumber: { $regex: search, $options: "i" } },
                    { organizationName: { $regex: search, $options: "i" } }
                ];
            }

            const pipeline: any[] = [
                { $match: match },
                { $sort: { createdAt: -1 } },
                {
                    $facet: {
                        data: [
                            ...(limit > 0
                                ? [{ $skip: page * limit }, { $limit: limit }]
                                : [])
                        ],
                        meta: [{ $count: "total" }]
                    }
                }
            ];

            const result = await this.partnershipEnquiryRepository.aggregate(pipeline).toArray();

            const data = result[0]?.data ?? [];
            const total = result[0]?.meta[0]?.total ?? 0;

            return pagination(total, data, limit, page, response);
        } catch (error) {
            return handleErrorResponse(error, response);
        }
    }

    @Get("/:id")
    async getEnquiryById(@Param("id") id: string, @Res() response: Response) {
        try {
            const enquiry = await this.partnershipEnquiryRepository.findOneBy({
                _id: new ObjectId(id),
                isDelete: 0
            });

            if (!enquiry) {
                return response.status(404).json({ message: "Partnership enquiry not found" });
            }

            return response.status(200).json({ data: enquiry, message: "Partnership enquiry fetched successfully" });
        } catch (error) {
            return handleErrorResponse(error, response);
        }
    }
}
