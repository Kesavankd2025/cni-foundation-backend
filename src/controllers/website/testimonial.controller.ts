import {
    JsonController,
    Get,
    Res,
    QueryParams,
    Param
} from "routing-controllers";
import { AppDataSource } from "../../data-source";
import { Testimonial } from "../../entity/Testimonial";
import { Response } from "express";
import { ObjectId } from "mongodb";
import { StatusCodes } from "http-status-codes";
import { handleErrorResponse, pagination, response } from "../../utils";

@JsonController("/testimonial")
export class WebsiteTestimonialController {
    private testimonialRepository = AppDataSource.getMongoRepository(Testimonial);

    @Get("/")
    async listTestimonials(
        @QueryParams() query: any,
        @Res() res: Response
    ) {
        try {
            const page = Math.max(Number(query.page) || 0, 0);
            let limit = Math.max(Number(query.limit) || 0, 0);

            if (limit === 0) limit = 10;

            const match: any = {
                isDelete: 0,
                isActive: 1
            };

            const pipeline: any[] = [
                { $match: match },
                { $sort: { createdAt: -1 } },
                {
                    $facet: {
                        data: [
                            ...(limit > 0 ? [{ $skip: page * limit }, { $limit: limit }] : [])
                        ],
                        meta: [{ $count: "total" }],
                    },
                },
            ];

            const result = await this.testimonialRepository.aggregate(pipeline).toArray();
            const data = result[0]?.data || [];
            const total = result[0]?.meta[0]?.total || 0;

            return pagination(total, data, limit, page, res);
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Get("/:id")
    async getTestimonialDetails(
        @Param("id") id: string,
        @Res() res: Response
    ) {
        try {
            const testimonial = await this.testimonialRepository.findOneBy({
                _id: new ObjectId(id),
                isDelete: 0,
                isActive: 1
            });

            if (!testimonial) {
                return response(res, StatusCodes.NOT_FOUND, "Testimonial not found");
            }

            return response(res, StatusCodes.OK, "Testimonial details fetched", testimonial);
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }
}
