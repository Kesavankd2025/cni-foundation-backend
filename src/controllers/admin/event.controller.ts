import {
    JsonController,
    Get,
    Req,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Res,
    UseBefore,
} from "routing-controllers";
import { AppDataSource } from "../../data-source";
import { Event } from "../../entity/Event";
import { EventEnquiry } from "../../entity/EventEnquiry";
import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { handleErrorResponse, pagination, response } from "../../utils";
import { AuthMiddleware, AuthPayload } from "../../middlewares/AuthMiddleware";
import { StatusCodes } from "http-status-codes";

interface RequestWithUser extends Request {
    user: AuthPayload;
}

@JsonController("/event")
@UseBefore(AuthMiddleware)
export class EventController {
    private eventRepository = AppDataSource.getMongoRepository(Event);
    private eventEnquiryRepository = AppDataSource.getMongoRepository(EventEnquiry);

    @Get("/")
    async getAllEvents(@Req() req: Request, @Res() res: Response) {
        try {
            const page = Number(req.query.page ?? 0);
            const limit = Number(req.query.limit ?? 10);
            const search = req.query.search?.toString();

            const match: any = { isDelete: 0 };

            if (search) {
                match.$or = [
                    { title: { $regex: search, $options: "i" } },
                    { venue: { $regex: search, $options: "i" } },
                    { location: { $regex: search, $options: "i" } }
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

            const result = await this.eventRepository.aggregate(pipeline).toArray();

            const data = result[0]?.data ?? [];
            const total = result[0]?.meta[0]?.total ?? 0;

            return pagination(total, data, limit, page, res);
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Get("/:id")
    async getEventById(@Param("id") id: string, @Res() res: Response) {
        try {
            const event = await this.eventRepository.findOneBy({
                _id: new ObjectId(id),
                isDelete: 0
            });

            if (!event) {
                return response(res, StatusCodes.NOT_FOUND, "Event not found");
            }

            // Get enquiries for this event
            const enquiries = await this.eventEnquiryRepository.find({
                where: { eventId: new ObjectId(id), isDelete: 0 },
                order: { createdAt: -1 }
            });

            return response(res, StatusCodes.OK, "Event details fetched", { ...event, enquiries });
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Post("/")
    async createEvent(@Body() body: any, @Req() req: RequestWithUser, @Res() res: Response) {
        try {
            const newEvent = this.eventRepository.create({
                title: body.title,
                date: body.date ? new Date(body.date) : undefined,
                startTime: body.startTime,
                endTime: body.endTime,
                venue: body.location || body.venue,
                location: body.location,
                shortDescription: body.shortDescription,
                details: body.details || body.description,
                image: body.image || body.eventImage,
                isActive: 1,
                isDelete: 0,
                createdBy: new ObjectId(req.user.userId),
                updatedBy: new ObjectId(req.user.userId),
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const saved = await this.eventRepository.save(newEvent);
            return response(res, StatusCodes.CREATED, "Event created successfully", saved);
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Put("/:id")
    async updateEvent(
        @Param("id") id: string,
        @Body() body: any,
        @Req() req: RequestWithUser,
        @Res() res: Response
    ) {
        try {
            const event = await this.eventRepository.findOneBy({
                _id: new ObjectId(id),
                isDelete: 0
            });

            if (!event) {
                return response(res, StatusCodes.NOT_FOUND, "Event not found");
            }

            const updateData: any = {
                updatedAt: new Date(),
                updatedBy: new ObjectId(req.user.userId)
            };

            if (body.title !== undefined) updateData.title = body.title;
            if (body.date !== undefined) updateData.date = new Date(body.date);
            if (body.startTime !== undefined) updateData.startTime = body.startTime;
            if (body.endTime !== undefined) updateData.endTime = body.endTime;
            if (body.location !== undefined) {
                updateData.location = body.location;
                updateData.venue = body.location;
            }
            if (body.venue !== undefined) updateData.venue = body.venue;
            if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription;
            if (body.details !== undefined) updateData.details = body.details;
            if (body.description !== undefined) updateData.details = body.description;
            if (body.image !== undefined) updateData.image = body.image;
            if (body.eventImage !== undefined) updateData.image = body.eventImage;
            if (body.isActive !== undefined) updateData.isActive = body.isActive;

            await this.eventRepository.update(new ObjectId(id), updateData);
            return response(res, StatusCodes.OK, "Event updated successfully");
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Delete("/:id")
    async deleteEvent(@Param("id") id: string, @Res() res: Response) {
        try {
            const event = await this.eventRepository.findOneBy({
                _id: new ObjectId(id),
                isDelete: 0
            });

            if (!event) {
                return response(res, StatusCodes.NOT_FOUND, "Event not found");
            }

            await this.eventRepository.update(new ObjectId(id), {
                isDelete: 1,
                updatedAt: new Date()
            });

            return response(res, StatusCodes.OK, "Event deleted successfully");
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }
}
