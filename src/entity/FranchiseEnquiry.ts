import {
    Entity,
    ObjectIdColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { ObjectId } from "mongodb";

@Entity()
export class FranchiseEnquiry {
    @ObjectIdColumn()
    id: ObjectId;

    // Applicant Information
    @Column()
    fullName: string;

    @Column({ nullable: true })
    dateOfBirth: Date;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    nationality: string;

    @Column()
    contactNumber: string;

    @Column()
    emailAddress: string;

    @Column({ nullable: true })
    currentResidentialAddress: string;

    @Column({ nullable: true })
    businessWebsite: string;

    // Business Background
    @Column({ nullable: true })
    currentOccupationBusiness: string;

    @Column({ nullable: true })
    companyNameIfApplicable: string;

    @Column({ nullable: true })
    numberOfYearsInBusiness: string;

    @Column({ nullable: true })
    numberOfEmployees: string;

    @Column({ nullable: true })
    educationalBackground: string;

    @Column({ nullable: true })
    industryExperience: string;

    // Franchise Project
    @Column({ nullable: true })
    proposedLocationForFranchise: string;

    @Column({ nullable: true })
    investmentBudgetApprox: string;

    @Column({ nullable: true })
    sourceOfInvestment: string;

    @Column({ nullable: true })
    reasonForInterestInFranchise: string;

    // Franchise Details
    @Column({ default: false })
    areYouAMember: boolean;

    @Column({ nullable: true })
    memberNameIdIfMember: string;

    @Column({ default: false })
    anyPreviousFranchiseExperience: boolean;

    @Column({ nullable: true })
    ifYesPleaseSpecify: string;

    // Reference & Support
    @Column({ nullable: true })
    referenceName: string;

    @Column({ nullable: true })
    referenceContact: string;

    @Column({ nullable: true })
    typeOfSupportExpectedFromFranchisor: string;

    // Undertakings
    @Column({ default: false })
    areYouFacingAnyLegalIssues: boolean;

    // Declaration
    @Column({ nullable: true })
    signatureName: string;

    @Column({ nullable: true })
    declarationDate: Date;

    // Standard fields for DB
    @Column({ default: 0 })
    isDelete: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
