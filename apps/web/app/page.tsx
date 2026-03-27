import { Shell } from "../components/layout/shell";
import { Card } from "../components/ui/card";
import { getSessionDraft } from "../lib/session-store";

export default function HomePage() {
  const session = getSessionDraft();

  return (
    <Shell
      title="A local artist session lifecycle that can ship before the backend."
      subtitle="This branch adds create, start, and end controls plus a lightweight dashboard for live session state."
    >
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <Card title="Current state">
          <p className="muted">Session: {session.title}</p>
          <p className="muted">Status: {session.status}</p>
          <a className="button" href="/artist/dashboard">Open dashboard</a>
        </Card>
        <Card title="Why this branch">
          <p className="muted">
            The lifecycle is cookie-backed so the UI can be reviewed and merged independently of API session endpoints.
          </p>
        </Card>
      </div>
    </Shell>
  );
}
