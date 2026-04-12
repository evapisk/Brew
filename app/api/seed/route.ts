import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const FAKE_USERS = [
  {
    name: "Maya Chen",
    email: "maya.chen.demo@brew.app",
    year: 2,
    goals: ["break-into-tech", "build-my-network", "ship-a-side-project"],
    skills_offer: ["figma", "graphic-design", "content-creation"],
    skills_want: ["python", "javascript", "data-analysis"],
    organizations: [],
  },
  {
    name: "Jordan Williams",
    email: "jordan.williams.demo@brew.app",
    year: 3,
    goals: ["launch-a-startup", "find-a-cofounder", "ace-technical-interviews"],
    skills_offer: ["python", "machine-learning", "data-analysis"],
    skills_want: ["figma", "graphic-design", "public-speaking"],
    organizations: [],
  },
  {
    name: "Priya Nair",
    email: "priya.nair.demo@brew.app",
    year: 2,
    goals: ["break-into-finance", "build-my-network", "land-first-internship"],
    skills_offer: ["financial-modeling", "excel", "writing"],
    skills_want: ["python", "data-analysis", "javascript"],
    organizations: [],
  },
  {
    name: "Alex Torres",
    email: "alex.torres.demo@brew.app",
    year: 4,
    goals: ["get-into-grad-school", "publish-research", "build-my-network"],
    skills_offer: ["javascript", "sql", "writing"],
    skills_want: ["figma", "brand-design", "content-creation"],
    organizations: [],
  },
  {
    name: "Sam Park",
    email: "sam.park.demo@brew.app",
    year: 1,
    goals: ["land-first-internship", "break-into-tech", "ace-technical-interviews"],
    skills_offer: ["video-editing", "content-creation", "graphic-design"],
    skills_want: ["python", "javascript", "machine-learning"],
    organizations: [],
  },
];

export async function POST() {
  // Verify the caller is authenticated
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cs: Array<{ name: string; value: string; options?: Record<string, unknown> }>) =>
          cs.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          ),
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get the current user's university so fake users match on it
  const { data: me } = await admin
    .from("users")
    .select("university")
    .eq("auth_id", user.id)
    .single();

  if (!me?.university) {
    return NextResponse.json({ error: "Set your university in your profile first" }, { status: 400 });
  }

  const results = [];
  for (const fake of FAKE_USERS) {
    // Check if already exists
    const { data: existing } = await admin
      .from("users")
      .select("id")
      .eq("email", fake.email)
      .maybeSingle();

    if (existing) {
      results.push({ name: fake.name, status: "already exists" });
      continue;
    }

    const { error } = await admin.from("users").insert({
      email: fake.email,
      name: fake.name,
      university: me.university,
      year: fake.year,
      goals: fake.goals,
      skills_offer: fake.skills_offer,
      skills_want: fake.skills_want,
      organizations: fake.organizations,
      onboarded: true,
      is_active: true,
    });

    results.push({ name: fake.name, status: error ? `error: ${error.message}` : "created" });
  }

  return NextResponse.json({ ok: true, university: me.university, results });
}
