import { mkdir, writeFile } from "node:fs/promises";
import { basename } from "node:path";

const OUT = "src/data/speciesMedia.generated.json";
const AUDIO_DIR = "public/media/audio";
const H = "https://";
const COMMONS = H + "commons.wikimedia.org/w/api.php";
const XC = H + "xeno-canto.org/api/2/recordings";

const SPECIES = [
  ["crow", "Corbeau commun", "Corvus corax"],
  ["pigeon", "Pigeon urbain", "Columba livia"],
  ["duck", "Canard", "Anas platyrhynchos"],
  ["cat", "Chat", "Felis catus"],
  ["dog", "Chien", "Canis lupus familiaris"],
  ["owl", "Chouette / Hibou", "Strigiformes"],
  ["blackbird", "Merle noir", "Turdus merula"],
  ["robin", "Rouge-gorge familier", "Erithacus rubecula"],
  ["great_tit", "Mesange charbonniere", "Parus major"],
  ["blue_tit", "Mesange bleue", "Cyanistes caeruleus"],
  ["chaffinch", "Pinson des arbres", "Fringilla coelebs"],
  ["wren", "Troglodyte mignon", "Troglodytes troglodytes"],
  ["jay", "Geai des chenes", "Garrulus glandarius"],
  ["magpie", "Pie bavarde", "Pica pica"],
  ["carrion_crow", "Corneille noire", "Corvus corone"],
  ["wood_pigeon", "Pigeon ramier", "Columba palumbus"],
  ["green_woodpecker", "Pic vert", "Picus viridis"],
  ["great_spotted_woodpecker", "Pic epeiche", "Dendrocopos major"],
  ["ring_necked_parakeet", "Perruche a collier", "Psittacula krameri"],
  ["nightingale", "Rossignol philomele", "Luscinia megarhynchos"],
  ["house_sparrow", "Moineau domestique", "Passer domesticus"],
  ["starling", "Etourneau sansonnet", "Sturnus vulgaris"],
  ["collared_dove", "Tourterelle turque", "Streptopelia decaocto"],
  ["black_redstart", "Rougequeue noir", "Phoenicurus ochruros"],
  ["swift", "Martinet noir", "Apus apus"],
  ["barn_swallow", "Hirondelle rustique", "Hirundo rustica"],
  ["kestrel", "Faucon crecerelle", "Falco tinnunculus"],
];

function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&").trim();
}

function absoluteUrl(url = "") {
  if (!url) return "";
  if (url.startsWith("//")) return "https:" + url;
  if (url.startsWith("/")) return "https://xeno-canto.org" + url;
  return url;
}

function safeFilePart(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "sound";
}

async function json(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Creature-sync media collector" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function downloadMp3(url, animalId, recordingId) {
  const sourceUrl = absoluteUrl(url);
  if (!sourceUrl) return null;
  const res = await fetch(sourceUrl, { headers: { "User-Agent": "Creature-sync media collector" } });
  if (!res.ok) throw new Error(`${res.status} ${sourceUrl}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  const guessed = basename(new URL(sourceUrl).pathname).split("?")[0];
  const suffix = guessed.toLowerCase().endsWith(".mp3") ? "" : ".mp3";
  const filename = `${safeFilePart(animalId)}-${safeFilePart(recordingId || guessed)}${suffix}`;
  await mkdir(AUDIO_DIR, { recursive: true });
  await writeFile(`${AUDIO_DIR}/${filename}`, bytes);
  return `media/audio/${filename}`;
}

async function findCommonsImage(latin, label) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrnamespace: "6",
    gsrlimit: "8",
    gsrsearch: `${latin} ${label}`,
    prop: "imageinfo",
    iiprop: "url|extmetadata|mime|size",
    iiurlwidth: "900",
  });
  const data = await json(`${COMMONS}?${params}`);
  const pages = Object.values(data?.query?.pages || {});
  const candidates = pages
    .map(page => ({ page, info: page.imageinfo?.[0] }))
    .filter(x => x.info?.mime?.startsWith("image/") && !/map|range|distribution|egg|nest/i.test(x.page.title));
  const best = candidates[0];
  if (!best) return null;
  const meta = best.info.extmetadata || {};
  return {
    url: best.info.thumburl || best.info.url,
    source: best.info.descriptionurl,
    credit: stripHtml(meta.Artist?.value || best.info.user || "Wikimedia Commons"),
    license: stripHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || "Licence Commons a verifier"),
  };
}

async function findXenoAudio(latin, animalId) {
  const params = new URLSearchParams({ query: `${latin} q:A` });
  const data = await json(`${XC}?${params}`);
  const recordings = data?.recordings || [];
  const best = recordings.find(r => r.file && r.lic) || recordings[0];
  if (!best) return null;
  const recordingId = best.id ? `XC${best.id}` : "";
  const remoteUrl = absoluteUrl(best.file);
  const localUrl = await downloadMp3(remoteUrl, animalId, recordingId || best.id || "xeno-canto");
  return {
    url: localUrl || remoteUrl,
    remoteUrl,
    source: best.url,
    credit: best.rec || "xeno-canto",
    license: best.lic || "Creative Commons, verifier fiche source",
    recordingId,
  };
}

async function collect() {
  const rows = [];
  for (const [animalId, label, latin] of SPECIES) {
    const row = { animal_id: animalId, label, latin, photo: null, audio: null, validated: false };
    try { row.photo = await findCommonsImage(latin, label); } catch (err) { row.photo_error = String(err.message || err); }
    if (!/(felis|canis|strigiformes)/i.test(latin)) {
      try { row.audio = await findXenoAudio(latin, animalId); } catch (err) { row.audio_error = String(err.message || err); }
    }
    rows.push(row);
    console.log(`${animalId}: photo=${Boolean(row.photo)} audio=${Boolean(row.audio)}`);
  }
  await mkdir("src/data", { recursive: true });
  await writeFile(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2));
  console.log(`Wrote ${OUT}`);
  console.log(`Downloaded MP3 files into ${AUDIO_DIR}`);
}

collect().catch(err => {
  console.error(err);
  process.exit(1);
});
