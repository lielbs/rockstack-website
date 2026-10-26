import type { CSSProperties } from "react";

/** Three concept screens of project types we build. Sample data only, not client claims. */
export function LabShowcase() {
  return (
    <section id="lab" aria-labelledby="lab-title" className="v2-lab frame section-y">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="v2-section-label" dir="ltr">WORK SAMPLES / CONCEPT SCREENS</p>
          <h2 id="lab-title" data-reveal="words" className="v2-section-title mt-5">
            שלושה סוגי פרויקטים,<br />
            <span>כמו שהם נראים על המסך.</span>
          </h2>
        </div>
        <p data-reveal style={{ "--i": 1 } as CSSProperties} className="v2-section-lead self-end lg:col-span-4 lg:col-start-9">
          סוכן AI שמטפל בפניות, אתר שמביא לידים ומעביר אותם אוטומטית ל-CRM, ודשבורד שמראה מה קורה בעסק בכל רגע.
        </p>
      </div>

      <div className="v2-showcase mt-16 lg:mt-24">
        <article data-reveal className="v2-demo v2-demo-agent">
          <DemoHead index="01" title="AI AGENT · INBOX" status="ACTIVE" />
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
          <DemoHead index="02" title="WEBSITE · LEAD FLOW" status="LIVE" />
          <div className="v2-site">
            <div className="v2-site-bar" dir="ltr" aria-hidden="true">
              <i /><i /><i />
              <span>yourbusiness.co.il</span>
            </div>
            <div className="v2-site-page">
              <div className="v2-site-nav" aria-hidden="true">
                <b>העסק שלכם</b>
                <span>שירותים</span>
                <span>מחירים</span>
                <span>צור קשר</span>
              </div>
              <p className="v2-site-title">
                קובעים פגישה
                <br />
                ב-30 שניות.
              </p>
              <div className="v2-site-form" aria-hidden="true">
                <span>שם מלא</span>
                <span dir="ltr">050-0000000</span>
                <b>שליחה</b>
              </div>
            </div>
            <ol className="v2-flow" aria-label="מה קורה אחרי שליחת הטופס">
              <li style={{ "--n": 0 } as CSSProperties}><small dir="ltr">FORM</small>הטופס נשלח מהאתר</li>
              <li style={{ "--n": 1 } as CSSProperties}><small dir="ltr">CRM</small>ליד חדש נפתח ב-CRM</li>
              <li style={{ "--n": 2 } as CSSProperties}><small dir="ltr">WHATSAPP</small>הלקוח מקבל אישור</li>
            </ol>
          </div>
        </article>

        <article data-reveal style={{ "--i": 2 } as CSSProperties} className="v2-demo v2-demo-ops">
          <DemoHead index="03" title="OPERATIONS DASHBOARD" status="SYNCED" />
          <div className="v2-ops-grid" dir="ltr">
            <div className="v2-kpi"><small>OPEN LEADS</small><b>18</b><em>+4 this week</em></div>
            <div className="v2-kpi"><small>AUTOMATED TASKS</small><b>126</b><em>this month</em></div>
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
