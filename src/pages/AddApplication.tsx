import { TransferProgressEvent, uploadData } from "aws-amplify/storage";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import ProgressBar from "../components/ProgressBar";
import { client } from "../lib/amplify/client";
import { UploadedDocument } from "../interfaces/application";
import type { Schema } from "../../amplify/data/resource";

export default function JobApplicationForm() {

    const [documents, setDocuments] = useState<UploadedDocument[]>([]);
    const [resumeFile, setResumeFile] = useState<File>();
    const [coverLetterFile, setCoverLetterFile] = useState<File>();
    const [uploadProgress, setUploadProgress] = useState(0);

    const { register, handleSubmit, watch, setValue, reset } = useForm<Schema["JobApplication"]["type"]>();

    // const coverLetterChecked = watch("coverLetter");

    const onSubmit: SubmitHandler<Schema["JobApplication"]["type"]> = async (data) => {
        if (resumeFile) {
            let res;
            try {
                res = await uploadFileToS3(resumeFile);
                if (res?.path) {
                    data.resumeUrl = res.path;
                    data.resumeFilename = resumeFile.name;
                }
                setUploadProgress(0);
                setResumeFile(undefined);
            } catch (error) {
                console.error("Error ", error);
            }
        }
        try {
            await client.models.JobApplication.create(data);
            reset();
        } catch (error) {
            console.error("Error saving to DynamoDB", error);
        }
    };

    const uploadFileToS3 = async (file: File) => {
        let result;
        try {
            result = await uploadData({
                path: (({ identityId }) => `files/${identityId}/resumes/${Date.now()}/${file.name}`),
                data: file,
                options: {
                    onProgress: handleUploadProgress
                }
            }).result;
        } catch (error) {
            console.error("Error ", error);
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
        setDocuments([...documents, { id: Date.now(), title: "", file: undefined, fileUrl: "" }]);
    };

    // // Remove document field
    // const removeDocumentField = (id: number) => {
    //     const updatedDocs = documents.filter((doc) => doc.id !== id);
    //     setDocuments(updatedDocs);
    //     setValue("documents", updatedDocs);
    // };

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
                        {...register("jobTitle", { required: true })}
                        className="input"
                    />
                </div>

                {/* Job Description */}
                <div>
                    <label className="form-label">Job Description</label>
                    <textarea
                        {...register("jobDescription", { required: true })}
                        className="input"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="form-label">Application Status</label>
                    <select {...register("status")} className="select">
                        <option value="interviewScheduled">Interview scheduled</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="noResponse">No Response</option>
                    </select>
                </div>

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
                    <input type="file" onChange={(e) => {
                        if (e.target.files?.length) {
                          setResumeFile(e.target.files[0]);
                        }
                    }} className="input" />
                </div>

                {/* Cover Letter Upload (Conditional) */}
                <div>
                    <label className="form-label">Upload Cover Letter</label>
                    <input type="file" onChange={(e) => {
                        if (e.target.files?.length) {
                            setCoverLetterFile(e.target.files[0]);
                        }
                    }}
                        className="input" />
                </div>

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
                        {/* <input
                            type="text"
                            placeholder="Document Title"
                            {...register(`documents.${index}.title` as const)}
                            className="w-1/3 p-2 border border-gray-300 rounded-md"
                        /> */}
                        {/* File Upload */}
                        {/* <input
                            type="file"
                            {...register(`documents.${index}.file` as const)}
                            className="w-1/3 p-2 border border-gray-300 rounded-md"
                        /> */}
                        {/* Remove Button */}
                        {/* <button
                            type="button"
                            onClick={() => removeDocumentField(doc.id!)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                            Remove
                        </button> */}
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
