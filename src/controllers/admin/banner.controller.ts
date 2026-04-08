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

import { Banner } from "../../entity/Banner";

interface RequestWithUser extends Request {
  user: AuthPayload;
}

@UseBefore(AuthMiddleware)
@JsonController("/banner")
export class BannerController {
  private bannerRepository = AppDataSource.getMongoRepository(Banner);
  @Post("/")
  async createBanner(
    @Body() body: any,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      const banner = new Banner();
      banner.title = body.title;
      banner.subTitle = body.subTitle;
      banner.buttonLink = body.buttonLink;
      banner.bannerImage = body.bannerImage;
      banner.isActive = body.isActive ?? 1;
      banner.link = body.link || body.buttonLink;
      banner.expiryDate = body.expiryDate ? new Date(body.expiryDate) : undefined;
      banner.isDelete = 0;

      const lastBanner = await this.bannerRepository
        .aggregate([
          { $match: { isDelete: 0 } },
          { $sort: { order: -1 } },
          { $limit: 1 },
        ])
        .toArray();

      banner.order =
        lastBanner.length > 0 ? (lastBanner[0].order || 0) + 1 : 1;

      banner.createdBy = new ObjectId(req.user.userId);
      banner.updatedBy = new ObjectId(req.user.userId);

      const saved = await this.bannerRepository.save(banner);

      return response(
        res,
        StatusCodes.CREATED,
        "Banner image added successfully",
        saved,
      );
    } catch (error) {
      return handleErrorResponse(error, res);
    }
  }
  @Get("/")
  async getAllBanners(@QueryParams() query: any, @Res() res: Response) {
    try {
      const page = Number(query.page ?? 0);
      const limit = Number(query.limit ?? 10);

      const match = { isDelete: 0 };

      const pipeline: any[] = [{ $match: match }, { $sort: { order: 1 } }];

      if (limit > 0) {
        pipeline.push({ $skip: page * limit }, { $limit: limit });
      }

      const banners = await this.bannerRepository
        .aggregate(pipeline)
        .toArray();

      const totalCount = await this.bannerRepository.countDocuments(match);

      return pagination(totalCount, banners, limit, page, res);
    } catch (error) {
      return handleErrorResponse(error, res);
    }
  }

  @Get("/:id")
  async getBannerById(@Param("id") id: string, @Res() res: Response) {
    try {
      const banner = await this.bannerRepository.findOneBy({
        _id: new ObjectId(id),
        isDelete: 0,
      });

      if (!banner) {
        return response(res, StatusCodes.NOT_FOUND, "Banner not found");
      }

      return response(
        res,
        StatusCodes.OK,
        "Banner data fetched successfully",
        banner
      );
    } catch (error) {
      return handleErrorResponse(error, res);
    }
  }

  @Delete("/:id")
  async deleteBanner(@Param("id") id: string, @Res() res: Response) {
    try {
      const banner = await this.bannerRepository.findOneBy({
        _id: new ObjectId(id),
        isDelete: 0,
      });

      if (!banner) {
        return response(res, StatusCodes.NOT_FOUND, "Banner not found");
      }

      banner.isDelete = 1;

      await this.bannerRepository.save(banner);

      return response(res, StatusCodes.OK, "Banner deleted successfully");
    } catch (error) {
      return handleErrorResponse(error, res);
    }
  }

  @Put("/update-order")
  async updateBannerOrder(@Body() body: any, @Res() res: Response) {
    try {
      const { banners } = body;

      if (!banners || !Array.isArray(banners)) {
        return response(
          res,
          StatusCodes.BAD_REQUEST,
          "Invalid data format. Expected an array of banners with id and order.",
        );
      }

      for (const item of banners) {
        if (item.id && typeof item.order === "number") {
          await this.bannerRepository.update(
            { _id: new ObjectId(item.id) },
            { order: item.order }
          );
        }
      }

      return response(res, StatusCodes.OK, "Banner order updated successfully");
    } catch (error) {
      return handleErrorResponse(error, res);
    }
  }

  @Put("/:id")
  async updateBanner(
    @Param("id") id: string,
    @Body() body: any,
    @Req() req: RequestWithUser,
    @Res() res: Response
  ) {
    try {
      const banner = await this.bannerRepository.findOneBy({
        _id: new ObjectId(id),
        isDelete: 0,
      });

      if (!banner) {
        return response(res, StatusCodes.NOT_FOUND, "Banner not found");
      }

      if (body.title !== undefined) banner.title = body.title;
      if (body.subTitle !== undefined) banner.subTitle = body.subTitle;
      if (body.buttonLink !== undefined) banner.buttonLink = body.buttonLink;
      if (body.bannerImage) banner.bannerImage = body.bannerImage;
      if (body.isActive !== undefined) banner.isActive = body.isActive;
      if (body.link !== undefined) banner.link = body.link;
      if (body.buttonLink !== undefined) banner.link = body.buttonLink;
      if (body.expiryDate !== undefined) {
        banner.expiryDate = body.expiryDate ? new Date(body.expiryDate) : null;
      }

      banner.updatedBy = new ObjectId(req.user.userId);

      const saved = await this.bannerRepository.save(banner);

      return response(
        res,
        StatusCodes.OK,
        "Banner updated successfully",
        saved
      );
    } catch (error) {
      return handleErrorResponse(error, res);
    }
  }
}
