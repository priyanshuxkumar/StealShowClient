import "./App.css";
import { Routes, Route } from "react-router-dom";
import Explore from "./pages/Explore";
import SingleEvent from "./pages/SingleEvent";
import EventView from "./pages/EventView";
import EventShows from "./pages/EventShows";
import SeatSelection from "./pages/SeatSelection";
import SignIn from "./pages/SignIn";
import Payment from "./pages/Payment"
import SignupPage from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/explore/:location" element={<Explore />} />
        <Route path="/single-event" element={<SingleEvent />} />
        <Route path="/:location/:id" element={<EventView />} />
        <Route path="/buy-tickets/:eventname/:location/:id" element={<EventShows />} />
        <Route path="/buy-tickets/:eventname/:venueId/:eventVenueId/:showtime/seatlayout" element={<SeatSelection/>} />
        <Route path="/payment/:eventVenueId" element={<Payment/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes>
    </>
  );
}
export default App;