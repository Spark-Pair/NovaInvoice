import React from 'react'
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
        <div className="flex gap-2">
        {[0, 1, 2].map((index) => (
            <motion.div
            key={index}
            className="w-4 h-4 bg-indigo-600 rounded-full"
            animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
            }}
            transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
            }}
            />
        ))}
        </div>
        <p className="text-slate-500 font-medium animate-pulse">
        Loading data...
        </p>
    </div>
  )
}
