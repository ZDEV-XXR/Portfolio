"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Native JS time formatter
function timeAgo(dateString?: string | null) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  if (isNaN(date.getTime()) || date.getTime() === 0) return "Unknown";

  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 0) return "Just now";
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

interface Service {
  id: string | number;
  name: string;
  url: string;
  status: "operational" | "down";
  updated_at?: string;
  created_at?: string;
}

export default function Status() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase credentials are missing in environment variables.");
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        setServices(data as Service[]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch status data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    
    // Polling every 60 seconds
    const interval = setInterval(() => {
      fetchServices();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const allOperational = services.length > 0 && services.every((s) => s.status === "operational");

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 md:p-12 font-sans pt-32">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">System Status</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Live operational status of monitored services.</p>
        </header>

        {loading && services.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-2xl">
            No services found. Ensure your Supabase table is populated.
          </div>
        ) : (
          <>
            {/* Global Health Banner */}
            <div
              className={`p-6 rounded-2xl shadow-sm border ${
                allOperational
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
              } flex items-center gap-4 transition-colors duration-300`}
            >
              <div className={`p-3 rounded-full ${
                allOperational
                  ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                  : "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400"
              }`}>
                {allOperational ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                )}
              </div>
              <div>
                <h2 className={`text-xl font-bold ${allOperational ? "text-green-800 dark:text-green-300" : "text-amber-800 dark:text-amber-300"}`}>
                  {allOperational ? "All Systems Operational 🚀" : "Experiencing Disruption ⚠️"}
                </h2>
                <p className={`text-sm mt-1 ${allOperational ? "text-green-600 dark:text-green-400/80" : "text-amber-600 dark:text-amber-400/80"}`}>
                  Last updated {services.length > 0 ? timeAgo(
                    services.map(s => s.updated_at || s.created_at).sort().reverse()[0]
                  ) : 'recently'}
                </p>
              </div>
            </div>

            {/* Service Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 line-clamp-2">
                        {service.name}
                      </h3>
                      
                      {/* Status Indicator Badge */}
                      <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                        service.status === "operational"
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                          : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                      }`}>
                        <span className="relative flex h-2 w-2">
                          {service.status === "operational" && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          )}
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${
                            service.status === "operational" ? "bg-green-500" : "bg-red-500"
                          }`}></span>
                        </span>
                        {service.status === "operational" ? "Operational" : "Down"}
                      </span>
                    </div>
                    
                    <a href={service.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 truncate block">
                      {service.url}
                    </a>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Last checked</span>
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      {timeAgo(service.updated_at || service.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* SYSTEM OVERVIEW ARCHITECTURE UNDER DASHBOARD GRID */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
              <details className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 p-6 transition-all duration-300">
                <summary className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300 cursor-pointer list-none select-none">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <span>System Architecture Blueprint Overview</span>
                  </div>
                  <span className="transition duration-300 group-open:-rotate-180">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </span>
                </summary>
                
                <div className="mt-6 text-sm text-slate-600 dark:text-slate-400 space-y-6 border-t border-slate-200 dark:border-slate-800/60 pt-4 transition-all duration-300">
                  <p className="leading-relaxed">
                    This project uses a decoupled, automated <strong className="text-slate-800 dark:text-slate-200 font-medium">DevOps Monitoring Architecture</strong> that continuously audits the operational health of live API infrastructure and user applications. The pipeline runs across three operational tiers:
                  </p>

                  <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl font-mono text-[11px] text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-pre leading-normal border border-slate-200 dark:border-slate-800">
{`[ Scheduled Pinger ] ──(Pings & Validates)──> [ Target Web Services ]
        │
   (Processes Status)
        ▼
[ Make.com Automation ] ──(Secure UPSERT)──> [ Supabase Database ]
                                                     │
                                             (60s Auto-Polling)
                                                     ▼
                                           [ Next.js Dashboard ]`}
                  </div>

                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <li className="space-y-2">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span> Orchestration Layer
                      </h4>
                      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        Managed via <strong className="font-medium text-slate-700 dark:text-slate-300">Make.com</strong>. It automates asynchronous HTTP handshakes to client servers and wraps requests in custom Flow Control error handlers to seamlessly catch network resets (like timeouts) without blocking the loop sequence.
                      </p>
                    </li>
                    <li className="space-y-2">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span> Real-Time Storage
                      </h4>
                      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        Powered by a relational <strong className="font-medium text-slate-700 dark:text-slate-300">Supabase</strong> backend. Using secure database updates against distinct primary index IDs, it safely modifies operational state values and timestamps without mutating core service settings or URL values.
                      </p>
                    </li>
                    <li className="space-y-2">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span> Presentation View
                      </h4>
                      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        This native React client interface automatically runs a background interval clock sync cycle to poll your backend references every 60 seconds, keeping client monitors hot and current without triggering structural full-page reloads.
                      </p>
                    </li>
                  </ul>
                </div>
              </details>
            </div>
          </>
        )}
      </div>
    </div>
  );
}