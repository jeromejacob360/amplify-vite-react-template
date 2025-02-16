import { useState } from "react";
import { useForm } from "react-hook-form";
import { JobApplicationFormData } from "../interfaces/application";
import { useLocation } from "react-router-dom";

interface ApplicationDetailsProps {
  application: JobApplicationFormData;
  onUpdate: (updatedApp: JobApplicationFormData) => void;
  onDelete: () => void;
}

export default function ApplicationDetails() {
    const { state } = useLocation();
    const application: JobApplicationFormData = state.job;
  
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm<JobApplicationFormData>({
    defaultValues: state.job,
  });

  const coverLetterChecked = watch("coverLetter");

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const onSubmit = (data: JobApplicationFormData) => {
    // onUpdate(data);
    setIsEditing(false);
  };

  return ( 
    <div className="p-4 border rounded-md shadow-md">
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="text" {...register("jobTitle", { required: true })} className="input" />
          <textarea {...register("description", { required: true })} className="input" />
          <select {...register("applicationStatus")} className="select">
            <option value="interviewScheduled">Interview scheduled</option>
            <option value="interviewed">Interviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="noResponse">No Response</option>
          </select>
          <input type="file" onChange={(e) => setValue("resume.file", e.target.files)} className="input" />

          <div>
            <input type="checkbox" {...register("coverLetter")} /> Include Cover Letter
            {coverLetterChecked && <input type="file" {...register("coverLetterFile")} className="input" />}
          </div>

          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" onClick={handleCancel} className="btn btn-secondary">Cancel</button>
        </form>
      ) : (
        <div>
          <h3 className="text-lg font-semibold">{application.jobTitle}</h3>
          <p>{application.description}</p>
          <p>Status: {application.jobApplicationStatus}</p>
          {application.resume?.fileUrl && <a href={application.resume.fileUrl} target="_blank" rel="noopener noreferrer">View Resume</a>}
          <button onClick={handleEdit} className="btn btn-primary mt-2">Edit</button>
          <button 
                          //   onClick={onDelete} 
          className="btn btn-danger mt-2">Delete</button>
        </div>
      )}
    </div>
  );
}
