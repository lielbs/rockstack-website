import type { CSSProperties } from "react";

/** Three illustrative product surfaces. They demonstrate capabilities, not client claims. */
export function LabShowcase() {
  return (
    <section id="lab" aria-labelledby="lab-title" className="v2-lab frame section-y">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="v2-section-label" dir="ltr">SELECTED CAPABILITIES / CONCEPT SCREENS</p>
          <h2 id="lab-title" data-reveal="words" className="v2-section-title mt-5">
            לא רק מדברים על AI.<br />
            <span>מתכננים איך הוא עובד במוצר.</span>
          </h2>
        </div>
        <p data-reveal style={{ "--i": 1 } as CSSProperties} className="v2-section-lead self-end lg:col-span-4 lg:col-start-9">
          כל מסך כאן מייצג שכבה שאנחנו בונים: חוויית משתמש מדויקת, לוגיקה עסקית, חיבור למידע ותפעול אמין בפרודקשן.
        </p>
      </div>

      <div className="v2-showcase mt-16 lg:mt-24">
        <article data-reveal className="v2-demo v2-demo-agent">
          <DemoHead index="01" title="AI AGENT" status="ACTIVE" />
          <div className="v2-agent-body">
            <div className="v2-agent-sidebar">
              <span className="active">שיחה חדשה</span>
              <span>מקורות מידע</span>
              <span>כלים והרשאות</span>
              <span>היסטוריית פעולות</span>
            </div>
            <div className="v2-chat">
              <div className="v2-chat-user">סכם את הפניות מהשבוע והכן משימות לצוות</div>
              <div className="v2-thinking" aria-hidden="true"><i /><i /><i /></div>
              <div className="v2-chat-agent">
                <span className="v2-agent-mark">AI</span>
                <div>
                  <p>זיהיתי 24 פניות חדשות ו־6 נושאים שחזרו על עצמם.</p>
                  <ul>
                    <li><i />מיון לפי דחיפות</li>
                    <li><i />יצירת משימות ב־CRM</li>
                    <li><i />טיוטת תשובה לכל לקוח</li>
                  </ul>
                </div>
              </div>
              <div className="v2-agent-progress"><span /></div>
            </div>
          </div>
        </article>

        <article data-reveal style={{ "--i": 1 } as CSSProperties} className="v2-demo v2-demo-web">
          <DemoHead index="02" title="WEB EXPERIENCE" status="LIVE" />
          <div className="v2-web-frame">
            <div className="v2-web-nav"><b>your.brand</b><span>Work</span><span>About</span><i /></div>
            <div className="v2-web-copy">
              <small>BUILT TO CONVERT</small>
              <strong>חוויה שאי אפשר<br />לגלול לידה.</strong>
              <button type="button" tabIndex={-1}>Start a project ↖</button>
            </div>
            <div className="v2-web-shape" aria-hidden="true"><i /><i /><i /></div>
            <div className="v2-cursor" aria-hidden="true">↖<span>explore</span></div>
          </div>
        </article>

        <article data-reveal style={{ "--i": 2 } as CSSProperties} className="v2-demo v2-demo-ops">
          <DemoHead index="03" title="OPERATIONS PLATFORM" status="SYNCED" />
          <div className="v2-ops-grid" dir="ltr">
            <div className="v2-kpi"><small>AUTOMATIONS</small><b>18</b><em>+4 this month</em></div>
            <div className="v2-kpi"><small>TIME SAVED</small><b>126h</b><em>estimated</em></div>
            <div className="v2-chart">
              <span>WORKFLOW ACTIVITY</span>
              <svg viewBox="0 0 420 120" preserveAspectRatio="none" aria-hidden="true">
                <path className="v2-chart-area" d="M0 100 C55 86 66 94 108 68 S172 76 211 48 S276 57 312 28 S370 44 420 12 V120 H0Z" />
                <path className="v2-chart-line" d="M0 100 C55 86 66 94 108 68 S172 76 211 48 S276 57 312 28 S370 44 420 12" />
              </svg>
            </div>
            <div className="v2-events">
              <p><i className="ok" />Lead enriched<span>now</span></p>
              <p><i className="ok" />CRM updated<span>12s</span></p>
              <p><i />Human approval<span>waiting</span></p>
            </div>
          </div>
        </article>
      </div>
      <p className="v2-lab-note mt-6 text-small text-stone">מסכי קונספט להמחשה. השמות והנתונים שמופיעים בהם הם לדוגמה בלבד.</p>
    </section>
  );
}

function DemoHead({ index, title, status }: { index: string; title: string; status: string }) {
  return (
    <div className="v2-demo-head" dir="ltr">
      <span>{index}</span>
      <b>{title}</b>
      <i />
      <em>● {status}</em>
    </div>
  );
}
