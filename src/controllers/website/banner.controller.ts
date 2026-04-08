import {
  JsonController,
  Get,
  Res,
  QueryParams,
} from "routing-controllers";
import { Response } from "express";
import { AppDataSource } from "../../data-source";
import { Banner } from "../../entity/Banner";
import handleErrorResponse from "../../utils/commonFunction";
import pagination from "../../utils/pagination";

@JsonController("/banner")
export class WebsiteBannerController {
  private bannerRepository = AppDataSource.getMongoRepository(Banner);

  // ✅ GET ALL ACTIVE BANNERS for website
  @Get("/")
  async listBanners(
    @QueryParams() query: any,
    @Res() res: Response
  ) {
    try {
      const page = Math.max(Number(query.page) || 0, 0);
      let limit = Math.max(Number(query.limit) || 0, 0);

      // Provide default limit if omitted
      if (limit === 0) limit = 10;

      // Only fetch active banners for the website front-end
      const match: any = {
        isDelete: 0,
        isActive: 1
      };

      const pipeline: any[] = [
        { $match: match },
        {
          $sort: {
            order: 1,
            createdAt: -1,
          },
        },
        {
          $facet: {
            data: [
              ...(limit > 0 ? [{ $skip: page * limit }, { $limit: limit }] : [])
            ],
            meta: [{ $count: "total" }],
          },
        },
      ];

      const result = await this.bannerRepository.aggregate(pipeline).toArray();
      const data = result[0]?.data || [];
      const total = result[0]?.meta[0]?.total || 0;

      return pagination(total, data, limit, page, res);
    } catch (error) {
      return handleErrorResponse(error, res);
    }
  }
}
