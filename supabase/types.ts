// ── Database row types (mirror the Supabase schema exactly) ──────────────────

export type MatchStatus = 'pending' | 'accepted' | 'met' | 'partners';

export interface User {
  id: string;
  auth_id: string | null;        // FK → auth.users.id
  email: string;
  name: string;
  university: string;
  year: number;
  goals: string[];
  skills_offer: string[];
  skills_want: string[];
  organizations: string[];
  partner_id: string | null;
  is_active: boolean;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  user_a_id: string;
  user_b_id: string;
  score: number;                 // int4 in DB (0-100 scale)
  match_reason: string[] | null; // 2-3 short bullets about the other person
  breakdown: SkoreBreakdown | null;  // jsonb in DB (was skill_breakdown)
  status: string;                // plain text in DB (not an enum)
  created_at: string;
}

export interface Partnership {
  id: string;
  user_a_id: string;
  user_b_id: string;
  cadence: 'weekly' | 'biweekly' | null;
  focus_goal: string | null;
  check_in_streak: number;
  last_checkin_at: string | null;
  created_at: string;
}

// ── Matching engine types ─────────────────────────────────────────────────────

export interface SkoreBreakdown {
  sharedGoals: string[];
  aOffersB: string[];   // userA.skills_offer ∩ userB.skills_want
  bOffersA: string[];   // userB.skills_offer ∩ userA.skills_want
  isMutual: boolean;
  sharedOrgs: string[];
}

export interface ScoreResult {
  score: number;
  breakdown: SkoreBreakdown;
}

export type MatchStrength = 'Exceptional Match' | 'Strong Match' | 'Good Match';

export interface MatchCandidate {
  user: User;
  score: number;
  breakdown: SkoreBreakdown;
  match_reason: string[] | null;
  strength: MatchStrength;
}

// ── Supabase Database type (used by the Supabase client) ─────────────────────

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<User, 'id'>>;
      };
      matches: {
        Row: Match;
        Insert: Omit<Match, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Match, 'id'>>;
      };
      partnerships: {
        Row: Partnership;
        Insert: Omit<Partnership, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Partnership, 'id'>>;
      };
    };
    Enums: {};
  };
};
