import {
    JsonController,
    Get,
    Res,
    QueryParams,
    Param
} from "routing-controllers";
import { AppDataSource } from "../../data-source";
import { Event } from "../../entity/Event";
import { Response } from "express";
import { ObjectId } from "mongodb";
import { StatusCodes } from "http-status-codes";
import { handleErrorResponse, pagination, response } from "../../utils";

@JsonController("/event")
export class WebsiteEventController {
    private eventRepository = AppDataSource.getMongoRepository(Event);

    @Get("/")
    async listEvents(
        @QueryParams() query: any,
        @Res() res: Response
    ) {
        try {
            const page = Math.max(Number(query.page) || 0, 0);
            let limit = Math.max(Number(query.limit) || 0, 0);

            // Provide default limit if omitted
            if (limit === 0) limit = 10;

            const match: any = {
                isDelete: 0,
                isActive: 1
            };

            const pipeline: any[] = [
                { $match: match },
                { $sort: { date: -1, createdAt: -1 } },
                {
                    $facet: {
                        data: [
                            ...(limit > 0 ? [{ $skip: page * limit }, { $limit: limit }] : [])
                        ],
                        meta: [{ $count: "total" }],
                    },
                },
            ];

            const result = await this.eventRepository.aggregate(pipeline).toArray();
            const data = result[0]?.data || [];
            const total = result[0]?.meta[0]?.total || 0;

            return pagination(total, data, limit, page, res);
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Get("/:id")
    async getEventDetails(
        @Param("id") id: string,
        @Res() res: Response
    ) {
        try {
            const event = await this.eventRepository.findOneBy({
                _id: new ObjectId(id),
                isDelete: 0,
                isActive: 1
            });

            if (!event) {
                return response(res, StatusCodes.NOT_FOUND, "Event not found");
            }

            return response(res, StatusCodes.OK, "Event details fetched", event);
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }
}
