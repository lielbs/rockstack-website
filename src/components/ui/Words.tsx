import { Fragment, type CSSProperties } from "react";

/**
 * Splits a heading into words that rise one after another out of their own mask
 * (pair with data-reveal="words" on the heading). Server-rendered; the text stays
 * one readable string for assistive technology.
 */
export function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className="wm">
              <span className="w" style={{ "--w": i } as CSSProperties}>
                {word}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </>
  );
}
