import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const SESSION_KEY = 'admin_session_active';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(async () => {
      await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
    }, INACTIVITY_TIMEOUT);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session) {
          sessionStorage.setItem(SESSION_KEY, 'true');
          resetInactivityTimer();
        } else {
          sessionStorage.removeItem(SESSION_KEY);
          if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        }
      }
    );

    // On load, check if this is a new browser session (sessionStorage is cleared on close)
    const wasActive = sessionStorage.getItem(SESSION_KEY);
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session && !wasActive) {
        await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
        setSession(null);
        setUser(null);
        setLoading(false);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        if (session) resetInactivityTimer();
      }
    });

    // Activity listeners for inactivity timeout
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => {
      if (session) resetInactivityTimer();
    };
    activityEvents.forEach(e => window.addEventListener(e, handleActivity));

    return () => {
      subscription.unsubscribe();
      activityEvents.forEach(e => window.removeEventListener(e, handleActivity));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [resetInactivityTimer]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) sessionStorage.setItem(SESSION_KEY, 'true');
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signOut = async () => {
    sessionStorage.removeItem(SESSION_KEY);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    await supabase.auth.signOut();
  };

  return { user, session, loading, signIn, signUp, signOut };
};
