#!/usr/bin/env node

const NOTION_VERSION = "2022-06-28";
const dataSourceId = process.env.NOTION_CREATURE_SYNC_SOURCE_ID || "2ccc8fed-9f55-41ef-aafe-6749221567f3";
const token = process.env.NOTION_TOKEN || process.env.NOTION_API_KEY;

const out = process.env.CREATURE_SYNC_NOTION_OUT || "src/data/notionSpecies.generated.json";

const column = {
  id: "animal_id",
  nameFr: "Nom français",
  latin: "Nom latin",
  type: "Type",
  emoji: "Emoji",
  active: "actif",
  priority: "priorité",
  mediaType: "type_media",
  youtubeUrl: "youtube_url",
  youtubeVideoId: "youtube_video_id",
  playlistId: "playlist_id",
  embedOk: "embed_ok",
  notes: "notes",
  audioLocalPath: "audio_local_path",
  audioWebUrl: "audio_web_url",
  audioSource: "audio_source",
  audioLicense: "audio_license",
  audioStatus: "audio_status",
  fallbackKind: "fallback_kind",
  detectionContext: "detection_context",
  phrasesFr: "phrases_fr",
  phrasesEn: "phrases_en",
  phrasesEs: "phrases_es",
  sarcasmLevel: "sarcasm_level",
  octopusProfile: "octopus_profile",
};

function textFromRichText(items = []) {
  return items.map(item => item.plain_text || "").join("").trim();
}

function readProperty(prop) {
  if (!prop) return null;
  switch (prop.type) {
    case "title": return textFromRichText(prop.title);
    case "rich_text": return textFromRichText(prop.rich_text);
    case "url": return prop.url || null;
    case "number": return prop.number ?? null;
    case "checkbox": return Boolean(prop.checkbox);
    case "select": return prop.select?.name || null;
    case "multi_select": return (prop.multi_select || []).map(item => item.name);
    default: return null;
  }
}

function mapPage(page) {
  const p = page.properties || {};
  const get = key => readProperty(p[column[key]]);
  const id = get("id") || String(get("nameFr") || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  return {
    id,
    label: get("nameFr"),
    latin: get("latin"),
    type: get("type"),
    emoji: get("emoji"),
    active: get("active"),
    priority: get("priority") || 0,
    mediaType: get("mediaType"),
    youtubeUrl: get("youtubeUrl"),
    youtubeVideoId: get("youtubeVideoId"),
    playlistId: get("playlistId"),
    embedOk: get("embedOk"),
    notes: get("notes"),
    audioLocalPath: get("audioLocalPath"),
    audioWebUrl: get("audioWebUrl"),
    audioSource: get("audioSource"),
    audioLicense: get("audioLicense"),
    audioStatus: get("audioStatus"),
    fallbackKind: get("fallbackKind"),
    detectionContext: get("detectionContext"),
    phrases: {
      fr: splitPhrases(get("phrasesFr")),
      en: splitPhrases(get("phrasesEn")),
      es: splitPhrases(get("phrasesEs")),
    },
    sarcasmLevel: get("sarcasmLevel") || 0,
    octopusProfile: get("octopusProfile"),
    notionUrl: page.url,
  };
}

function splitPhrases(value) {
  if (!value) return [];
  return String(value).split(/\n|\|/).map(part => part.trim()).filter(Boolean);
}

async function notion(path, body) {
  const res = await fetch(`https://api.notion.com/v1/${path}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  return res.json();
}

async function main() {
  if (!token) {
    console.error("Missing NOTION_TOKEN or NOTION_API_KEY. Export a Notion integration token before running sync:notion.");
    process.exit(1);
  }

  const pages = [];
  let cursor;
  do {
    const data = await notion(`data_sources/${dataSourceId}/query`, {
      page_size: 100,
      start_cursor: cursor,
      sorts: [{ property: column.priority, direction: "descending" }],
    });
    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  const rows = pages.map(mapPage).filter(row => row.active !== false);
  const payload = {
    generatedAt: new Date().toISOString(),
    source: {
      type: "notion",
      dataSourceId,
      schemaVersion: "3.3",
    },
    rows,
  };

  const fs = await import("node:fs/promises");
  await fs.writeFile(out, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(`Synced ${rows.length} Creature Sync species rows from Notion to ${out}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
