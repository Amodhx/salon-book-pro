import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  ClipboardList, 
  Settings, 
  LayoutDashboard,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import AvailabilityManager from '@/components/admin/AvailabilityManager';
import AppointmentRequests from '@/components/admin/AppointmentRequests';

type AdminTab = 'availability' | 'appointments';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('appointments');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { id: 'appointments' as AdminTab, label: 'Appointment Requests', icon: ClipboardList },
    { id: 'availability' as AdminTab, label: 'Availability Manager', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-5rem)] bg-card border-r border-border">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h2 className="font-display text-lg text-foreground">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">Manage your salon</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-accent text-accent-foreground shadow-gold'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }
                  `}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-gold flex items-center justify-center"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-foreground/50"
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-72 h-full bg-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <LayoutDashboard className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <h2 className="font-display text-lg text-foreground">Admin</h2>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-secondary"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                        ${activeTab === tab.id
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        }
                      `}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  ))}
                </nav>
              </div>
            </motion.aside>
          </motion.div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'appointments' && <AppointmentRequests />}
            {activeTab === 'availability' && <AvailabilityManager />}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
