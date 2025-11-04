import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./App.css";

import { AuthenticationProvider } from "./AuthenticationContext.jsx";
import IndexRoute from "./routes/Main.jsx";
import AboutRoute from "./routes/About.jsx";
import CallbackRoute from "./routes/Callback.jsx";

import Header from "./Header.jsx";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthenticationProvider>
        <BrowserRouter>
          <div className="App">
            <Header />

            <Routes>
              <Route path="/" element={<IndexRoute />} />
              <Route path="about" element={<AboutRoute />} />
              <Route path="callback" element={<CallbackRoute />} />

              {/* Redirect to home page on 404. */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthenticationProvider>
    </QueryClientProvider>
  );
}
