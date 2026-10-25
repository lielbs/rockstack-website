import { asset } from "@/lib/asset";
import { IsoStack } from "@/components/brand/IsoStack";

export default function NotFound() {
  return (
    <main className="frame grid min-h-svh content-center gap-10 py-20">
      <IsoStack
        slabs={[
          { w: 84, d: 60, h: 15, tone: "ivory" },
          { w: 62, d: 44, h: 13, tone: "stone" },
        ]}
        gap={5}
        className="w-48"
      />
      <h1 className="text-title font-bold">השכבה הזאת לא קיימת.</h1>
      <p className="max-w-[40ch] text-statement text-stone">הדף שחיפשתם הוזז או נמחק. הבסיס עדיין במקום.</p>
      <a href={asset("/")} className="btn btn-primary w-fit">
        חזרה לדף הבית
      </a>
    </main>
  );
}
