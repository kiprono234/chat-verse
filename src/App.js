// // // src/App.jsx
// // import React, { useContext } from "react";
// // import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
// // import { AnimatePresence } from "framer-motion";
// // import AuthProvider, { AuthContext } from "./context/AuthContext";

// // import LandingPage from "./components/LandingPage";
// // import Signup from "./components/auth/Signup";
// // import Login from "./components/auth/Login";
// // import ChatPage from "./components/ChatPage";

// // function RequireAuth({ children }) {
// //   const { user, loading } = useContext(AuthContext);
// //   if (loading) return <div className="loading">Loading...</div>;
// //   if (!user) return <Navigate to="/login" replace />;
// //   return children;
// // }

// // function AnimatedRoutes() {
// //   const location = useLocation();
// //   return (
// //     <AnimatePresence exitBeforeEnter>
// //       <Routes location={location} key={location.pathname}>
// //         <Route path="/" element={<LandingPage />} />
// //         <Route path="/signup" element={<Signup />} />
// //         <Route path="/login" element={<Login />} />
// //         <Route
// //           path="/chat"
// //           element={
// //             <RequireAuth>
// //               <ChatPage />
// //             </RequireAuth>
// //           }
// //         />
// //       </Routes>
// //     </AnimatePresence>
// //   );
// // }

// // export default function App() {
// //   return (
// //     <AuthProvider>
// //       <Router>
// //         <AnimatedRoutes />
// //       </Router>
// //     </AuthProvider>
// //   );
// // }

// // src/App.jsx
// import React, { useContext } from "react";
// import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
// import { AnimatePresence, motion } from "framer-motion";
// import AuthProvider, { AuthContext } from "./context/AuthContext";

// import LandingPage from "./components/LandingPage";
// import Signup from "./components/auth/Signup";
// import Login from "./components/auth/Login";
// import ChatPage from "./components/ChatPage";

// function RequireAuth({ children }) {
//   const { user, loading } = useContext(AuthContext);
//   if (loading) return <div className="loading">Loading...</div>;
//   if (!user) return <Navigate to="/login" replace />;
//   return children;
// }

// function AnimatedRoutes() {
//   const location = useLocation();
//   return (
//     <AnimatePresence mode="wait">
//       <Routes location={location} key={location.pathname}>
//         <Route
//           path="/"
//           element={
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <LandingPage />
//             </motion.div>
//           }
//         />
//         <Route
//           path="/signup"
//           element={
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//               <Signup />
//             </motion.div>
//           }
//         />
//         <Route
//           path="/login"
//           element={
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//               <Login />
//             </motion.div>
//           }
//         />
//         <Route
//           path="/chat"
//           element={
//             <RequireAuth>
//               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//                 <ChatPage />
//               </motion.div>
//             </RequireAuth>
//           }
//         />
//       </Routes>
//     </AnimatePresence>
//   );
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <AnimatedRoutes />
//       </Router>
//     </AuthProvider>
//   );
// }
// src/App.jsx
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Context
import AuthProvider, { AuthContext } from "./context/AuthContext";

// Pages (default exports assumed)
import LandingPage from "./components/LandingPage";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import ChatPage from "./components/ChatPage";

function RequireAuth({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/chat"
          element={
            <RequireAuth>
              <ChatPage />
            </RequireAuth>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}
