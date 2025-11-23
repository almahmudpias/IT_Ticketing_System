import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import TicketForm from '../components/forms/TicketForm';
import { 
  ArrowLeft, LifeBuoy, Zap, 
  CheckCircle, AlertCircle, FileText 
} from 'lucide-react';
import toast from 'react-hot-toast';

const TicketCreatePage = () => {
  const navigate = useNavigate();
  const { createTicket } = useTickets();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (ticketData) => {
    setIsSubmitting(true);
    try {
      await createTicket(ticketData);
      toast.success('Support ticket created successfully!');
      // Small delay to allow the user to read the success message before redirecting
      setTimeout(() => navigate('/student'), 1000); 
    } catch (error) {
      console.error('Failed to create ticket:', error);
      toast.error('Failed to submit ticket. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      
      {/* 1. ANIMATED HEADER SECTION */}
      <div className="relative h-72 bg-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>
        
        {/* Header Content */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center pb-12">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center space-x-2 text-blue-200 hover:text-white transition-colors duration-200 mb-6 w-fit"
          >
            <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all duration-200">
              <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          
          <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              Submit a Request
            </h1>
            <p className="text-slate-300 max-w-2xl text-lg">
              Having technical difficulties? Fill out the form below and our IT staff will get back to you shortly.
            </p>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT - Overlapping Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row animate-in slide-in-from-bottom-8 duration-700 fade-in">
          
          {/* LEFT: The Form Area */}
          <div className="flex-1 p-8 lg:p-12">
            <div className="flex items-center gap-2 mb-8 border-b border-gray-100 pb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Ticket Details</h2>
                <p className="text-xs text-gray-500">Please provide as much detail as possible.</p>
              </div>
            </div>

            {/* Render the passed Form Component */}
            {/* We pass a prop or wrap it to ensure it inherits our loading state if needed */}
            <div className={isSubmitting ? 'opacity-50 pointer-events-none transition-opacity' : ''}>
              <TicketForm onSubmit={handleSubmit} />
            </div>
          </div>

          {/* RIGHT: Contextual Sidebar (Guidelines) */}
          <div className="lg:w-80 bg-slate-50 border-t lg:border-t-0 lg:border-l border-gray-100 p-8">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              <LifeBuoy className="h-4 w-4" />
              Quick Guidelines
            </h3>

            <div className="space-y-6">
              {/* Tip 1 */}
              <div className="group">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Be Specific</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Instead of "Internet not working", try "Wifi disconnects every 10 mins in Library Building A".
                    </p>
                  </div>
                </div>
              </div>

              {/* Tip 2 */}
              <div className="group">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Urgency Levels</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Only mark "High Priority" if the issue prevents you from completing imminent coursework or exams.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tip 3 */}
              <div className="group">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Zap className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Screenshots Help</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      If you see an error code, please include it in the description.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Wait Time Box */}
              <div className="mt-8 p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">Estimated Response Time</p>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold text-blue-600">24</span>
                  <span className="text-sm text-gray-600 mb-1">Hours</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-500 h-full w-2/3 rounded-full animate-pulse"></div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TicketCreatePage;