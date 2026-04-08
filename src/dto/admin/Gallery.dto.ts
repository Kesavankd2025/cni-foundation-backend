import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray } from "class-validator";

export class CreateGalleryDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    type: string; // "Photo" | "Video"

    @IsOptional()
    @IsBoolean()
    isMultiple?: boolean;

    @IsOptional()
    @IsArray()
    media?: any[];

    @IsOptional()
    @IsString()
    about?: string;

    @IsOptional()
    @IsString()
    status?: string;
}

export class UpdateGalleryDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsBoolean()
    isMultiple?: boolean;

    @IsOptional()
    @IsArray()
    media?: any[];

    @IsOptional()
    @IsString()
    about?: string;

    @IsOptional()
    @IsString()
    status?: string;
}
