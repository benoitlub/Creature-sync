const CONTACT_EMAIL = "benoitlubert@gmail.com";
const BLACKLACE_URL = "https://benoitlub.github.io/blacklace-echo/";
const CREATURE_SYNC_URL = "https://benoitlub.github.io/Creature-sync/";

export function CreatorFooter() {
  return (
    <footer
      className="rounded border p-3 backdrop-blur-sm text-center space-y-2"
      style={{
        borderColor: "#ff8c0024",
        background: "linear-gradient(180deg, rgba(255,140,0,0.055), rgba(0,10,25,0.68))",
        boxShadow: "inset 0 0 20px rgba(255,140,0,0.035)",
      }}
    >
      <div className="text-[9px] font-mono tracking-[0.32em] uppercase text-orange-300/85">
        Créé sur Blacklace Island
      </div>

      <div className="text-[10px] sm:text-xs font-mono text-cyan-50/85 leading-relaxed">
        <span className="text-white">Benoît Lubert</span>
        <span className="text-gray-500"> — Béni · BL comme Blacklace · Lubert comme Liberty</span>
      </div>

      <div className="text-[9px] font-mono text-gray-400 leading-relaxed max-w-2xl mx-auto">
        Univers interactifs, IA créative, jeux, narration, formation et prototypes étranges mais utiles.
        <br />
        Ouvert aux collaborations, ateliers, commandes et expériences un peu trop vivantes.
      </div>

      <div className="flex flex-wrap justify-center gap-2 pt-1">
        <a
          href={BLACKLACE_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded border px-2 py-1 text-[8px] font-mono tracking-wider uppercase text-cyan-300 transition-opacity hover:opacity-80"
          style={{ borderColor: "#00d4ff33", background: "rgba(0,212,255,0.06)" }}
        >
          Explorer l'île
        </a>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Collaboration%20Blacklace%20Island`}
          className="rounded border px-2 py-1 text-[8px] font-mono tracking-wider uppercase text-orange-300 transition-opacity hover:opacity-80"
          style={{ borderColor: "#ff8c0044", background: "rgba(255,140,0,0.07)" }}
        >
          Collaborer
        </a>
        <a
          href={CREATURE_SYNC_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded border px-2 py-1 text-[8px] font-mono tracking-wider uppercase text-green-300 transition-opacity hover:opacity-80"
          style={{ borderColor: "#00ff8830", background: "rgba(0,255,136,0.05)" }}
        >
          Partager Creature Sync
        </a>
      </div>

      <div className="text-[8px] font-mono text-gray-600 tracking-wider">
        @benoitlubert · @pro.hbtd · @natasha.pro.hbtd · {CONTACT_EMAIL}
      </div>
    </footer>
  );
}
