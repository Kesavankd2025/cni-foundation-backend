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
import { CreateBlogDto, UpdateBlogDto } from "../../dto/admin/Blog.dto";
import { Blog } from "../../entity/Blog";
import { pagination } from "../../utils";

interface RequestWithUser extends Request {
    user: AuthPayload;
}

@UseBefore(AuthMiddleware)
@JsonController("/blog")
export class AdminBlogController {
    private blogRepository = AppDataSource.getMongoRepository(Blog);

    // ✅ CREATE MEDIA (BLOG)
    @Post("/")
    async createBlog(
        @Body() body: CreateBlogDto,
        @Req() req: RequestWithUser,
        @Res() res: Response
    ) {
        try {
            const blog = this.blogRepository.create({
                title: body.title,
                shortDescription: body.shortDescription,
                description: body.description,
                location: body.location,
                publishDate: body.publishDate ? new Date(body.publishDate) : undefined,
                startTime: body.startTime,
                endTime: body.endTime,
                categoryId: body.categoryId ? new ObjectId(body.categoryId) : undefined,
                slug: body.slug,
                metaTitle: body.metaTitle,
                metaDescription: body.metaDescription,
                metaKeywords: body.metaKeywords,
                status: body.status || "Active",
                image: body.image,
                isDelete: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const savedBlog = await this.blogRepository.save(blog);

            return response(
                res,
                StatusCodes.CREATED,
                "Media created successfully",
                savedBlog
            );
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    // ✅ GET ALL MEDIA (WITH PAGINATION AND SEARCH)
    @Get("/")
    async listBlogs(
        @QueryParams() query: any,
        @Req() req: RequestWithUser,
        @Res() res: Response
    ) {
        try {
            const page = Math.max(Number(query.page) || 0, 0);
            let limit = Math.max(Number(query.limit) || 0, 0);

            if (limit === 0) limit = 10;

            const search = query.search?.toString();
            const categoryId = query.categoryId;

            const match: any = {
                isDelete: 0,
            };

            if (search) {
                match.$or = [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                    { shortDescription: { $regex: search, $options: "i" } },
                    { location: { $regex: search, $options: "i" } },
                ];
            }

            if (categoryId) {
                match.categoryId = new ObjectId(categoryId);
            }

            const pipeline: any[] = [
                { $match: match },
                {
                    $lookup: {
                        from: "media_category",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
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

            const result = await this.blogRepository.aggregate(pipeline).toArray();
            const data = result[0]?.data || [];
            const total = result[0]?.meta[0]?.total || 0;

            return pagination(total, data, limit, page, res);
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    // ✅ GET MEDIA DETAILS
    @Get("/:id")
    async getBlogDetails(
        @Param("id") id: string,
        @Req() req: RequestWithUser,
        @Res() res: Response
    ) {
        try {
            const blogId = new ObjectId(id);
            const blog = await this.blogRepository.findOne({
                where: { _id: blogId, isDelete: 0 },
            });

            if (!blog) {
                return response(res, StatusCodes.NOT_FOUND, "Media not found");
            }

            return response(
                res,
                StatusCodes.OK,
                "Media details fetched successfully",
                blog
            );
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    // ✅ UPDATE MEDIA
    @Put("/:id")
    async updateBlog(
        @Param("id") id: string,
        @Body() body: UpdateBlogDto,
        @Req() req: RequestWithUser,
        @Res() res: Response
    ) {
        try {
            const blogId = new ObjectId(id);
            const blog = await this.blogRepository.findOneBy({
                _id: blogId,
                isDelete: 0,
            });

            if (!blog) {
                return response(res, StatusCodes.NOT_FOUND, "Media not found");
            }

            const updateData: any = { updatedAt: new Date() };
            if (body.title !== undefined) updateData.title = body.title;
            if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription;
            if (body.description !== undefined) updateData.description = body.description;
            if (body.location !== undefined) updateData.location = body.location;
            if (body.publishDate !== undefined) updateData.publishDate = new Date(body.publishDate);
            if (body.startTime !== undefined) updateData.startTime = body.startTime;
            if (body.endTime !== undefined) updateData.endTime = body.endTime;
            if (body.categoryId !== undefined) updateData.categoryId = body.categoryId ? new ObjectId(body.categoryId) : undefined;
            if (body.slug !== undefined) updateData.slug = body.slug;
            if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
            if (body.metaDescription !== undefined) updateData.metaDescription = body.metaDescription;
            if (body.metaKeywords !== undefined) updateData.metaKeywords = body.metaKeywords;
            if (body.status !== undefined) updateData.status = body.status;
            if (body.image !== undefined) updateData.image = body.image;

            await this.blogRepository.update(blogId, updateData);

            return response(
                res,
                StatusCodes.OK,
                "Media updated successfully"
            );
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    // ✅ DELETE MEDIA
    @Delete("/:id")
    async deleteBlog(
        @Param("id") id: string,
        @Req() req: RequestWithUser,
        @Res() res: Response
    ) {
        try {
            const blogId = new ObjectId(id);
            const blog = await this.blogRepository.findOneBy({
                _id: blogId,
                isDelete: 0,
            });

            if (!blog) {
                return response(res, StatusCodes.NOT_FOUND, "Media not found");
            }

            await this.blogRepository.update(blogId, { isDelete: 1, updatedAt: new Date() });

            return response(res, StatusCodes.OK, "Media deleted successfully");
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }
}
