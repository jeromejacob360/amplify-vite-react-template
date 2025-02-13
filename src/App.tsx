/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { uploadData } from "aws-amplify/storage";
import ProgressBar from "./components/ProgressBar";

const client = generateClient<Schema>();

function App() {
  const [jobApplications, setJobApplication] = useState<Array<Schema["JobApplication"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();
  const [file, setFile] = useState({} as any);
  const [progress, setProgress] = useState(0);

  const handleChange = (event: any) => {
    setFile(event.target.files?.[0]);
  };

  const handleClick = () => {
    if (!file) {
      return;
    }
    try {
      uploadData({
        path: `pictures/${file?.name}`,
        data: file,
        options: {
          onProgress: (progress) => {
            const { transferredBytes, totalBytes } = progress;
            if (totalBytes) {
              const percent = Math.round((transferredBytes / totalBytes) * 100);
              setProgress(percent);
            }
          },
        }
      });

    } catch (e) {
      console.log("Error ", e);
    }
  };


  useEffect(() => {
    const dataStream = client.models.JobApplication.observeQuery().subscribe({
      next: (data) => setJobApplication([...data.items]),
      error: (error) => console.error(error),
    });

    return dataStream.unsubscribe
  }, []);

  useEffect(() => {
    // async function callLambda() {
    //   try {
    //     const res = await client.queries.sayHello({
    //       name: "AAAAAAAAAAAAA"
    //     })
    //     console.log("resresresres", res.data);
    //   } catch (e) {
    //     console.log("Error ", e);
    //   }
    // }
    // callLambda();

  }, [])
  async function createJobApplication() {
    const res = await client.models.JobApplication.create({
      company: window.prompt("Company name"),
      position: window.prompt("Job position"),
      status: "APPLIED", // Default status
      appliedDate: "new Date().toISOString()",
    });

    console.log(res);

  }


  return (
    <main>
      <ProgressBar progress={progress} />
      <h1>Hello {user?.signInDetails?.loginId?.split("@")?.[0]}</h1>
      <button onClick={createJobApplication}>+ new</button>
      <ul>
        {jobApplications.map((jobApplication) => (
          <li key={jobApplication.id}>
            {jobApplication.company} - {jobApplication.position} ({jobApplication.status})
          </li>
        ))}
      </ul>
      <div>
        <input type="file" onChange={handleChange} />
        <button onClick={handleClick}>Upload</button>
      </div>
      <button onClick={signOut} >Sign out</button>
    </main>
  );
}

export default App;
