import { Switch, Route, Router as WouterRouter } from "wouter";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function BuildMarker() {
  return (
    <>
      <div style={{ position: "fixed", top: 8, left: 8, right: 8, zIndex: 9999, display: "flex", justifyContent: "space-between", gap: 8, pointerEvents: "none", fontFamily: "Space Grotesk, Inter, system-ui, sans-serif", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#fff" }}>
        <span style={{ padding: "7px 10px", borderRadius: 999, background: "rgba(8,7,19,.78)", border: "1px solid rgba(255,122,0,.45)", boxShadow: "0 0 24px rgba(255,122,0,.20)" }}>◉ Feuch Institute</span>
        <span style={{ padding: "7px 10px", borderRadius: 999, background: "rgba(8,7,19,.78)", border: "1px solid rgba(0,229,255,.35)", boxShadow: "0 0 24px rgba(0,229,255,.16)" }}>Creature-Sync · Build visible · 2026-06-09</span>
      </div>
      <div style={{ position: "fixed", left: 8, right: 8, bottom: 8, zIndex: 9999, pointerEvents: "none", textAlign: "center", fontFamily: "Space Grotesk, Inter, system-ui, sans-serif", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.72)" }}>
        <span style={{ display: "inline-flex", padding: "7px 10px", borderRadius: 999, background: "rgba(8,7,19,.72)", border: "1px solid rgba(255,255,255,.16)" }}>Feuch Institute // Creature-Sync deployment marker</span>
      </div>
    </>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <BuildMarker />
      <Router />
    </WouterRouter>
  );
}

export default App;
