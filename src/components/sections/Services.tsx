import type { CSSProperties } from "react";
import type { Dictionary } from "@/content";
import { Photo } from "@/components/ui/Photo";

/** Services drawn as a server rack: each group a chassis, each service one unit, the foundation at the bottom. */
export function Services({ dict }: { dict: Dictionary }) {
  const { services } = dict;
  const lastGroup = services.groups.length - 1;
  return (
    <section id="services" aria-labelledby="services-title" className="frame section-y bg-night">
      <div className="grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 id="services-title" data-reveal className="text-title font-bold">
              {services.heading}
            </h2>
            <p data-reveal style={{ "--i": 1 } as CSSProperties} className="mt-6 max-w-[36ch] text-statement">
              {services.intro}
            </p>
            <div data-reveal style={{ "--i": 2 } as CSSProperties} className="mt-10 hidden lg:block">
              <Photo photo={services.photo} sizes="(min-width: 1024px) 36vw, 100vw" frameRatio={5 / 4} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="on-dark rounded-[6px] bg-basalt p-2.5 text-ivory sm:p-3.5">
            <ul className="flex flex-col gap-2.5 sm:gap-3.5">
              {services.groups.map((group, gi) => {
                const foundation = gi === lastGroup;
                return (
                  <li
                    key={group.latin}
                    data-reveal
                    style={{ "--i": gi } as CSSProperties}
                    className={`rounded-[4px] p-4 sm:p-6 ${foundation ? "bg-slate" : "bg-basalt-raised"}`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-statement font-bold">{group.name}</h3>
                      <span className={`latin text-small ${foundation ? "text-ivory" : "text-stone"}`} dir="ltr">
                        {group.latin}
                      </span>
                    </div>
                    <ul className="mt-4 flex flex-col gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item.name}
                          className={`grid gap-x-6 gap-y-1 rounded-[3px] px-4 py-3.5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:px-5 ${
                            foundation ? "bg-slate-deep" : "bg-night"
                          }`}
                        >
                          <span className="font-semibold text-ivory">{item.name}</span>
                          <span className={`text-small ${foundation ? "text-ivory" : "text-stone"} sm:text-body`}>{item.benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mt-8 lg:hidden">
            <Photo photo={services.photo} sizes="100vw" frameRatio={5 / 4} />
          </div>
        </div>
      </div>
    </section>
  );
}
