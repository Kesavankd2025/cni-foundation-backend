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
import { LeadershipRole } from "../../entity/LeadershipRole";
import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { handleErrorResponse, response } from "../../utils";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { StatusCodes } from "http-status-codes";

@JsonController("/leadership-role")
@UseBefore(AuthMiddleware)
export class LeadershipRoleController {
    private leadershipRoleRepository = AppDataSource.getMongoRepository(LeadershipRole);

    @Get("/")
    async getAllRoles(@Req() req: Request, @Res() res: Response) {
        try {
            const roles = await this.leadershipRoleRepository.find({
                where: { isDelete: 0 },
                order: { createdAt: -1 }
            });
            return response(res, StatusCodes.OK, "Leadership roles fetched successfully", roles);
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Post("/")
    async createRole(@Body() body: any, @Res() res: Response) {
        try {
            if (!body.name) {
                return response(res, StatusCodes.BAD_REQUEST, "Role name is required");
            }

            const newRole = this.leadershipRoleRepository.create({
                name: body.name,
                status: body.status || "Active",
                isDelete: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await this.leadershipRoleRepository.save(newRole);
            return response(res, StatusCodes.CREATED, "Leadership role created successfully", newRole);
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Put("/:id")
    async updateRole(@Param("id") id: string, @Body() body: any, @Res() res: Response) {
        try {
            const role = await this.leadershipRoleRepository.findOneBy({
                _id: new ObjectId(id),
                isDelete: 0
            });

            if (!role) {
                return response(res, StatusCodes.NOT_FOUND, "Role not found");
            }

            const updateData: any = { updatedAt: new Date() };
            if (body.name !== undefined) updateData.name = body.name;
            if (body.status !== undefined) updateData.status = body.status;

            await this.leadershipRoleRepository.update(new ObjectId(id), updateData);
            return response(res, StatusCodes.OK, "Leadership role updated successfully");
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Delete("/:id")
    async deleteRole(@Param("id") id: string, @Res() res: Response) {
        try {
            const role = await this.leadershipRoleRepository.findOneBy({
                _id: new ObjectId(id),
                isDelete: 0
            });

            if (!role) {
                return response(res, StatusCodes.NOT_FOUND, "Role not found");
            }

            await this.leadershipRoleRepository.update(new ObjectId(id), {
                isDelete: 1,
                updatedAt: new Date()
            });
            return response(res, StatusCodes.OK, "Leadership role deleted successfully");
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }
}
