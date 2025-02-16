export type ApplicantCount = "<10" | "10-20" | "20-40" | "40-80" | "80-100" | ">100";
export type ApplicationStatus = "interviewScheduled" | "interviewed" | "accepted" | "rejected" | "noResponse"

export interface UploadedDocument {
    id?: number;
    title: string;
    file?: FileList
    fileUrl?: string;
}

export interface JobApplicationFormData {
    jobTitle: string;
    jobDescription: string;
    jobApplicationStatus?: ApplicationStatus;
    numberOfApplicants: ApplicantCount;
    resumeTitle: string;
    resumeUrl: string;
    coverLetter?: boolean;
    coverLetterFile?: FileList;
    documents: UploadedDocument[];
}