// import {
//     JsonController,
//     Post,
//     Body,
//     Res,
//     Get,
//     Req,
//     Param
// } from "routing-controllers";
// import { AppDataSource } from "../../data-source";
// import { EventEnquiry } from "../../entity/EventEnquiry";
// import { Response, Request } from "express";
// import { ObjectId } from "mongodb";
// import { handleErrorResponse, pagination } from "../../utils";
// import { Event } from "../../entity/Event";

// @JsonController("/event-enquiry")
// export class WebsiteEventEnquiryController {
//     private eventEnquiryRepository = AppDataSource.getMongoRepository(EventEnquiry);
//     private eventRepository = AppDataSource.getMongoRepository(Event);

//     @Get("/events")
//     async getAllUpcomingEvents(@Req() req: Request, @Res() response: Response) {
//         try {
//             const page = Number(req.query.page ?? 0);
//             const limit = Number(req.query.limit ?? 10);
//             const search = req.query.search?.toString();

//             const currentDate = new Date();
//             currentDate.setHours(0, 0, 0, 0);
//             console.log(currentDate, "currentDate");

//             // Convert to ISO string for comparison as dates might be stored as strings in DB
//             const isoCurrentDate = currentDate.toISOString();

//             const match: any = {
//                 isDelete: 0,
//                 // $or: [
//                 //     { date: { $gte: currentDate } },
//                 //     { date: { $gte: isoCurrentDate } }
//                 // ]
//             };

//             if (search) {
//                 match.$and = [
//                     // { $or: [{ date: { $gte: currentDate } }, { date: { $gte: isoCurrentDate } }] },
//                     {
//                         $or: [
//                             { title: { $regex: search, $options: "i" } },
//                             { venue: { $regex: search, $options: "i" } }
//                         ]
//                     }
//                 ];
//                 // delete match.$or;
//             }

//             const pipeline: any[] = [
//                 { $match: match },
//                 { $sort: { createdAt: -1 } },
//                 {
//                     $facet: {
//                         data: [
//                             ...(limit > 0
//                                 ? [{ $skip: page * limit }, { $limit: limit }]
//                                 : [])
//                         ],
//                         meta: [{ $count: "total" }]
//                     }
//                 }
//             ];

//             const result = await this.eventRepository.aggregate(pipeline).toArray();

//             const data = result[0]?.data ?? [];
//             const total = result[0]?.meta[0]?.total ?? 0;

//             return pagination(total, data, limit, page, response);
//         } catch (error) {
//             return handleErrorResponse(error, response);
//         }
//     }

//     @Get("/events/:id")
//     async getEventById(@Param("id") id: string, @Res() response: Response) {
//         try {
//             const event = await this.eventRepository.findOneBy({
//                 _id: new ObjectId(id),
//                 isDelete: 0
//             });

//             if (!event) {
//                 return response.status(404).json({ message: "Event not found" });
//             }

//             return response.status(200).json(event);
//         } catch (error) {
//             console.error(error);
//             return response.status(500).json({ message: "Internal server error" });
//         }
//     }

//     @Post("/")
//     async createEnquiry(@Body() enquiryData: any, @Res() response: Response) {
//         try {
//             const {
//                 name,
//                 email,
//                 phone,
//                 message,
//                 companyName,
//                 category,
//                 address,
//                 invitedBy,
//                 interestToBecomeMember,
//                 experienceInMeeting,
//                 eventId
//             } = enquiryData;

//             const newEnquiry = this.eventEnquiryRepository.create({
//                 name,
//                 email,
//                 phone,
//                 message,
//                 companyName,
//                 category,
//                 address,
//                 invitedBy,
//                 interestToBecomeMember,
//                 experienceInMeeting,
//                 eventId: eventId ? new ObjectId(eventId) : null,
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//                 isDelete: 0,
//             });

//             await this.eventEnquiryRepository.save(newEnquiry);
//             return response.status(201).json({ message: "Enquiry submitted successfully" });
//         } catch (error) {
//             console.error(error);
//             return response.status(500).json({ message: "Internal server error" });
//         }
//     }
// }
