import type { Species } from "../../data/animals";
import type { Lang } from "../../data/translations";

// Octopus renvoie toujours le texte brut de Mistral dans output.text — jamais
// un objet déjà structuré. Mistral entoure parfois sa réponse de balises
// ```json — on gère les deux cas (même correctif que 420-dice-game-reboot,
// où ce même piège avait cassé le lien avec Octopus).
function extractText(payload: unknown): string {
  const source = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
  const output = source.output && typeof source.output === "object" ? source.output as Record<string, unknown> : {};
  const raw = typeof output.text === "string" ? output.text : "";
  if (!raw.trim()) return "";
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed === "object" && typeof (parsed as Record<string, unknown>).text === "string") {
      return String((parsed as Record<string, unknown>).text).trim();
    }
  } catch {
    // Pas du JSON : Mistral a répondu directement en texte libre, on le garde tel quel.
  }
  return cleaned;
}

const OCTOPUS_API = String(import.meta.env.VITE_OCTOPUS_API_URL || "https://octopus-engine-app.benoitlubert.workers.dev").replace(/\/$/, "");
const TIMEOUT_MS = 6000;

const LANG_NAMES: Record<Lang, string> = { fr: "français", en: "English", es: "español" };

/**
 * Demande à Octopus (via sa capacité générique content.social.write, portée
 * par Mistral) une ligne de traduction sarcastique inédite pour cette espèce,
 * plutôt que de piocher dans la liste fixe de phraseBanks.ts. Ne bloque
 * jamais l'affichage : à utiliser en amélioration progressive après avoir
 * déjà montré la traduction locale.
 */
export async function requestOctopusTranslation(
  species: Species,
  lang: Lang,
  habitat: string,
  suspect: boolean,
): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${OCTOPUS_API}/mission`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
          `Réponds uniquement en ${LANG_NAMES[lang]}, une seule phrase, sans guillemets ni préambule.`,
          "N'invente aucun fait biologique précis sur l'espèce (pas de nom scientifique, pas de statistique) : reste dans le registre de l'humour, pas de la fiche technique.",
        ].join("\n"),
      }),
    });

    if (!response.ok) return null;
    const text = extractText(await response.json());
    return text || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
