import { Switch, Route, Router as WouterRouter } from "wouter";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import { DayNightToggle } from "@/components/DayNightToggle";
import { OctopusObservationBridge } from "@/components/OctopusObservationBridge";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <DayNightToggle />
      <Router />
      <OctopusObservationBridge />
    </WouterRouter>
  );
}

export default App;
