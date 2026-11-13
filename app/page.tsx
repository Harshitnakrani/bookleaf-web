'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { LandingPage } from '../components/LandingPage';
import { AuthorPortal } from '../components/AuthorPortal';
import { AdminPortal } from '../components/AdminPortal';
import { AuthModal } from '../components/AuthModal';
import { TicketDetailModal } from '../components/TicketDetailModal';
import { SubmitTicketModal } from '../components/SubmitTicketModal';
import { KnowledgeBaseModal } from '../components/KnowledgeBaseModal';
import {
  api,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from '../lib/api';
import { useRealtime } from '../lib/socket';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [currentTab, setCurrentTab] = useState<'landing' | 'author' | 'admin'>('landing');

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<'ADMIN' | 'AUTHOR' | undefined>(undefined);

  // Author Data
  const [books, setBooks] = useState<any[]>([]);
  const [booksSummary, setBooksSummary] = useState<any | null>(null);

  // Tickets Data
  const [tickets, setTickets] = useState<any[]>([]);

  // Modals & Drawers
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Auth State strictly from localStorage (if user was previously authenticated)
  useEffect(() => {
    const user = getStoredUser();
    const token = getStoredToken();
    if (user && token) {
      setCurrentUser(user);
      if (user.role === 'ADMIN') {
        setCurrentTab('admin');
      } else {
        setCurrentTab('author');
      }
    } else {
      setCurrentTab('landing');
    }
  }, []);

  // Fetch data whenever user or tab changes
  const refreshData = useCallback(async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);

      if (currentUser.role === 'ADMIN') {
        const tRes = await api.getTickets();
        setTickets(tRes.data || []);
      } else {
        const [booksRes, sumRes, tRes] = await Promise.all([
          api.getMyBooks().catch(() => []),
          api.getMyBooksSummary().catch(() => null),
          api.getTickets().catch(() => ({ data: [] })),
        ]);
        setBooks(booksRes);
        setBooksSummary(sumRes);
        setTickets(tRes.data || []);
      }
    } catch (err) {
      console.error('Failed to refresh data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Real-time Event Listener (WebSocket & SSE fallback)
  const handleRealtimeEvent = useCallback(
    (event: string, data: any) => {
      console.log('⚡ Real-time event received:', event, data);
      refreshData();
    },
    [refreshData],
  );

  const { isConnected: isRealtimeConnected } = useRealtime(
    handleRealtimeEvent,
    currentUser?.role === 'ADMIN' ? 'role:ADMIN' : `author:${currentUser?.id}`,
  );

  // Handle successful login from AuthModal
  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    if (user.role === 'ADMIN') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('author');
    }
  };

  const handleLogout = () => {
    setStoredToken(null);
    setStoredUser(null);
    setCurrentUser(null);
    setBooks([]);
    setBooksSummary(null);
    setTickets([]);
    setCurrentTab('landing');
  };

  const handleOpenLogin = (role?: 'ADMIN' | 'AUTHOR') => {
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const handleTabChange = (tab: 'landing' | 'author' | 'admin') => {
    if (!currentUser && (tab === 'author' || tab === 'admin')) {
      handleOpenLogin(tab === 'admin' ? 'ADMIN' : 'AUTHOR');
      return;
    }
    setCurrentTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans selection:bg-black selection:text-white">
      {/* Floating Modern Navbar */}
      <Navbar
        currentTab={currentTab}
        onChangeTab={handleTabChange}
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
        onOpenKnowledgeBase={() => setIsKnowledgeBaseOpen(true)}
        isRealtimeConnected={isRealtimeConnected}
      />

      {/* Main Dynamically Rendered Page Content */}
      <main className="flex-1">
        {/* Public Landing Website (Default for unauthenticated users, or when clicking Overview) */}
        {currentTab === 'landing' && (
          <LandingPage
            onOpenLogin={handleOpenLogin}
            onOpenKnowledgeBase={() => setIsKnowledgeBaseOpen(true)}
            isLoading={isLoading}
          />
        )}

        {/* Dynamic Author Studio Dashboard (Only accessible when logged in as AUTHOR) */}
        {currentTab === 'author' && currentUser?.role === 'AUTHOR' && (
          <AuthorPortal
            authorProfile={currentUser}
            books={books}
            summary={booksSummary}
            tickets={tickets}
            onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
            onSelectTicket={(t) => setSelectedTicketId(t.id)}
            isLoading={isLoading}
          />
        )}

        {/* Dynamic Admin Operations Dashboard (Only accessible when logged in as ADMIN) */}
        {currentTab === 'admin' && currentUser?.role === 'ADMIN' && (
          <AdminPortal
            tickets={tickets}
            onSelectTicket={(t) => setSelectedTicketId(t.id)}
            onRefresh={refreshData}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Real Production Auth Modal with Email & Password */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={authModalRole}
      />

      {/* Interactive Modals */}
      {selectedTicketId && (
        <TicketDetailModal
          ticketId={selectedTicketId}
          currentUser={currentUser}
          onClose={() => setSelectedTicketId(null)}
          onTicketUpdated={refreshData}
        />
      )}

      {isSubmitModalOpen && (
        <SubmitTicketModal
          books={books}
          onClose={() => setIsSubmitModalOpen(false)}
          onTicketCreated={refreshData}
        />
      )}

      {isKnowledgeBaseOpen && (
        <KnowledgeBaseModal onClose={() => setIsKnowledgeBaseOpen(false)} />
      )}

      {/* Modern Minimal Production Footer */}
      <footer className="bg-white border-t border-neutral-200 py-10 px-4 sm:px-6 lg:px-8 text-neutral-500 font-sans text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-bold text-neutral-900 text-sm">
              BookLeaf Publishing
            </div>
            <p className="text-neutral-400 text-xs">
              Author Support &amp; Publishing Operations Architecture.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] text-neutral-400">
            <span>NestJS</span>
            <span>&bull;</span>
            <span>Next.js 16</span>
            <span>&bull;</span>
            <span>Neon PostgreSQL</span>
            <span>&bull;</span>
            <span>BullMQ</span>
            <span>&bull;</span>
            <span>Valkey TLS</span>
            <span>&bull;</span>
            <span>Groq LLM</span>
          </div>

          <div className="text-[11px] text-neutral-400 font-mono">
            &copy; {new Date().getFullYear()} BookLeaf Publishing. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
