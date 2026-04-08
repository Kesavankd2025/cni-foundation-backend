import { ObjectId } from "mongodb";
import { AppDataSource } from "../data-source";
import { Role } from "../entity/Role.Permission";

export async function getRoleCode(roleId: string | ObjectId): Promise<string> {
    if (!roleId) return "";
    const roleRepo = AppDataSource.getMongoRepository(Role);
    const role = await roleRepo.findOneBy({
        _id: new ObjectId(roleId),
        isDelete: 0
    });
    return role?.code || "";
}
