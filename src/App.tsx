import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

function App() {
  const [jobApplications, setJobApplication] = useState<Array<Schema["JobApplication"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();
  console.log(client);


  useEffect(() => {
    const dataStream = client.models.JobApplication.observeQuery().subscribe({
      next: (data) => setJobApplication([...data.items]),
      error: (error) => console.error(error),
    });

    return dataStream.unsubscribe
  }, []);

  useEffect(() => {

    async function callLambda() {
      try {

        const res = await client.queries.sayHello({
          name: "AAAAAAAAAAAAA"
        })
        console.log("resresresres", res.data);

      } catch (e) {
        console.log("Error ", e);
      }
    }
    callLambda();

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


  // function deleteTodo(id: string) {
  //   client.models.JobApplication.delete({ id });
  // }
  return (
    <main>
      <h1>Hello {user?.signInDetails?.loginId?.split("@")?.[0]}</h1>
      <button onClick={createJobApplication}>+ new</button>
      <ul>
        {jobApplications.map((jobApplication) => (
          <li key={jobApplication.id}>
            {jobApplication.company} - {jobApplication.position} ({jobApplication.status})
          </li>
        ))}
      </ul>
      <button onClick={signOut} >Sign out</button>
    </main>
  );
}

export default App;
