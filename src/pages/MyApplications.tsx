import { useEffect, useState } from "react";
import { client } from "../lib/amplify/client";
import { Download, Pencil, Trash } from "lucide-react";
import { getUrl, remove } from "aws-amplify/storage";
import { convertToTimeFormat } from "../utils/timeStringToTime";
import { useNavigate } from "react-router-dom";

interface JobApplication {
  id: string;
  jobTitle: string | null;
  jobDescription: string;
  numberOfApplicants: string;
  resumeUrl?: string;
  resumeTitle?: string;
  coverLetterUrl?: string;
  applicationStatus?: string;
  updatedAt: string;
}

export default function MyApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [sortKey, setSortKey] = useState<keyof JobApplication | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const { data } = await client.models.JobApplication.list();
      const cleanedData = data.map(job => ({
        id: job.id,
        jobTitle: job.jobTitle ?? "",
        jobDescription: job.jobDescription ?? "",
        numberOfApplicants: job.numberOfApplicants ?? "",
        resumeUrl: job.resume?.fileUrl ?? "",
        resumeTitle: job.resume?.title ?? "",
        coverLetterUrl: job.coverLetterUrl ?? "",
        updatedAt: job.updatedAt,
      }));

      setApplications(cleanedData);
    } catch (error) {
      console.error("Error fetching applications: ", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSort = (key: keyof JobApplication) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleResumeDownload = async (resumeUrl: string | undefined, resumeTitle: string | undefined) => {
    const res = await getUrl({
      path: resumeUrl as string
    });
    const url = res.url.toString()
    const link = document.createElement("a");
    link.href = url;
    link.download = resumeTitle!;
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  }

  const handleDelete = async (job: JobApplication) => {
    try {
      const { id, resumeUrl } = job;
      await remove({
        path: resumeUrl as string
      })
      await client.models.JobApplication.delete({ id }).then(() => {
        setApplications(applications.filter(job => job.id !== id));
      })
    } catch (error) {
      console.error("Error deleting job: ", error);
    }
  }

  const handleEdit = async (job: JobApplication) => {
    try {
      navigate(`/edit/${job.id}`, { state: {
        job
      } });
    } catch (error) {
      console.error("Error updating job: ", error);
    }
  }

  const sortedData = [...applications].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey] ?? "";
    const valB = b[sortKey] ?? "";
    return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  if (loading) return <p>Loading job applications...</p>;

  return (
    <div className="flex flex-col items-center">
      <table className="w-xl bg-white border border-gray-200 rounded-md shadow-md mb-20">
        <thead>
          <tr className="bg-gray-100 whitespace-nowrap">
            {[
              "Job Title",
              "Description",
              "Applicants",
              "Updated At",
            ].map((header, index) => (
              <th
                key={index}
                onClick={() => handleSort(Object.keys(sortedData[0] ?? {})[index] as keyof JobApplication)}
                className="cursor-pointer table-header-cell"
              >
                {header} {sortKey === Object.keys(sortedData[0] ?? {})[index] ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
            ))
            }
            <th className="table-header-cell">Resume</th>
            <th className="table-header-cell">Cover Letter</th>
            <th className="table-header-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((job, idx) => (
            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 border">
              <td className="table-data-cell">{job.jobTitle}</td>
              <td className="table-data-cell">{job.jobDescription}</td>
              <td className="table-data-cell">{job.numberOfApplicants}</td>
              <td className="table-data-cell">{convertToTimeFormat(job.updatedAt)}</td>
              <td className="table-data-cell">
                {job.resumeUrl ? (
                  <button className="w-full flex justify-center" onClick={() => handleResumeDownload(job.resumeUrl, job.resumeTitle)}>
                    <Download size={18} color="blue" />
                  </button>
                ) : (
                  "N/A"
                )}
              </td>
              <td className="table-data-cell">
                {job.coverLetterUrl ? (
                  <a href={job.coverLetterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    View Cover Letter
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td className="table-data-cell w-full flex justify-center space-x-2">
                <Trash className="cursor-pointer" onClick={() => handleDelete(job)} size={18} color="red" />
                <Pencil className="cursor-pointer" onClick={() => handleEdit(job)} size={18} color="red" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}