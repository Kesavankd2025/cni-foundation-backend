import {
    JsonController,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    Res,
    QueryParams,
    UseBefore,
    Req,
} from "routing-controllers";
import { Response, Request } from "express";
import { ObjectId } from "mongodb";
import { StatusCodes } from "http-status-codes";

import { AppDataSource } from "../../data-source";
import { AuthMiddleware, AuthPayload } from "../../middlewares/AuthMiddleware";
import response from "../../utils/response";
import handleErrorResponse from "../../utils/commonFunction";
import { CreateTestimonialDto, UpdateTestimonialDto } from "../../dto/admin/Testimonial.dto";
import { Testimonial } from "../../entity/Testimonial";
import { pagination } from "../../utils";

interface RequestWithUser extends Request {
    user: AuthPayload;
}

@UseBefore(AuthMiddleware)
@JsonController("/testimonial")
export class AdminTestimonialController {
    private testimonialRepository = AppDataSource.getMongoRepository(Testimonial);

    @Post("/")
    async createTestimonial(
        @Body() body: CreateTestimonialDto,
        @Req() req: RequestWithUser,
        @Res() res: Response
    ) {
        try {
            const testimonial = this.testimonialRepository.create({
                customerName: body.customerName,
                designation: body.designation,
                message: body.message,
                image: body.image,
                isActive: body.isActive !== undefined ? body.isActive : 1,
                isDelete: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const savedTestimonial = await this.testimonialRepository.save(testimonial);

            return response(
                res,
                StatusCodes.CREATED,
                "Testimonial created successfully",
                savedTestimonial
            );
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Get("/")
    async listTestimonials(
        @QueryParams() query: any,
        @Req() req: RequestWithUser,
        @Res() res: Response
    ) {
        try {
            const page = Math.max(Number(query.page) || 0, 0);
            let limit = Math.max(Number(query.limit) || 0, 0);

            if (limit === 0) limit = 10;

            const search = query.search?.toString();

            const match: any = {
                isDelete: 0,
            };

            if (search) {
                match.$or = [
                    { customerName: { $regex: search, $options: "i" } },
                    { designation: { $regex: search, $options: "i" } },
                ];
            }

            const pipeline: any[] = [
                { $match: match },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $facet: {
                        data: [
                            { $skip: page * limit },
                            { $limit: limit }
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
        @Req() req: RequestWithUser,
        @Res() res: Response
    ) {
        try {
            const testimonialId = new ObjectId(id);
            const testimonial = await this.testimonialRepository.findOne({
                where: { _id: testimonialId, isDelete: 0 },
            });

            if (!testimonial) {
                return response(res, StatusCodes.NOT_FOUND, "Testimonial not found");
            }

            return response(
                res,
                StatusCodes.OK,
                "Testimonial details fetched successfully",
                testimonial
            );
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Put("/:id")
    async updateTestimonial(
        @Param("id") id: string,
        @Body() body: UpdateTestimonialDto,
        @Req() req: RequestWithUser,
        @Res() res: Response
    ) {
        try {
            const testimonialId = new ObjectId(id);
            const testimonial = await this.testimonialRepository.findOneBy({
                _id: testimonialId,
                isDelete: 0,
            });

            if (!testimonial) {
                return response(res, StatusCodes.NOT_FOUND, "Testimonial not found");
            }

            const updateData: any = { updatedAt: new Date() };
            if (body.customerName !== undefined) updateData.customerName = body.customerName;
            if (body.designation !== undefined) updateData.designation = body.designation;
            if (body.message !== undefined) updateData.message = body.message;
            if (body.image !== undefined) updateData.image = body.image;
            if (body.isActive !== undefined) updateData.isActive = body.isActive;

            await this.testimonialRepository.update(testimonialId, updateData);

            return response(
                res,
                StatusCodes.OK,
                "Testimonial updated successfully"
            );
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Delete("/:id")
    async deleteTestimonial(
        @Param("id") id: string,
        @Req() req: RequestWithUser,
        @Res() res: Response
    ) {
        try {
            const testimonialId = new ObjectId(id);
            const testimonial = await this.testimonialRepository.findOneBy({
                _id: testimonialId,
                isDelete: 0,
            });

            if (!testimonial) {
                return response(res, StatusCodes.NOT_FOUND, "Testimonial not found");
            }

            await this.testimonialRepository.update(testimonialId, { isDelete: 1, updatedAt: new Date() });

            return response(res, StatusCodes.OK, "Testimonial deleted successfully");
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }
}
