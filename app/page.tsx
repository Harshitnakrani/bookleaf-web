'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { DemoAccountSwitcher } from '../components/DemoAccountSwitcher';
import { Navbar } from '../components/Navbar';
import { LandingPage } from '../components/LandingPage';
import { AuthorPortal } from '../components/AuthorPortal';
import { AdminPortal } from '../components/AdminPortal';
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

  // Initialize Auth State from LocalStorage
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
    }
  }, []);

  // Fetch data whenever user or tab changes
  const refreshData = useCallback(async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);

      if (currentUser.role === 'ADMIN') {
        // Admin gets all queue tickets
        const tRes = await api.getTickets();
        setTickets(tRes.data || []);
      } else {
        // Author gets their books, summary, and submitted tickets
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
      // Refresh tickets in background when event occurs
      refreshData();
    },
    [refreshData],
  );

  const { isConnected: isRealtimeConnected } = useRealtime(
    handleRealtimeEvent,
    currentUser?.role === 'ADMIN' ? 'role:ADMIN' : `author:${currentUser?.id}`,
  );

  // Quick Persona Selector Handler
  const handleSelectPersona = async (email: string) => {
    try {
      setIsLoading(true);
      const res = await api.login({
        email,
        password: 'Password123!',
      });

      setStoredToken(res.accessToken);
      setStoredUser(res.user);
      setCurrentUser(res.user);

      if (res.user.role === 'ADMIN') {
        setCurrentTab('admin');
      } else {
        setCurrentTab('author');
      }
    } catch (err: any) {
      alert(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
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

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans">
      {/* Quick Test Persona Switcher Bar */}
      <DemoAccountSwitcher
        currentUser={currentUser}
        onSelectPersona={handleSelectPersona}
        onLogout={handleLogout}
        isLoading={isLoading}
      />

      {/* Main Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onChangeTab={(tab) => {
          if (tab === 'author' && currentUser?.role === 'ADMIN') {
            // Auto switch to Priya Sharma if admin clicks author portal
            handleSelectPersona('priya.sharma@email.com');
            return;
          }
          if (tab === 'admin' && currentUser?.role !== 'ADMIN') {
            // Auto switch to Ops Admin if author clicks admin portal
            handleSelectPersona('admin@bookleaf.pub');
            return;
          }
          setCurrentTab(tab);
        }}
        currentUser={currentUser}
        onOpenKnowledgeBase={() => setIsKnowledgeBaseOpen(true)}
        isRealtimeConnected={isRealtimeConnected}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onSelectPersona={handleSelectPersona}
            onChangeTab={(t) => setCurrentTab(t)}
            onOpenKnowledgeBase={() => setIsKnowledgeBaseOpen(true)}
            isLoading={isLoading}
          />
        )}

        {currentTab === 'author' && (
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

        {currentTab === 'admin' && (
          <AdminPortal
            tickets={tickets}
            onSelectTicket={(t) => setSelectedTicketId(t.id)}
            onRefresh={refreshData}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Modals & Drawers */}
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

      {/* Minimal Monochrome Footer */}
      <footer className="bg-white border-t border-neutral-200 py-6 px-4 text-center text-xs text-neutral-500 font-mono space-y-1">
        <p className="font-semibold text-black font-sans text-xs">
          BookLeaf Publishing &bull; Author Support &amp; Communication Operations
        </p>
        <p className="text-[10px] text-neutral-400">
          NestJS &bull; Next.js &bull; Neon PostgreSQL &bull; BullMQ &bull; Valkey TLS &bull; Groq LLM
        </p>
        <p className="text-[9px] text-neutral-400">
          &copy; {new Date().getFullYear()} BookLeaf Publishing. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
