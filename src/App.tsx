/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import AddApplication from "./pages/AddApplication";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MyApplications from "./pages/MyApplications";
import { useAuthenticator } from "@aws-amplify/ui-react";

function App() {
  // const [jobApplications, setJobApplication] = useState<Array<Schema["JobApplication"]["type"]>>([]);
  const { signOut } = useAuthenticator();
  // useEffect(() => {
  //   const dataStream = client.models.JobApplication.observeQuery().subscribe({
  //     next: (data) => setJobApplication([...data.items]),
  //     error: (error) => console.error(error),
  //   });

  //   return dataStream.unsubscribe
  // }, []);

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

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddApplication />} />
        <Route path="/applications" element={<MyApplications />} />
        <button onClick={signOut} >Sign out</button>
      </Routes>
    </>
  );
}

export default App;
