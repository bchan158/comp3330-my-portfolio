import { neon } from "@neondatabase/serverless";
import { createSlug } from "./utils";

// Initialize database connection with proper error handling
const dbUrl = process.env.NEON_DB_URL;
const sql = dbUrl ? neon(dbUrl) : null;

const HERO_PLACEHOLDER_AVATAR = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
const defaultHeroContent = {
  avatar: HERO_PLACEHOLDER_AVATAR,
  fullName: "...",
  shortDescription: "...",
  longDescription: "...",
};

// Hero table functions
function mapHeroRow(row) {
  return {
    id: row.id,
    avatar: row.avatar || defaultHeroContent.avatar,
    fullName: row.full_name || defaultHeroContent.fullName,
    shortDescription:
      row.short_description || defaultHeroContent.shortDescription,
    longDescription: row.long_description || defaultHeroContent.longDescription,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// Shared helpers
const safePage = (page = 1) => {
  const parsed = Number(page);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
};

const safePageSize = (pageSize = 10, max = 50) => {
  const parsed = Number(pageSize);
  if (!Number.isFinite(parsed) || parsed <= 0) return 10;
  return Math.min(Math.floor(parsed), max);
};

async function seedHeroTable() {
  if (!sql) return;
  try {
    const id = crypto.randomUUID();
    await sql`
      insert into hero (id, avatar, full_name, short_description, long_description)
      values (${id}, ${defaultHeroContent.avatar}, ${defaultHeroContent.fullName}, 
              ${defaultHeroContent.shortDescription}, ${defaultHeroContent.longDescription})
    `;
  } catch (error) {
    console.error("Error seeding hero table:", error);
    throw error;
  }
}

export async function ensureHeroTable() {
  if (!sql) return;
  try {
    await sql`
      create table if not exists hero (
        id uuid primary key,
        avatar text not null default '',
        full_name text not null,
        short_description text not null check (char_length(short_description) <= 120),
        long_description text not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
    `;
    const [{ count }] = await sql`select count(*)::int as count from hero`;
    if (Number(count) === 0) await seedHeroTable();
  } catch (error) {
    console.error("Error ensuring hero table:", error);
    throw error;
  }
}

export async function getHero() {
  if (!sql) return null;
  try {
    await ensureHeroTable();
    const [row] = await sql`
      select id, avatar, full_name, short_description, long_description,
             created_at as "createdAt", updated_at as "updatedAt"
      from hero
      order by created_at asc
      limit 1;
    `;
    return row ? mapHeroRow(row) : null;
  } catch (error) {
    console.error("Error getting hero:", error);
    return null;
  }
}

export async function upsertHero(updates = {}) {
  if (!sql) {
    throw new Error("Database not configured");
  }
  try {
    await ensureHeroTable();
    const current = await getHero();

    // Merge defaults → current → updates
    const merged = {
      avatar: updates.avatar ?? current?.avatar ?? defaultHeroContent.avatar,
      fullName:
        updates.fullName ?? current?.fullName ?? defaultHeroContent.fullName,
      shortDescription:
        updates.shortDescription ??
        current?.shortDescription ??
        defaultHeroContent.shortDescription,
      longDescription:
        updates.longDescription ??
        current?.longDescription ??
        defaultHeroContent.longDescription,
    };

    // Normalize short description length
    if (merged.shortDescription.length > 120) {
      merged.shortDescription = merged.shortDescription.substring(0, 120);
    }

    if (current) {
      // Update existing hero
      const [row] = await sql`
        update hero
        set avatar = ${merged.avatar},
            full_name = ${merged.fullName},
            short_description = ${merged.shortDescription},
            long_description = ${merged.longDescription},
            updated_at = now()
        where id = ${current.id}
        returning id, avatar, full_name, short_description, long_description,
                  created_at as "createdAt", updated_at as "updatedAt"
      `;
      return row ? mapHeroRow(row) : null;
    } else {
      // Insert new hero
      const id = crypto.randomUUID();
      const [row] = await sql`
        insert into hero (id, avatar, full_name, short_description, long_description)
        values (${id}, ${merged.avatar}, ${merged.fullName}, 
                ${merged.shortDescription}, ${merged.longDescription})
        returning id, avatar, full_name, short_description, long_description,
                  created_at as "createdAt", updated_at as "updatedAt"
      `;
      return row ? mapHeroRow(row) : null;
    }
  } catch (error) {
    console.error("Error upserting hero:", error);
    throw error;
  }
}

// Projects table functions
export async function ensureProjectsTable() {
  if (!sql) return;
  try {
    // Create table if it doesn't exist
    await sql`
      create table if not exists projects (
        id uuid primary key default gen_random_uuid(),
        title text not null,
        description text not null,
        image text not null,
        img text default '',
        link text not null,
        keywords jsonb default '[]',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
    `;

    // Check and add missing columns for existing tables
    // Check if 'image' column exists
    const imageColumnCheck = await sql`
      select column_name 
      from information_schema.columns 
      where table_name = 'projects' and column_name = 'image';
    `;

    if (imageColumnCheck.length === 0) {
      // Column doesn't exist, add it with a default value
      await sql`alter table projects add column image text default '';`;
      // Update existing rows to have a default value
      await sql`update projects set image = '' where image is null;`;
    }

    // Check if 'keywords' column exists
    const keywordsColumnCheck = await sql`
      select column_name 
      from information_schema.columns 
      where table_name = 'projects' and column_name = 'keywords';
    `;

    if (keywordsColumnCheck.length === 0) {
      // Column doesn't exist, add it
      await sql`alter table projects add column keywords jsonb default '[]';`;
    }

    // Check if 'img' column exists (legacy support)
    const imgColumnCheck = await sql`
      select column_name 
      from information_schema.columns 
      where table_name = 'projects' and column_name = 'img';
    `;

    if (imgColumnCheck.length === 0) {
      await sql`alter table projects add column img text default '';`;
    }
  } catch (error) {
    console.error("Error ensuring projects table:", error);
    throw error;
  }
}

function mapProjectRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.img || row.image,
    img: row.img || row.image, // alias for compatibility
    link: row.link,
    keywords: row.keywords || [],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function fetchProjects() {
  if (!sql) return [];
  try {
    await ensureProjectsTable();
    const rows = await sql`
      select id, title, description, image, img, link, keywords,
             created_at as "createdAt", updated_at as "updatedAt"
      from projects
      order by created_at desc;
    `;
    return rows.map(mapProjectRow);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getProjectById(id) {
  if (!sql) return null;
  try {
    await ensureProjectsTable();
    const [row] = await sql`
      select id, title, description, image, img, link, keywords,
             created_at as "createdAt", updated_at as "updatedAt"
      from projects
      where id = ${id};
    `;
    return row ? mapProjectRow(row) : null;
  } catch (error) {
    console.error("Error getting project by id:", error);
    return null;
  }
}

export async function insertProject({
  title,
  description,
  image,
  link,
  keywords = [],
}) {
  if (!sql) {
    throw new Error("Database not configured");
  }
  try {
    await ensureProjectsTable();
    const id = crypto.randomUUID();
    const [row] = await sql`
      insert into projects (id, title, description, image, img, link, keywords)
      values (${id}, ${title}, ${description}, ${image}, ${image}, ${link}, ${JSON.stringify(
        keywords
      )}::jsonb)
      returning id, title, description, image, img, link, keywords,
                created_at as "createdAt", updated_at as "updatedAt";
    `;
    return mapProjectRow(row);
  } catch (error) {
    console.error("Error inserting project:", error);
    throw error;
  }
}

export async function updateProject(id, updates = {}) {
  if (!sql) {
    throw new Error("Database not configured");
  }
  try {
    await ensureProjectsTable();

    const setParts = [];
    if (updates.title !== undefined) {
      setParts.push(sql`title = ${updates.title}`);
    }
    if (updates.description !== undefined) {
      setParts.push(sql`description = ${updates.description}`);
    }
    if (updates.image !== undefined) {
      setParts.push(sql`image = ${updates.image}`);
      setParts.push(sql`img = ${updates.image}`);
    }
    if (updates.link !== undefined) {
      setParts.push(sql`link = ${updates.link}`);
    }
    if (updates.keywords !== undefined) {
      setParts.push(
        sql`keywords = ${JSON.stringify(updates.keywords)}::jsonb`
      );
    }

    if (setParts.length === 0) {
      return getProjectById(id);
    }

    setParts.push(sql`updated_at = now()`);

    const setClause = setParts.reduce((acc, curr, index) => {
      if (index === 0) return curr;
      return sql`${acc}, ${curr}`;
    });

    const [row] = await sql`
      update projects
      set ${setClause}
      where id = ${id}
      returning id, title, description, image, link, keywords,
                created_at as "createdAt", updated_at as "updatedAt";
    `;

    return row ? mapProjectRow(row) : null;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

export async function deleteProject(id) {
  if (!sql) {
    throw new Error("Database not configured");
  }
  try {
    await ensureProjectsTable();
    const [row] = await sql`
      delete from projects
      where id = ${id}
      returning id, title, description, image, link, keywords,
                created_at as "createdAt", updated_at as "updatedAt";
    `;
    return row ? mapProjectRow(row) : null;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

// Blog post functions
function mapPostRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    preview: row.preview,
    content: row.content,
    author: row.author,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function ensurePostsTable() {
  if (!sql) return;
  try {
    await sql`
      create table if not exists blog_posts (
        id uuid primary key default gen_random_uuid(),
        slug text unique not null,
        title text not null,
        preview text not null,
        content text not null,
        author text,
        published_at timestamptz default now(),
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
    `;
    await sql`
      create index if not exists idx_blog_posts_published_at on blog_posts (published_at desc);
    `;
  } catch (error) {
    console.error("Error ensuring blog_posts table:", error);
    throw error;
  }
}

export async function createPost({
  title,
  preview,
  content,
  author,
  slug,
  publishedAt,
}) {
  if (!sql) throw new Error("Database not configured");
  try {
    await ensurePostsTable();
    const baseSlug = createSlug(slug || title || crypto.randomUUID());
    let candidate = baseSlug;
    let attempt = 1;
    while (attempt < 6) {
      const existing =
        await sql`select slug from blog_posts where slug = ${candidate} limit 1`;
      if (existing.length === 0) break;
      candidate = `${baseSlug}-${attempt}`;
      attempt += 1;
    }
    const [row] = await sql`
      insert into blog_posts (slug, title, preview, content, author, published_at)
      values (${candidate}, ${title}, ${preview}, ${content}, ${
      author || ""
    }, ${publishedAt || sql`now()`})
      returning id, slug, title, preview, content, author,
                published_at as "publishedAt",
                created_at as "createdAt",
                updated_at as "updatedAt";
    `;
    return mapPostRow(row);
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function fetchPostsPaginated({ page = 1, pageSize = 5 } = {}) {
  if (!sql) return { items: [], total: 0, page: 1, pageSize };
  try {
    await ensurePostsTable();
    const currentPage = safePage(page);
    const size = safePageSize(pageSize, 25);
    const offset = (currentPage - 1) * size;
    const [{ count }] =
      await sql`select count(*)::int as count from blog_posts`;
    const rows = await sql`
      select id, slug, title, preview, content, author,
             published_at as "publishedAt",
             created_at as "createdAt",
             updated_at as "updatedAt"
      from blog_posts
      order by published_at desc
      limit ${size} offset ${offset};
    `;
    return {
      items: rows.map(mapPostRow),
      total: Number(count) || 0,
      page: currentPage,
      pageSize: size,
    };
  } catch (error) {
    console.error("Error fetching paginated posts:", error);
    return { items: [], total: 0, page: 1, pageSize };
  }
}

export async function getPostBySlug(slug) {
  if (!sql) return null;
  try {
    await ensurePostsTable();
    const [row] = await sql`
      select id, slug, title, preview, content, author,
             published_at as "publishedAt",
             created_at as "createdAt",
             updated_at as "updatedAt"
      from blog_posts
      where slug = ${slug}
      limit 1;
    `;
    return row ? mapPostRow(row) : null;
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}

// Booking functions
function mapBookingRow(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    slot: row.slot,
    notes: row.notes,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function ensureBookingsTable() {
  if (!sql) return;
  try {
    await sql`
      create table if not exists bookings (
        id uuid primary key default gen_random_uuid(),
        name text not null,
        email text not null,
        slot timestamptz not null,
        notes text,
        status text not null default 'pending',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        unique(slot)
      );
    `;
    await sql`
      create index if not exists idx_bookings_slot on bookings (slot desc);
    `;
  } catch (error) {
    console.error("Error ensuring bookings table:", error);
    throw error;
  }
}

export async function createBooking({ name, email, slot, notes }) {
  if (!sql) throw new Error("Database not configured");
  try {
    await ensureBookingsTable();
    const slotDate = new Date(slot);
    if (Number.isNaN(slotDate.getTime())) {
      throw new Error("Invalid slot date");
    }
    const existing = await sql`
      select id from bookings
      where slot = ${slotDate.toISOString()}
      limit 1;
    `;
    if (existing.length > 0) {
      throw new Error("Slot already booked");
    }
    const [row] = await sql`
      insert into bookings (name, email, slot, notes)
      values (${name}, ${email}, ${slotDate.toISOString()}, ${notes || ""})
      returning id, name, email, slot, notes, status,
                created_at as "createdAt", updated_at as "updatedAt";
    `;
    return mapBookingRow(row);
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

export async function listBookings({ upcomingOnly = true } = {}) {
  if (!sql) return [];
  try {
    await ensureBookingsTable();
    const filter = upcomingOnly ? sql`where slot >= now()` : sql``;
    const rows = await sql`
      select id, name, email, slot, notes, status,
             created_at as "createdAt", updated_at as "updatedAt"
      from bookings
      ${filter}
      order by slot asc;
    `;
    return rows.map(mapBookingRow);
  } catch (error) {
    console.error("Error listing bookings:", error);
    return [];
  }
}

// Route visits analytics
function mapVisitRow(row) {
  return {
    path: row.path,
    visitedAt: row.visitedAt,
    count: row.count,
  };
}

export async function ensureRouteVisitsTable() {
  if (!sql) return;
  try {
    await sql`
      create table if not exists route_visits (
        id uuid primary key default gen_random_uuid(),
        path text not null,
        visited_at timestamptz not null default now()
      );
    `;
    await sql`
      create index if not exists idx_route_visits_path on route_visits (path);
    `;
    await sql`
      create index if not exists idx_route_visits_visited_at on route_visits (visited_at desc);
    `;
  } catch (error) {
    console.error("Error ensuring route_visits table:", error);
    throw error;
  }
}

export async function recordRouteVisit(path) {
  if (!sql) return null;
  try {
    await ensureRouteVisitsTable();
    await sql`
      insert into route_visits (path)
      values (${path});
    `;
  } catch (error) {
    console.error("Error recording route visit:", error);
  }
}

export async function getRouteStats() {
  if (!sql) return { totals: [], recent: [] };
  try {
    await ensureRouteVisitsTable();
    const totals = await sql`
      select path, count(*)::int as count
      from route_visits
      group by path
      order by count desc;
    `;
    const recent = await sql`
      select path, visited_at as "visitedAt"
      from route_visits
      order by visited_at desc
      limit 25;
    `;
    return {
      totals: totals.map((row) => ({ path: row.path, count: row.count })),
      recent: recent.map((row) => ({
        path: row.path,
        visitedAt: row.visitedAt,
      })),
    };
  } catch (error) {
    console.error("Error getting route stats:", error);
    return { totals: [], recent: [] };
  }
}
