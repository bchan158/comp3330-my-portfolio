import { neon } from "@neondatabase/serverless";

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
        link text not null,
        keywords text[] default '{}',
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
      await sql`alter table projects add column keywords text[] default '{}';`;
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
    image: row.image,
    img: row.image, // alias for compatibility
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
      select id, title, description, image, link, keywords,
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
      select id, title, description, image, link, keywords,
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
      insert into projects (id, title, description, image, link, keywords)
      values (${id}, ${title}, ${description}, ${image}, ${link}, ${keywords}::text[])
      returning id, title, description, image, link, keywords,
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
    }
    if (updates.link !== undefined) {
      setParts.push(sql`link = ${updates.link}`);
    }
    if (updates.keywords !== undefined) {
      setParts.push(sql`keywords = ${updates.keywords}::text[]`);
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
