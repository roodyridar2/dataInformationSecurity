// import { useState } from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiPlus, FiX } from "react-icons/fi";

// const Dashboard = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const days = [1, 2, 3, 4, 5, 6, 7];
//   const radius = 90;
//   // const startAngle = Math.PI;
//   const startAngle = 0;
//   // const endAngle = 2.5* Math.PI;
//   const endAngle =2 *   Math.PI;

//   const MotionNavLink = motion(NavLink);

//   return (
//     <div className="relative min-h-screen bg-gray-50">
//       <div>
//         <Outlet />
//       </div>

//       <AnimatePresence>
//         {menuOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-40 bg-black/60"
//             onClick={() => setMenuOpen(false)}
//           />
//         )}
//       </AnimatePresence>

//       <div className={`fixed z-50 ${menuOpen ? "inset-0 flex items-center justify-center" : "bottom-16 right-16"}`}>
//         {menuOpen && (
//           <AnimatePresence>
//             {days.map((day, index) => {
//               {/* const angle = startAngle + (index * (endAngle - startAngle)) / (days.length - 1); */}
//               const angle = (index * (endAngle - startAngle)) / days.length;

//               const x = radius * Math.cos(angle);
//               const y = radius * Math.sin(angle);
//               const available = day <= 2;

//               return (
//                 <MotionNavLink
//                   key={day}
//                   initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
//                   animate={{ scale: 1, opacity: 1, x, y }}
//                   exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
//                   transition={{
//                     type: "spring",
//                     stiffness: 200,
//                     delay: index * 0.07,
//                   }}
//                   to={available ? `day${day}` : "#"}
//                   onClick={(e) => {
//                     if (!available) e.preventDefault();
//                     else setMenuOpen(false);
//                   }}
//                   className={`absolute w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
//                     available
//                       ? "bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
//                       : "bg-gray-200 border border-gray-300 text-gray-500 cursor-not-allowed"
//                   }`}
//                 >
//                   {day}
//                 </MotionNavLink>
//               );
//             })}
//           </AnimatePresence>
//         )}

//         <motion.div
//           layout
//           initial={{ scale: 0 }}
//           animate={{
//             scale: 1,
//             rotate: menuOpen ? 45 : 0,
//             backgroundColor: "#4f46e5",
//           }}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           // transition={{ type: "spring", stiffness: 300 }}
//           drag
//           dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
//           onClick={(e) => {
//             e.stopPropagation();
//             setMenuOpen((prev) => !prev);
//           }}
//           className="rounded-full w-12 h-12 shadow-xl flex items-center justify-center cursor-pointer"
//         >
//           <motion.div
//             animate={{ rotate: menuOpen ? 180 : 0 }}
//             transition={{ type: "spring", stiffness: 400 }}
//           >
//             {menuOpen ? (
//               <FiX className="text-2xl text-white" />
//             ) : (
//               <FiPlus className="text-2xl text-white" />
//             )}
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiLock, FiMenu, FiX, FiPlus  } from "react-icons/fi";


const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const days = [1, 2, 3, 4, 5, 6, 7];
  const radius = 100;
  const startAngle = 0;
  const endAngle = 2 * Math.PI;

  const MotionNavLink = motion(NavLink);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Home button */}
      <NavLink
        to="/"
        className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-lg flex justify-center items-center gap-2"
      >
        <FiMapPin className="text-2xl text-indigo-600" />
        <span className=" bold font-mono text-sm ">Home</span>
      </NavLink>
      <div>
        <Outlet />
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=" absolute left-0 right-0 top-0 bottom-0  z-40 bg-black/80"
            onClick={() => {
              console.log("clicked");
              setMenuOpen(false);
            }}
            onTap={() => {
              console.log("tapped");
              setMenuOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <div
        className={`fixed z-50 ${
          menuOpen
            ? "inset-0 flex items-center justify-center"
            : "top-4 right-10"
        }`}
      >
        {menuOpen && (
          <AnimatePresence>
            {days.map((week, index) => {
              const angle = (index * (endAngle - startAngle)) / days.length;
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);
              const available = week <= 2;

              return (
                <MotionNavLink
                  key={week}
                  initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, opacity: 1, x, y }}
                  exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: index * 0.07,
                  }}
                  to={available ? `week${week}` : "#"}
                  onClick={(e) => {
                    if (!available) e.preventDefault();
                    else setMenuOpen(false);
                  }}
                  className={`absolute w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                    available
                      ? "bg-white  border-indigo-600 text-indigo-500 hover:bg-indigo-600 hover:text-white"
                      : "bg-gray-200 border border-gray-300 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {available ? (
                    <FiMapPin className="text-lg" />
                  ) : (
                    <FiLock className="text-lg" />
                  )}
                  <span className="absolute text-xs font-medium -bottom-5">
                    Week {week}
                  </span>
                </MotionNavLink>
              );
            })}
          </AnimatePresence>
        )}

        <motion.div
          layout
          initial={{ scale: 0 }}
          animate={{
            scale: 1,
            rotate: menuOpen ? 45 : 0,
            backgroundColor: "#4f46e5",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          // transition={{ type: "spring", stiffness: 300 }}
          drag
          dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
          className="rounded-full w-12 h-12 shadow-xl flex items-center justify-center cursor-pointer"
        >
          <motion.div
            animate={{ rotate: menuOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {menuOpen ? (
              <FiPlus className="text-2xl text-white" />
            ) : (
              <FiMenu className="text-2xl text-white" />
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
