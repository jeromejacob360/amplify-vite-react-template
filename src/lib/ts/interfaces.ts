// import { ApplicantCount, ApplicationStatus } from "./types";

export interface UploadedDocument {
    id?: number;
    title: string;
    file?: FileList
    fileUrl?: string;
}

// export interface JobApplicationFormData {
//     jobTitle: string;
//     jobDescription: string;
//     jobApplicationStatus?: ApplicationStatus;
//     numberOfApplicants: ApplicantCount;
//     resumeTitle: string;
//     resumeUrl: string;
//     coverLetter?: boolean;
//     coverLetterFile?: FileList;
//     documents: UploadedDocument[];
// }