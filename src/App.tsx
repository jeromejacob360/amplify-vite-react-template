import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

function App() {
  const [jobApplications, setJobApplication] = useState<Array<Schema["JobApplication"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();
  

  useEffect(() => {
    client.models?.JobApplication?.observeQuery().subscribe({
      next: (data) => setJobApplication([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.JobApplication.create({ 
      appliedDate: new Date().toISOString(),
      company: "Goooogle",
      position: "Frontend Dev",
      status: "APPLIED"
    });
  }

  function deleteTodo(id: string) {
    client.models.JobApplication.delete({ id });
  }
  return (
    <main>
      <h1>Hello {user?.signInDetails?.loginId?.split("@")?.[0]}</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {jobApplications.map((jobApplication) => (
          <li onClick={() => deleteTodo(jobApplication.id)} key={jobApplication.id}>
            <span>{jobApplication.company}</span>
            <span>{jobApplication.position}</span>
            <span>{jobApplication.status}</span>
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut} >Sign out</button>
    </main>
  );
}

export default App;
