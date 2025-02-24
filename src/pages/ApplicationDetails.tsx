import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import type { Schema } from "../../amplify/data/resource";

export default function ApplicationDetails() {
  const { state } = useLocation();
  const application: Schema["JobApplication"]["type"] = state.job;

  const [isEditing, setIsEditing] = useState(false);
  const [resumeFile, setResumeFile] = useState<File>();
  const [coverLetterFile, setCoverLetterFile] = useState<File>();
  const { register, handleSubmit, setValue } = useForm<Schema["JobApplication"]["type"]>({
    defaultValues: state.job,
  });

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const onSubmit = (data: Schema["JobApplication"]["type"]) => {
    console.log("Updated Data:", data);
    setIsEditing(false);
  };

  return (
    <div className="form-container">
      <h2 className="text-xl font-semibold mb-4">Application Details</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="form space-y-4">
          <div>
            <label className="form-label">Job Title</label>
            <input type="text" {...register("jobTitle", { required: true })} className="input" />
          </div>

          <div>
            <label className="form-label">Job Description</label>
            <textarea {...register("jobDescription", { required: true })} className="input" />
          </div>

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

          <div>
            <label className="form-label">Resume</label>
            <input type="file" onChange={(e) => setResumeFile(e.target.files?.[0])} className="input" />
          </div>

          <div>
            <label className="form-label">Cover Letter</label>
            <input type="file" onChange={(e) => setCoverLetterFile(e.target.files?.[0])} className="input" />
          </div>

          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" onClick={handleCancel} className="btn btn-secondary">Cancel</button>
        </form>
      ) : (
        <div className="space-y-4">
          <p><strong>Job Title:</strong>
          <div>{application.jobTitle}</div></p>
          <p><strong>Description:</strong> {application.jobDescription}</p>
          <p><strong>Status:</strong> {application.status}</p>
          {application.resumeUrl && <p><a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">View Resume</a></p>}
          {application.coverLetterUrl && <p><a href={application.coverLetterUrl} target="_blank" rel="noopener noreferrer">View Cover Letter</a></p>}
          <div className="flex justify-evenly space-x-2">
              <button className="w-full btn btn-primary mt-2" onClick={handleEdit} >Edit</button>
              <button className="w-full btn btn-danger mt-2">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
