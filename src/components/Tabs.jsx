/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// No need to import X from lucide-react

const TabsUi = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  // If tabs are not provided, return a clean empty state
  if (!tabs || tabs.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-10 shadow-sm border border-gray-200"
        >
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Tabs Available
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Please provide tab configurations to display content in this
            component.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full  mx-auto mt-6 ">
      {/* Glass effect card container */}
      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <motion.h2
            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            simulator
          </motion.h2>
          <motion.div
            className="h-1 w-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 80 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>

        {/* Tabs - Card Style */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-6">
          {tabs.map((tab, index) => (
            <motion.div
              key={tab.id}
              className={`cursor-pointer rounded-xl overflow-hidden shadow-md transition-all ${
                activeTab === tab.id
                  ? "ring-2 ring-indigo-500 ring-offset-2"
                  : "hover:shadow-lg"
              }`}
              onClick={() => handleTabClick(tab.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{
                y: -4,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`p-5 h-full flex flex-col justify-between ${
                  activeTab === tab.id
                    ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white"
                    : "  bg-white text-gray-800 hover:bg-gray-50 border-4 border-gray-200 rounded-2xl"
                }`}
              >
                <div className="flex items-center mb-2">
                  {/* You can add icons here if your tabs include them */}
                  <h3
                    className={`font-semibold text-lg ${
                      activeTab === tab.id ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {tab.label}
                  </h3>
                </div>
                <p
                  className={`text-sm ${
                    activeTab === tab.id ? "text-indigo-100" : "text-gray-500"
                  }`}
                >
                  Click to view details
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullScreen && activeTab && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[150]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl h-[90vh] w-[90vw] max-w-7xl flex flex-col relative overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Header with title and close button */}
              <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                <motion.h2
                  className="text-xl font-bold flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {tabs.find((tab) => tab.id === activeTab)?.label}
                </motion.h2>

                <motion.button
                  onClick={closeFullScreen}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </motion.button>
              </div>

              {/* Content area with shadow for depth */}
              <motion.div
                className="flex-1 p-6 overflow-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="max-w-6xl mx-auto">
                  {tabs.find((tab) => tab.id === activeTab)?.content}
                </div>
              </motion.div>

        
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TabsUi;
