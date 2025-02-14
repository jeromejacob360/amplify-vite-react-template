// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { uploadData } from 'aws-amplify/storage';
// import { useState } from 'react'
// import ProgressBar from '../components/ProgressBar';

// const AddApplication = () => {
//     const [progress, setProgress] = useState(0);
//     const [file, setFile] = useState({} as any);

//     const handleChange = (event: any) => {
//         setFile(event.target.files?.[0]);
//     };


//     const handleClick = () => {
//         if (!file) {
//             return;
//         }
//         try {
//             uploadData({
//                 path: `pictures/${file?.name}`,
//                 data: file,
//                 options: {

//                     onProgress: (progress) => {
//                         const { transferredBytes, totalBytes } = progress;
//                         if (totalBytes) {
//                             const percent = Math.round((transferredBytes / totalBytes) * 100);
//                             setProgress(percent);
//                         }
//                     },
//                 }
//             });

//         } catch (e) {
//             console.log("Error ", e);
//         }
//     };
//     return (
//         <div>
//             <ProgressBar progress={progress} />
//             <input type="file" onChange={handleChange} />
//             <button onClick={handleClick}>Upload</button>
//         </div>
//     )
// }

// export default AddApplication


import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type ApplicantCount = "<10" | "10-20" | "20-40" | "40-80" | "80-100" | ">100";

interface AdditionalDocument {
    id: number;
    title: string;
    file?: FileList;
}

interface JobApplicationFormData {
    title: string;
    description: string;
    salary?: string;
    postedDate?: string;
    applicants: ApplicantCount;
    resume?: FileList;
    coverLetter?: boolean;
    coverLetterFile?: FileList;
    documents: AdditionalDocument[];
}

export default function JobApplicationForm() {
    const { register, handleSubmit, watch, setValue } = useForm<JobApplicationFormData>({
        defaultValues: { documents: [] },
    });

    const [documents, setDocuments] = useState<AdditionalDocument[]>([]);
    const coverLetterChecked = watch("coverLetter");

    const onSubmit: SubmitHandler<JobApplicationFormData> = (data) => {
        console.log("Form Data:", data);
    };

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

                {/* Salary Range */}
                <div>
                    <label className="form-label">Salary Range</label>
                    <input
                        type="number"
                        {...register("salary", { min: 0, pattern: /0-9/ })}
                        className="input"
                    />
                </div>

                {/* Posted Date */}
                <div>
                    <label className="form-label">Posted Date</label>
                    <input
                        type="date"
                        {...register("postedDate")}
                        className="input"
                    />
                </div>

                {/* Number of Applicants */}
                <div>
                    <label className="form-label">Number of Applicants</label>
                    <select {...register("applicants")} className="select">
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
