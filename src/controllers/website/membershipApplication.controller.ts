// import {
//     JsonController,
//     Post,
//     Body,
//     Res,
//     Req,
//     UploadedFile,
// } from "routing-controllers";
// import { AppDataSource } from "../../data-source";
// import { MembershipApplication } from "../../entity/MembershipApplication";
// import { Response } from "express";

// @JsonController("/membership-application")
// export class WebsiteMembershipApplicationController {
//     private membershipAppRepository = AppDataSource.getMongoRepository(MembershipApplication);

//     @Post("/")
//     async createApplication(@Body() appData: any, @Res() response: Response) {
//         try {
//             const {
//                 name,
//                 emailId,
//                 companyName,
//                 mobileNo,
//                 positionInCompany,
//                 dateOfBirth,
//                 category,
//                 anniversary,
//                 website,
//                 yearsOfExperienceInBusiness,

//                 // Office Address fields
//                 doorNoNewNo,
//                 oldNo,
//                 street,
//                 area,
//                 city,
//                 state,
//                 pincode,

//                 // Office Use fields
//                 applicationNo,
//                 dateOfJoining,
//                 chapterName,
//                 location,
//                 regionName,
//                 referredBy,

//                 // Payment Details fields
//                 annualMembershipFee,
//                 paymentMode,
//                 paymentDate,
//                 transactionId,
//                 gstNo,
//                 panNo,

//                 passportPhotoUrl
//             } = appData;

//             const newApplication = this.membershipAppRepository.create({
//                 name,
//                 emailId,
//                 companyName,
//                 mobileNo,
//                 positionInCompany,
//                 dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
//                 category,
//                 anniversary: anniversary ? new Date(anniversary) : null,
//                 website,
//                 yearsOfExperienceInBusiness,

//                 officeAddress: {
//                     doorNoNewNo,
//                     oldNo,
//                     street,
//                     area,
//                     city,
//                     state,
//                     pincode
//                 },

//                 applicationNo,
//                 dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : null,
//                 chapterName,
//                 location,
//                 regionName,
//                 referredBy,

//                 annualMembershipFee,
//                 paymentMode,
//                 paymentDate: paymentDate ? new Date(paymentDate) : null,
//                 transactionId,
//                 gstNo,
//                 panNo,

//                 passportPhotoUrl,

//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//                 isDelete: 0,
//             });

//             await this.membershipAppRepository.save(newApplication);
//             return response.status(201).json({ message: "Membership application submitted successfully" });
//         } catch (error) {
//             console.error("Error submitting membership application:", error);
//             return response.status(500).json({ message: "Internal server error" });
//         }
//     }
// }
