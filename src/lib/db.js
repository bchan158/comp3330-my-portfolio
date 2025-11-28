"use server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DB_URL);

function mapProject(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.img || row.image, // Support both img and image for compatibility
    link: row.link,
    keywords: row.keywords ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function ensureProjectsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id uuid PRIMARY KEY,
      title text NOT NULL,
      description text NOT NULL,
      img text NOT NULL,
      link text NOT NULL,
      keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

export async function seedProjectsTable(seed) {
  for (const item of seed) {
    await sql`
      insert into projects (title, description, img, link, keywords)
      values (${item.title}, ${item.description}, ${item.image || item.img}, ${
      item.link
    }, ${item.keywords})
      on conflict do nothing;
    `;
  }
}

export async function fetchProjects() {
  const rows = await sql`select * from projects order by created_at desc`;
  return rows.map(mapProject);
}

export async function getProjectById(id) {
  const [row] = await sql`select * from projects where id = ${id} limit 1`;
  return row ? mapProject(row) : null;
}

export async function insertProject(data) {
  // Generate UUID for new project using PostgreSQL's gen_random_uuid()
  const [row] = await sql`
    insert into projects (id, title, description, img, link, keywords)
    values (gen_random_uuid(), ${data.title}, ${data.description}, ${
    data.image || data.img
  }, ${data.link}, ${JSON.stringify(data.keywords || [])}::jsonb)
    returning *;
  `;
  return mapProject(row);
}

export async function updateProject(id, updates) {
  // Prepare update values, using existing values for fields that aren't provided
  const imageValue = updates.image || updates.img;

  // Build the update query conditionally
  let row;

  if (updates.keywords !== undefined) {
    // If keywords are provided, update them
    const keywordsJson = JSON.stringify(updates.keywords);
    [row] = await sql`
      update projects
      set 
        title = coalesce(${updates.title ?? null}, title),
        description = coalesce(${updates.description ?? null}, description),
        img = coalesce(${imageValue ?? null}, img),
        link = coalesce(${updates.link ?? null}, link),
        keywords = ${keywordsJson}::jsonb,
        updated_at = now()
      where id = ${id}::uuid
      returning *;
    `;
  } else {
    // If keywords are not provided, don't update them
    [row] = await sql`
      update projects
      set 
        title = coalesce(${updates.title ?? null}, title),
        description = coalesce(${updates.description ?? null}, description),
        img = coalesce(${imageValue ?? null}, img),
        link = coalesce(${updates.link ?? null}, link),
        updated_at = now()
      where id = ${id}::uuid
      returning *;
    `;
  }

  return row ? mapProject(row) : null;
}

export async function deleteProject(id) {
  const [row] = await sql`delete from projects where id = ${id} returning *;`;
  return row ? mapProject(row) : null;
}
