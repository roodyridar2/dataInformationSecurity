// Overview.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const Overview = () => {
  const days = [
    { id: 1, available: true, title: "Caesar Cipher", color: "bg-indigo-500" },
    { id: 2, available: true, title: "Next Challenge", color: "bg-teal-500" },
    { id: 3, available: false, title: "Coming Soon", color: "bg-gray-500" },
    { id: 4, available: false, title: "Coming Soon", color: "bg-gray-500" },
    { id: 5, available: false, title: "Coming Soon", color: "bg-gray-500" },
    { id: 6, available: false, title: "Coming Soon", color: "bg-gray-500" },
    { id: 7, available: false, title: "Coming Soon", color: "bg-gray-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-white mb-12 text-center"
      >
        Information Security Challenges
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <AnimatePresence>
          {days.map((day, index) => (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              className="relative"
            >
              <NavLink 
                to={day.available ? `/week${day.id}` : '#'}
                onClick={(e) => !day.available && e.preventDefault()}
                className={`block ${!day.available ? 'cursor-not-allowed' : ''}`}
              >
                <motion.div
                  whileHover={{ y: -10, rotateZ: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${day.color} rounded-2xl p-8 shadow-xl h-64 flex flex-col justify-between 
                    ${day.available ? 'hover:shadow-2xl' : 'opacity-50'}`}
                >
                  <div className="flex justify-between items-start">
                    <motion.span 
                      className="text-6xl font-bold text-white opacity-50"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                    >
                      {day.id}
                    </motion.span>
                    {day.available && (
                      <motion.div 
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                      >
                        <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{day.title}</h3>
                    {day.available ? (
                      <div className="flex items-center gap-2">
                        <span className="text-white/80">Start journey</span>
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          → 
                        </motion.div>
                      </div>
                    ) : (
                      <span className="text-white/50">Locked</span>
                    )}
                  </div>
                </motion.div>

                {!day.available && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-white/30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                )}
              </NavLink>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Overview;