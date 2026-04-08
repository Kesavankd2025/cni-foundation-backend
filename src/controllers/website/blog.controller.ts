// import {
//     JsonController,
//     Get,
//     Param,
//     Res,
//     QueryParams,
// } from "routing-controllers";
// import { Response } from "express";
// import { ObjectId } from "mongodb";
// import { StatusCodes } from "http-status-codes";

// import { AppDataSource } from "../../data-source";
// import response from "../../utils/response";
// import handleErrorResponse from "../../utils/commonFunction";
// import { Blog } from "../../entity/Blog";
// import { pagination } from "../../utils";

// @JsonController("/blog")
// export class WebsiteBlogController {
//     private blogRepository = AppDataSource.getMongoRepository(Blog);

//     // ✅ GET ALL ACTIVE BLOGS (WITH PAGINATION AND SEARCH) for website
//     @Get("/")
//     async listBlogs(
//         @QueryParams() query: any,
//         @Res() res: Response
//     ) {
//         try {
//             const page = Math.max(Number(query.page) || 0, 0);
//             let limit = Math.max(Number(query.limit) || 0, 0);

//             // Provide default limit if omitted
//             if (limit === 0) limit = 10;

//             const search = query.search?.toString();

//             // Only fetch active blogs for the website front-end
//             const match: any = {
//                 isDelete: 0,
//                 status: "Active"
//             };

//             if (search) {
//                 match.$or = [
//                     { title: { $regex: search, $options: "i" } },
//                     { description: { $regex: search, $options: "i" } },
//                 ];
//             }

//             const pipeline: any[] = [
//                 { $match: match },
//                 {
//                     $sort: {
//                         publishDate: -1,
//                         createdAt: -1,
//                     },
//                 },
//                 {
//                     $facet: {
//                         data: [
//                             { $skip: page * limit },
//                             { $limit: limit }
//                         ],
//                         meta: [{ $count: "total" }],
//                     },
//                 },
//             ];

//             const [result] = await Promise.all([
//                 this.blogRepository.aggregate(pipeline).toArray(),
//             ]);
//             const data = result[0]?.data || [];
//             const total = result[0]?.meta[0]?.total || 0;

//             return pagination(total, data, limit, page, res);
//         } catch (error) {
//             return handleErrorResponse(error, res);
//         }
//     }

//     // ✅ GET BLOG DETAILS for website
//     @Get("/:id")
//     async getBlogDetails(
//         @Param("id") id: string,
//         @Res() res: Response
//     ) {
//         try {
//             const blogId = new ObjectId(id);
//             const blog = await this.blogRepository.findOne({
//                 where: { _id: blogId, isDelete: 0, status: "Active" },
//             });

//             if (!blog) {
//                 return response(res, StatusCodes.NOT_FOUND, "Blog not found");
//             }

//             return response(
//                 res,
//                 StatusCodes.OK,
//                 "Blog details fetched successfully",
//                 blog
//             );
//         } catch (error) {
//             return handleErrorResponse(error, res);
//         }
//     }
// }

