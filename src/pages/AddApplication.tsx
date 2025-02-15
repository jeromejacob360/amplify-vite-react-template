import { TransferProgressEvent, uploadData } from "aws-amplify/storage";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import ProgressBar from "../components/ProgressBar";
import { client } from "../lib/amplify/client";

type ApplicantCount = "<10" | "10-20" | "20-40" | "40-80" | "80-100" | ">100";
type ApplicationStatus = "interviewScheduled" | "interviewed" | "accepted" | "rejected" | "noResponse"

interface AdditionalDocument {
    id: number;
    title: string;
    file?: FileList;
}

interface JobApplicationFormData {
    title: string;
    applicationStatus?: ApplicationStatus;
    description: string;
    // salaryRange?: string;
    numberOfApplicants: ApplicantCount;
    resume?: FileList;
    resumeUrl?: string;
    coverLetter?: boolean;
    coverLetterFile?: FileList;
    documents: AdditionalDocument[];
}

export default function JobApplicationForm() {

    const [documents, setDocuments] = useState<AdditionalDocument[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const { register, handleSubmit, watch, setValue, reset } = useForm<JobApplicationFormData>({
        defaultValues: { documents: [] },
    });

    const coverLetterChecked = watch("coverLetter");


    const onSubmit: SubmitHandler<JobApplicationFormData> = async (data) => {
        if (data.resume?.length) {
            let res;
            try {
                res = await uploadFileToS3(data.resume![0]);
                if (res?.path) {
                    data.resumeUrl = res.path;
                }
                setUploadProgress(0);
                setDocuments([]);
                // reset();

            } catch (error) {
                console.log("Error ", error);

            }
        }
        const responseFromDynamoDB = await client.models.JobApplication.create({
            jobTitle: data.title,
            jobDescription: data.description,
            numberOfApplicants: data.numberOfApplicants,
            resumeUrl: data.resumeUrl,
            coverLetterUrl: data.coverLetterFile?.[0].name
        });
        console.log("responseFromDynamoDB", responseFromDynamoDB);
    };

    const uploadFileToS3 = async (file: File) => {
        let result;
        try {
            result = await uploadData({
                path: (({ identityId }) => `resumes/${identityId}/${file.name}-${new Date().getTime()}`),
                data: file,
                options: {
                    onProgress: handleUploadProgress
                }
            }).result;
        } catch (error) {
            console.log("Error ", error);
        }

        return result;
    };

    function handleUploadProgress(progress: TransferProgressEvent) {
        const { transferredBytes, totalBytes } = progress;
        if (totalBytes) {
            const percent = Math.round((transferredBytes / totalBytes) * 100);
            setUploadProgress(percent);
        }
    }

    // Add new document field
    const addDocumentField = () => {
        setDocuments([...documents, { id: Date.now(), title: "", file: undefined }]);
    };

    // Remove document field
    const removeDocumentField = (id: number) => {
        const updatedDocs = documents.filter((doc) => doc.id !== id);
        setDocuments(updatedDocs);
        setValue("documents", updatedDocs);
    };

    return (
        <div className="form-container">
            <ProgressBar progress={uploadProgress} />
            <h2 className="text-xl font-semibold mb-4">Job Application</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="form space-y-4">
                {/* Job Title */}
                <div>
                    <label className="form-label">Job Title</label>
                    <input
                        type="text"
                        {...register("title", { required: true })}
                        className="input"
                    />
                </div>

                {/* Job Description */}
                <div>
                    <label className="form-label">Job Description</label>
                    <textarea
                        {...register("description", { required: true })}
                        className="input"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="form-label">Application Status</label>
                    <select {...register("applicationStatus")} className="select">
                        <option value="interviewScheduled">Interview scheduled</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="noResponse">No Response</option>
                    </select>
                </div>

                {/* Salary Range */}
                {/* <div>
                    <label className="form-label">Salary Range</label>
                    <input
                        type="number"
                        {...register("salaryRange", { min: 0, pattern: /0-9/ })}
                        className="input"
                    />
                </div> */}

                {/* Number of Applicants */}
                <div>
                    <label className="form-label">Number of Applicants</label>
                    <select {...register("numberOfApplicants")} className="select">
                        <option value="<10">Below 10</option>
                        <option value="10-20">10 to 20</option>
                        <option value="20-40">20 to 40</option>
                        <option value="40-80">40 to 80</option>
                        <option value="80-100">80 to 100</option>
                        <option value=">100">More than 100</option>
                    </select>
                </div>

                {/* Resume Upload */}
                <div>
                    <label className="form-label">Resume</label>
                    <input type="file" {...register("resume")} className="input" />
                </div>

                {/* Cover Letter Checkbox */}
                <div className="flex items-center">
                    <input id="coverLetter" type="checkbox" {...register("coverLetter")} className="mr-2" />
                    <label className="select-none" htmlFor="coverLetter">Include Cover Letter</label>
                </div>

                {/* Cover Letter Upload (Conditional) */}
                {coverLetterChecked && (
                    <div>
                        <label className="form-label">Upload Cover Letter</label>
                        <input type="file" {...register("coverLetterFile")} className="input" />
                    </div>
                )}

                {/* Additional Documents */}
                <div>
                    <button
                        type="button"
                        onClick={addDocumentField}
                        className="btn btn-primary"
                    >
                        Add Additional Document
                    </button>
                </div>

                {/* Document Fields in a Row */}
                {documents.map((doc, index) => (
                    <div key={doc.id} className="flex justify-items-center space-x-2 border border-gray-300 p-2 rounded-md mt-2">
                        {/* Document Title */}
                        <input
                            type="text"
                            placeholder="Document Title"
                            {...register(`documents.${index}.title` as const)}
                            className="w-1/3 p-2 border border-gray-300 rounded-md"
                        />
                        {/* File Upload */}
                        <input
                            type="file"
                            {...register(`documents.${index}.file` as const)}
                            className="w-1/3 p-2 border border-gray-300 rounded-md"
                        />
                        {/* Remove Button */}
                        <button
                            type="button"
                            onClick={() => removeDocumentField(doc.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                            Remove
                        </button>
                    </div>
                ))}

                {/* Submit Button */}
                <button type="submit" className="btn btn-submit w-full">
                    Submit Application
                </button>
            </form>
        </div>
    );
}
