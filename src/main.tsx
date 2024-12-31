import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { BookingProvider } from "./context/BookingDetailsContext.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

createRoot(document.getElementById("root")!).render(
  <BookingProvider>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </BookingProvider>
);
