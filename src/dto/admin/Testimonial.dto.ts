import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";

export class CreateTestimonialDto {
    @IsString()
    @IsNotEmpty()
    customerName: string;

    @IsString()
    @IsNotEmpty()
    designation: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsOptional()
    image?: {
        fileName?: string;
        path?: string;
        originalName?: string;
    };

    @IsOptional()
    @IsNumber()
    isActive?: number;
}

export class UpdateTestimonialDto {
    @IsString()
    @IsOptional()
    customerName?: string;

    @IsString()
    @IsOptional()
    designation?: string;

    @IsString()
    @IsOptional()
    message?: string;

    @IsOptional()
    image?: {
        fileName?: string;
        path?: string;
        originalName?: string;
    };

    @IsOptional()
    @IsNumber()
    isActive?: number;
}
