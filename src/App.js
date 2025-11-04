import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./App.css";

import { AuthenticationProvider } from "./AuthenticationContext.js";
import IndexRoute from "./routes/Main.js";
import AboutRoute from "./routes/About.js";
import CallbackRoute from "./routes/Callback.js";

import Header from "./Header.js";

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
