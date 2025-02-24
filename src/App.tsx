import AddApplication from "./pages/AddApplication";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MyApplications from "./pages/MyApplications";
import React, { Suspense } from "react";
const ApplicationDetails = React.lazy(() => import("./pages/ApplicationDetails"));

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddApplication />} />
        <Route path="/applications" element={<MyApplications />} />
        <Route path="/application/:id" element={
          <Suspense fallback={<h1>Loading................</h1>}>
            <ApplicationDetails />
          </Suspense>} />
      </Routes>
    </>
  );
}

export default App;
