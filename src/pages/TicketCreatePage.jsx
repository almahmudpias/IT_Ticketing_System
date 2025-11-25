import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import TicketForm from '../components/forms/TicketForm';
import { 
  ArrowLeft, LifeBuoy, Zap, 
  CheckCircle, AlertCircle, FileText,
  Clock, Sparkles, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const TicketCreatePage = () => {
  const navigate = useNavigate();
  const { createTicket } = useTickets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (ticketData) => {
    setIsSubmitting(true);
    try {
      await createTicket(ticketData);
      toast.success('Support ticket created successfully!', {
        style: {
          background: '#10b981',
          color: 'white',
        },
        iconTheme: {
          primary: 'white',
          secondary: '#10b981',
        },
      });
      setTimeout(() => navigate('/student'), 1200);
    } catch (error) {
      console.error('Failed to create ticket:', error);
      toast.error('Failed to submit ticket. Please try again.', {
        style: {
          background: '#ef4444',
          color: 'white',
        },
      });
      setIsSubmitting(false);
    }
  };

  const floatingShapes = [
    { id: 1, style: "top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10" },
    { id: 2, style: "top-1/3 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10" },
    { id: 3, style: "bottom-1/4 left-1/3 w-32 h-32 bg-gradient-to-r from-emerald-500/10 to-teal-500/10" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingShapes.map((shape) => (
          <motion.div
            key={shape.id}
            className={`absolute rounded-full blur-3xl ${shape.style}`}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20 + shape.id * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        

        {/* Main Form Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Form Column */}
            <motion.div 
              className="lg:col-span-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/60 overflow-hidden">
                {/* Form Header */}
                <div className="p-8 border-b border-slate-200/60">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Ticket Details</h2>
                      <p className="text-slate-500 mt-1">Provide comprehensive details for faster resolution</p>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className={`p-8 transition-all duration-300 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
                  <TicketForm onSubmit={handleSubmit} />
                </div>
              </div>
            </motion.div>

            {/* Right: Guidelines Column */}
            <motion.div 
              className="lg:col-span-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1 }}
            >
              <div className="sticky top-8 space-y-6">
                {/* Guidelines Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-white/10 rounded-xl">
                      <LifeBuoy className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold">Submission Guidelines</h3>
                  </div>

                  <div className="space-y-6">
                    {/* Tip 1 */}
                    <motion.div 
                      className="group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-white mb-2">Be Specific & Detailed</p>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            Include exact error messages, timestamps, and step-by-step reproduction steps.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Tip 2 */}
                    <motion.div 
                      className="group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className="p-2 bg-amber-500/20 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-amber-400" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-white mb-2">Priority Guidance</p>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            Reserve "Critical" for system-wide outages or security incidents affecting multiple users.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Tip 3 */}
                    <motion.div 
                      className="group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Zap className="h-4 w-4 text-purple-400" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-white mb-2">Attach Evidence</p>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            Screenshots, logs, and screen recordings dramatically accelerate resolution time.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Response Time Card */}
                <motion.div 
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/60"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Response Time</p>
                      <p className="text-xs text-slate-500">Based on current load</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-3xl font-bold text-slate-900">2-4</span>
                        <span className="text-slate-600 font-medium ml-1">hours</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                          Low Load
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '40%' }}
                        transition={{ duration: 1.5, delay: 1.5 }}
                      />
                    </div>
                    
                    <p className="text-xs text-slate-500 text-center">
                      Typically responds within 2 hours during business hours
                    </p>
                  </div>
                </motion.div>

                {/* Support Status */}
                <motion.div 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">Support Team</p>
                      <p className="text-emerald-100 text-xs">Online & Available</p>
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3].map((dot) => (
                        <motion.div
                          key={dot}
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: dot * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Creating Ticket</h3>
              <p className="text-slate-600 text-sm">Your request is being processed securely...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TicketCreatePage;