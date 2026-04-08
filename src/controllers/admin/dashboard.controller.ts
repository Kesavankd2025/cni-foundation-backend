import {
    JsonController,
    UseBefore,
    Get,
    Res,
} from "routing-controllers";
import { Response } from "express";
import { AppDataSource } from "../../data-source";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { Role } from "../../entity/Role.Permission";
import { AdminUser } from "../../entity/AdminUser";
import { MediaCategory } from "../../entity/MediaCategory";
import { LeadershipRole } from "../../entity/LeadershipRole";
import { LeadershipTeam } from "../../entity/LeadershipTeam";
import { VolunteerEnquiry } from "../../entity/VolunteerEnquiry";
import { PartnershipEnquiry } from "../../entity/PartnershipEnquiry";
import { InternshipEnquiry } from "../../entity/InternshipEnquiry";
import { ContactEnquiry } from "../../entity/ContactEnquiry";
import { Banner } from "../../entity/Banner";
import { Blog } from "../../entity/Blog";
import { Gallery } from "../../entity/Gallery";
import { Testimonial } from "../../entity/Testimonial";
import response from "../../utils/response";
import { handleErrorResponse } from "../../utils";
import { StatusCodes } from "http-status-codes";

@UseBefore(AuthMiddleware)
@JsonController("/dashboard-apis")
export class DashBoardController {
    private roleRepo = AppDataSource.getMongoRepository(Role);
    private adminRepo = AppDataSource.getMongoRepository(AdminUser);
    private mediaCatRepo = AppDataSource.getMongoRepository(MediaCategory);
    private leaderRoleRepo = AppDataSource.getMongoRepository(LeadershipRole);
    private leaderTeamRepo = AppDataSource.getMongoRepository(LeadershipTeam);
    private volunteerRepo = AppDataSource.getMongoRepository(VolunteerEnquiry);
    private partnershipRepo = AppDataSource.getMongoRepository(PartnershipEnquiry);
    private internshipRepo = AppDataSource.getMongoRepository(InternshipEnquiry);
    private contactRepo = AppDataSource.getMongoRepository(ContactEnquiry);
    private bannerRepo = AppDataSource.getMongoRepository(Banner);
    private blogRepo = AppDataSource.getMongoRepository(Blog);
    private galleryRepo = AppDataSource.getMongoRepository(Gallery);
    private testimonialRepo = AppDataSource.getMongoRepository(Testimonial);

    @Get("/stats")
    async getStats(@Res() res: Response) {
        try {
            const [
                roleCount,
                adminCount,
                mediaCategoryCount,
                leadershipRoleCount,
                leadershipTeamCount,
                volunteerCount,
                partnershipCount,
                internshipCount,
                contactCount,
                bannerCount,
                blogCount,
                galleryCount,
                testimonialCount
            ] = await Promise.all([
                this.roleRepo.countDocuments({ isDelete: 0 }),
                this.adminRepo.countDocuments({ isDelete: 0 }),
                this.mediaCatRepo.countDocuments({ isDelete: 0 }),
                this.leaderRoleRepo.countDocuments({ isDelete: 0 }),
                this.leaderTeamRepo.countDocuments({ isDelete: 0 }),
                this.volunteerRepo.countDocuments({ isDelete: 0 }),
                this.partnershipRepo.countDocuments({ isDelete: 0 }),
                this.internshipRepo.countDocuments({ isDelete: 0 }),
                this.contactRepo.countDocuments({ isDelete: 0 }),
                this.bannerRepo.countDocuments({ isDelete: 0 }),
                this.blogRepo.countDocuments({ isDelete: 0 }),
                this.galleryRepo.countDocuments({ isDelete: 0 }),
                this.testimonialRepo.countDocuments({ isDelete: 0 })
            ]);

            const data = {
                roleCount,
                adminCount,
                mediaCategoryCount,
                leadershipRoleCount,
                leadershipTeamCount,
                volunteerCount,
                partnershipCount,
                internshipCount,
                contactCount,
                bannerCount,
                blogCount,
                galleryCount,
                testimonialCount
            };

            return response(res, StatusCodes.OK, "Stats fetched successfully", data);
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Get("/activities")
    async getActivities(@Res() res: Response) {
        try {
            return response(res, StatusCodes.OK, "Activities fetched successfully", {});
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }

    @Get("/star-achievements")
    async starAchievements(@Res() res: Response) {
        try {
            return response(res, StatusCodes.OK, "Achievements fetched", {});
        } catch (error) {
            return handleErrorResponse(error, res);
        }
    }
}
