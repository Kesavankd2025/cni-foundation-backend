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
import pagination from "../../utils/pagination";

import { Gallery } from "../../entity/Gallery";
import { CreateGalleryDto, UpdateGalleryDto } from "../../dto/admin/Gallery.dto";

interface RequestWithUser extends Request {
    user: AuthPayload;
}

@UseBefore(AuthMiddleware)
@JsonController("/gallery")
export class GalleryController {
    private galleryRepository = AppDataSource.getMongoRepository(Gallery);

    @Post("/")
    async createGallery(
        @Body() body: CreateGalleryDto,
        @Res() res: Response,
    ) {
        try {
            const gallery = this.galleryRepository.create({
                ...body,
                isDelete: 0,
            });

            const saved = await this.galleryRepository.save(gallery);

            return response(
                res,
                StatusCodes.CREATED,
                "Gallery created successfully",
                saved,
            );
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Get("/")
    async getAllGallery(@QueryParams() query: any, @Res() res: Response) {
        try {
            const page = Number(query.page ?? 0);
            const limit = Number(query.limit ?? 10);
            const search = query.search?.toString();

            const match: any = { isDelete: 0 };
            if (search) {
                match.title = { $regex: search, $options: "i" };
            }

            const pipeline: any[] = [
                { $match: match },
                { $sort: { createdAt: -1 } }
            ];

            if (limit > 0) {
                pipeline.push({ $skip: page * limit }, { $limit: limit });
            }

            const data = await this.galleryRepository.aggregate(pipeline).toArray();
            const totalCount = await this.galleryRepository.countDocuments(match);

            return pagination(totalCount, data, limit, page, res);
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Get("/:id")
    async getGalleryById(@Param("id") id: string, @Res() res: Response) {
        try {
            const data = await this.galleryRepository.findOneBy({
                _id: new ObjectId(id),
                isDelete: 0,
            });

            if (!data) {
                return response(res, StatusCodes.NOT_FOUND, "Gallery not found");
            }

            return response(res, StatusCodes.OK, "Gallery fetched successfully", data);
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Put("/:id")
    async updateGallery(
        @Param("id") id: string,
        @Body() body: UpdateGalleryDto,
        @Res() res: Response
    ) {
        try {
            const gallery = await this.galleryRepository.findOneBy({
                _id: new ObjectId(id),
                isDelete: 0,
            });

            if (!gallery) {
                return response(res, StatusCodes.NOT_FOUND, "Gallery not found");
            }

            await this.galleryRepository.update(new ObjectId(id), {
                ...body,
                updatedAt: new Date()
            });

            return response(res, StatusCodes.OK, "Gallery updated successfully");
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Delete("/:id")
    async deleteGallery(@Param("id") id: string, @Res() res: Response) {
        try {
            const gallery = await this.galleryRepository.findOneBy({
                _id: new ObjectId(id),
                isDelete: 0,
            });

            if (!gallery) {
                return response(res, StatusCodes.NOT_FOUND, "Gallery not found");
            }

            await this.galleryRepository.update(new ObjectId(id), {
                isDelete: 1,
                updatedAt: new Date()
            });

            return response(res, StatusCodes.OK, "Gallery deleted successfully");
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }
}
