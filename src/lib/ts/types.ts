import { Schema } from "../../../amplify/data/resource";

export type ApplicantCount = "<10" | "10-20" | "20-40" | "40-80" | "80-100" | ">100";
export type ApplicationStatus = "interviewScheduled" | "interviewed" | "accepted" | "rejected" | "noResponse"


export type JobApplication = Schema["JobApplication"]["type"];