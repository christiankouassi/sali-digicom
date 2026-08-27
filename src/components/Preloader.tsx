import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface PreloaderProps {
  loading: boolean;
}

export function Preloader({ loading }: PreloaderProps) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: -30,
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#ebf1f8] select-none"
        >
          <div className="relative flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-[160px] h-[160px] md:w-[190px] md:h-[190px]"
            >
              <Logo 
                variant="capital" 
                type="icon" 
                className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(29,152,120,0.12)]" 
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
