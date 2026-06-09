import type { LiveCandidate } from "../hooks/useAudioAnalysis";
import type { Lang } from "../data/translations";
import { InteractiveSpeciesRibbon } from "./InteractiveSpeciesRibbon";

export function SessionSpeciesRibbon({ state, candidates, lang }: { state: any; candidates: LiveCandidate[]; lang: Lang }) {
  return <InteractiveSpeciesRibbon state={state} candidates={candidates} lang={lang} />;
}
