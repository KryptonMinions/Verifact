'use client';

import { motion } from 'framer-motion';

export function DashboardAnimationWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            className={className}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.15,
                        delayChildren: 0.1,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

export function DashboardItem({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, x: -20 },
                visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                    }
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
