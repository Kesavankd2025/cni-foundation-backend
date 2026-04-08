import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

export class CreateLeadershipTeamDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    roleId?: string;

    @IsOptional()
    @IsString()
    about?: string;

    @IsOptional()
    image?: any;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsNumber()
    isActive?: number;
}

export class UpdateLeadershipTeamDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    roleId?: string;

    @IsOptional()
    @IsString()
    about?: string;

    @IsOptional()
    image?: any;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsNumber()
    isActive?: number;
}
