"use client";

import { motion } from "framer-motion";

type MotionDivProps = {
  children: React.ReactNode;
  index?: number;
  className?: string;
};

export function MotionDiv({ children, index = 0, className }: MotionDivProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
