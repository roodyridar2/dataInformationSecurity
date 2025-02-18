// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Day1 from "./pages/Day1";
import Day2 from "./pages/Day2";
import Dashboard from "./Dashboard";
import Overview from "./Overview";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          {/* Default tab */}
          <Route path="week1" element={<Day1 />} />
          <Route path="week2" element={<Day2 />} />
        </Route>
        <Route index element={<Overview />} />
      </Routes>
    </Router>
  );
}

export default App;
