import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'

export default function WhatsAppFAB() {
  return (
    <motion.a
      href="https://wa.me/923083309704?text=Hello! I'm interested in Star Educational Academy's programs."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg transition-transform duration-300 hover:scale-110"
      style={{ background: '#25D366' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} />
      
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full animate-pulse-glow" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-1.5 bg-white text-charcoal text-sm font-medium rounded-lg shadow-md whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100"
        style={{ display: 'none' }}
      >
        Chat with us!
      </span>
    </motion.a>
  )
}
