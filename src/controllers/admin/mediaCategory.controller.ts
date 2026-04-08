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
import { MediaCategory } from "../../entity/MediaCategory";
import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { handleErrorResponse, pagination, response } from "../../utils";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { StatusCodes } from "http-status-codes";

@JsonController("/media-category")
@UseBefore(AuthMiddleware)
export class MediaCategoryController {
    private mediaCategoryRepository = AppDataSource.getMongoRepository(MediaCategory);

    @Get("/")
    async getAllCategories(@Req() req: Request, @Res() res: Response) {
        try {
            const categories = await this.mediaCategoryRepository.find({
                where: { isDelete: 0 },
                order: { createdAt: -1 }
            });
            return response(res, StatusCodes.OK, "Categories fetched successfully", categories);
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Post("/")
    async createCategory(@Body() body: any, @Res() res: Response) {
        try {
            if (!body.name) {
                return response(res, StatusCodes.BAD_REQUEST, "Category name is required");
            }

            const newCategory = this.mediaCategoryRepository.create({
                name: body.name,
                status: body.status || "Active",
                isDelete: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await this.mediaCategoryRepository.save(newCategory);
            return response(res, StatusCodes.CREATED, "Category created successfully", newCategory);
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Put("/:id")
    async updateCategory(@Param("id") id: string, @Body() body: any, @Res() res: Response) {
        try {
            const category = await this.mediaCategoryRepository.findOneBy({
                _id: new ObjectId(id),
                isDelete: 0
            });

            if (!category) {
                return response(res, StatusCodes.NOT_FOUND, "Category not found");
            }

            const updateData: any = { updatedAt: new Date() };
            if (body.name !== undefined) updateData.name = body.name;
            if (body.status !== undefined) updateData.status = body.status;

            await this.mediaCategoryRepository.update(new ObjectId(id), updateData);
            return response(res, StatusCodes.OK, "Category updated successfully");
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Delete("/:id")
    async deleteCategory(@Param("id") id: string, @Res() res: Response) {
        try {
            const category = await this.mediaCategoryRepository.findOneBy({
                _id: new ObjectId(id),
                isDelete: 0
            });

            if (!category) {
                return response(res, StatusCodes.NOT_FOUND, "Category not found");
            }

            await this.mediaCategoryRepository.update(new ObjectId(id), {
                isDelete: 1,
                updatedAt: new Date()
            });
            return response(res, StatusCodes.OK, "Category deleted successfully");
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }
}
