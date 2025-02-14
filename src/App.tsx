/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import AddApplication from "./pages/AddApplication";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MyApplications from "./pages/MyApplications";

function App() {
  // const [jobApplications, setJobApplication] = useState<Array<Schema["JobApplication"]["type"]>>([]);
  // const { user, signOut } = useAuthenticator();





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
  // async function createJobApplication() {
  //   const res = await client.models.JobApplication.create({
  //     company: window.prompt("Company name"),
  //     position: window.prompt("Job position"),
  //     status: "APPLIED", // Default status
  //     appliedDate: "new Date().toISOString()",
  //   });

  //   console.log(res);

  // }


  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddApplication />} />
        <Route path="/applications" element={<MyApplications />} />
        {/* <h1>Hello {user?.signInDetails?.loginId?.split("@")?.[0]}</h1> */}
        {/* <button onClick={signOut} >Sign out</button> */}
      </Routes>
    </>
  );
}

export default App;
