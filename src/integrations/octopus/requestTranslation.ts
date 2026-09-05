import type { Species } from "../../data/animals";
import type { Lang } from "../../data/translations";

// Reprend la configuration de l'adaptateur (voir ./index.ts) : même drapeau
// d'activation, même endpoint, même délai. Sans endpoint configuré on ne tente
// rien — la traduction locale déjà affichée reste en place.
const enabledFlag = import.meta.env.VITE_OCTOPUS_ADAPTER_ENABLED;
const ENABLED = enabledFlag !== "false" && enabledFlag !== "0";
const ENDPOINT = String(
  import.meta.env.VITE_OCTOPUS_ADAPTER_ENDPOINT || import.meta.env.VITE_OCTOPUS_API_URL || "",
).replace(/\/$/, "");
const configuredTimeout = Number(import.meta.env.VITE_OCTOPUS_ADAPTER_TIMEOUT_MS);
const TIMEOUT_MS = Number.isFinite(configuredTimeout) && configuredTimeout > 0 ? configuredTimeout : 6000;

// Même vocabulaire que CreatureSyncOctopusAdapter : un statut hors de cette
// liste (« failed » quand aucun exécuteur ne porte la capacité, par exemple)
// arrive en HTTP 200 avec un message d'erreur dans output.text. Sans ce
// contrôle, ce message d'erreur s'afficherait comme la phrase de l'animal.
const ACCEPTED_STATUSES = new Set(["completed", "queued", "running", "accepted", "ok", "success"]);

// Les lignes locales de phraseBanks.ts font au plus ~80 caractères et la carte
// les affiche à la machine à écrire (45 ms/caractère). Au-delà de cette borne,
// Mistral a ignoré la consigne « une seule phrase » : on garde le texte local.
const MAX_LENGTH = 200;

const LANG_NAMES: Record<Lang, string> = { fr: "français", en: "English", es: "español" };

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

// Octopus renvoie toujours le texte brut de Mistral dans output.text — jamais
// un objet déjà structuré. Mistral entoure parfois sa réponse de balises
// ```json (même piège que sur 420-dice-game-reboot). Toute forme qu'on ne sait
// pas lire renvoie "" : mieux vaut conserver la ligne locale qu'afficher du
// JSON brut à l'utilisateur.
function extractText(payload: unknown): string {
  const raw = asRecord(asRecord(payload).output).text;
  if (typeof raw !== "string" || !raw.trim()) return "";
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

  let candidate = cleaned;
  try {
    const parsed = JSON.parse(cleaned);
    if (typeof parsed === "string") {
      candidate = parsed;
    } else {
      // Objet ou tableau : seule la forme { text } est contractuelle. Toute
      // autre clé serait rendue telle quelle, accolades comprises.
      const value = asRecord(parsed).text;
      if (typeof value !== "string") return "";
      candidate = value;
    }
  } catch {
    // Pas du JSON : Mistral a répondu en texte libre, on le garde tel quel.
  }

  return normalize(candidate);
}

// La carte de traduction est une ligne unique : on aplatit les retours à la
// ligne et on retire les guillemets que Mistral ajoute parfois malgré la consigne.
function normalize(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim().replace(/^["“«\s]+|["”»\s]+$/g, "").trim();
  return flat.length > MAX_LENGTH ? "" : flat;
}

/**
 * Demande à Octopus (via sa capacité générique content.social.write, portée
 * par Mistral) une ligne de traduction sarcastique inédite pour cette espèce,
 * plutôt que de piocher dans la liste fixe de phraseBanks.ts. Ne bloque
 * jamais l'affichage : à utiliser en amélioration progressive après avoir
 * déjà montré la traduction locale. Renvoie null dès que le moindre doute
 * existe — l'appelant conserve alors le texte local.
 */
export async function requestOctopusTranslation(
  species: Species,
  lang: Lang,
  habitat: string,
  suspect: boolean,
): Promise<string | null> {
  if (!ENABLED || !ENDPOINT) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${ENDPOINT}/mission`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        operationId: `creature_sync_translation_${Date.now()}`,
        title: "Creature-Sync · traduction sarcastique",
        objective: "Générer une ligne de traduction animale sarcastique inédite.",
        requiredCapabilities: ["content.social.write"],
        authorizationPolicy: { internalWork: "allowed", externalAction: "forbidden" },
        context: {
          id: "creature-sync",
          label: "Creature-Sync",
          objective: "Divertir avec une traduction animale à la fois crédible et sarcastique.",
        },
        prompt: [
          "Tu traduis le cri ou le chant d'un animal en une phrase courte, sarcastique, à la première personne (l'animal qui parle), dans le ton d'un comité animal blasé qui observe les humains avec une lassitude amusée.",
          `Espèce : ${species.scientificName?.[lang] || species.name || species.id}`,
          `Habitat détecté : ${habitat || "non précisé"}`,
          suspect ? "Confiance faible : reste ambigu et un peu méfiant dans le ton." : "Confiance normale.",
          `Réponds uniquement en ${LANG_NAMES[lang]}, une seule phrase de moins de 200 caractères, sans guillemets ni préambule.`,
          "N'invente aucun fait biologique précis sur l'espèce (pas de nom scientifique, pas de statistique) : reste dans le registre de l'humour, pas de la fiche technique.",
        ].join("\n"),
      }),
    });

    if (!response.ok) return null;

    const payload = await response.json() as unknown;
    const status = String(asRecord(payload).status || asRecord(asRecord(payload).output).status || "").trim().toLowerCase();
    if (status && !ACCEPTED_STATUSES.has(status)) return null;

    return extractText(payload) || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
