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
import { handleErrorResponse, pagination, response } from "../../utils";
import { CreateLeadershipTeamDto, UpdateLeadershipTeamDto } from "../../dto/admin/LeadershipTeam.dto";
import { LeadershipTeam } from "../../entity/LeadershipTeam";

interface RequestWithUser extends Request {
    user: AuthPayload;
}

@UseBefore(AuthMiddleware)
@JsonController("/leadership-team")
export class AdminLeadershipTeamController {
    private leadershipTeamRepository = AppDataSource.getMongoRepository(LeadershipTeam);

    @Post("/")
    async createMember(
        @Body() body: CreateLeadershipTeamDto,
        @Req() req: RequestWithUser,
        @Res() res: Response
    ) {
        try {
            const member = this.leadershipTeamRepository.create({
                name: body.name,
                roleId: body.roleId ? new ObjectId(body.roleId) : undefined,
                about: body.about,
                image: body.image,
                status: body.status || "Active",
                isDelete: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const savedMember = await this.leadershipTeamRepository.save(member);

            return response(
                res,
                StatusCodes.CREATED,
                "Leadership team member created successfully",
                savedMember
            );
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Get("/")
    async listMembers(
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
                    { name: { $regex: search, $options: "i" } },
                    { about: { $regex: search, $options: "i" } },
                ];
            }

            const pipeline: any[] = [
                { $match: match },
                {
                    $lookup: {
                        from: "leadership_role",
                        localField: "roleId",
                        foreignField: "_id",
                        as: "roleData"
                    }
                },
                {
                    $unwind: {
                        path: "$roleData",
                        preserveNullAndEmptyArrays: true
                    }
                },
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

            const result = await this.leadershipTeamRepository.aggregate(pipeline).toArray();
            const data = result[0]?.data || [];
            const total = result[0]?.meta[0]?.total || 0;

            return pagination(total, data, limit, page, res);
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Get("/:id")
    async getMemberDetails(
        @Param("id") id: string,
        @Req() req: RequestWithUser,
        @Res() res: Response
    ) {
        try {
            const memberId = new ObjectId(id);
            const member = await this.leadershipTeamRepository.findOne({
                where: { _id: memberId, isDelete: 0 },
            });

            if (!member) {
                return response(res, StatusCodes.NOT_FOUND, "Member not found");
            }

            return response(
                res,
                StatusCodes.OK,
                "Member details fetched successfully",
                member
            );
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Put("/:id")
    async updateMember(
        @Param("id") id: string,
        @Body() body: UpdateLeadershipTeamDto,
        @Req() req: RequestWithUser,
        @Res() res: Response
    ) {
        try {
            const memberId = new ObjectId(id);
            const member = await this.leadershipTeamRepository.findOneBy({
                _id: memberId,
                isDelete: 0,
            });

            if (!member) {
                return response(res, StatusCodes.NOT_FOUND, "Member not found");
            }

            const updateData: any = { updatedAt: new Date() };
            if (body.name !== undefined) updateData.name = body.name;
            if (body.roleId !== undefined) updateData.roleId = body.roleId ? new ObjectId(body.roleId) : null;
            if (body.about !== undefined) updateData.about = body.about;
            if (body.image !== undefined) updateData.image = body.image;
            if (body.status !== undefined) updateData.status = body.status;

            await this.leadershipTeamRepository.update(memberId, updateData);

            return response(
                res,
                StatusCodes.OK,
                "Member updated successfully"
            );
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Delete("/:id")
    async deleteMember(
        @Param("id") id: string,
        @Req() req: RequestWithUser,
        @Res() res: Response
    ) {
        try {
            const memberId = new ObjectId(id);
            const member = await this.leadershipTeamRepository.findOneBy({
                _id: memberId,
                isDelete: 0,
            });

            if (!member) {
                return response(res, StatusCodes.NOT_FOUND, "Member not found");
            }

            await this.leadershipTeamRepository.update(memberId, { isDelete: 1, updatedAt: new Date() });

            return response(res, StatusCodes.OK, "Member deleted successfully");
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }
}
