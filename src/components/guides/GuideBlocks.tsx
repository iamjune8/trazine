import { Inline } from "@/components/guides/Inline";
import { headingId, type GuideBlock } from "@/data/guides";

/** Article body. Each block type has one fixed style so every guide reads alike. */
export function GuideBlocks({ blocks }: { blocks: readonly GuideBlock[] }) {
  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={i}
                id={headingId(block.text)}
                className="font-display mt-16 scroll-mt-28 text-[length:var(--step-h3)] text-ink first:mt-0"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-9 text-lg font-medium text-ink">
                {block.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="mt-5 text-[1.0625rem] leading-[1.75] text-ink-2">
                <Inline text={block.text} />
              </p>
            );
          case "ul":
            return (
              <ul
                key={i}
                className="mt-5 list-disc space-y-2.5 pl-5 text-[1.0625rem] leading-[1.7] text-ink-2 marker:text-brass"
              >
                {block.items.map((item) => (
                  <li key={item} className="pl-1">
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol
                key={i}
                className="mt-5 list-decimal space-y-2.5 pl-5 text-[1.0625rem] leading-[1.7] text-ink-2 marker:font-medium marker:text-brass-deep"
              >
                {block.items.map((item) => (
                  <li key={item} className="pl-1">
                    <Inline text={item} />
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[20rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line-2">
                      {block.head.map((cell) => (
                        <th
                          key={cell}
                          scope="col"
                          className="py-3 pr-6 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-brass-deep"
                        >
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row[0]} className="border-b border-line">
                        {row.map((cell, c) => (
                          <td
                            key={c}
                            className={
                              c === 0
                                ? "py-3.5 pr-6 font-medium text-ink"
                                : "py-3.5 pr-6 text-ink-2"
                            }
                          >
                            <Inline text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "note":
            return (
              <p
                key={i}
                className="mt-6 border-l-2 border-brass bg-paper-2 px-5 py-4 text-[1.0625rem] leading-relaxed text-ink-2"
              >
                <Inline text={block.text} />
              </p>
            );
        }
      })}
    </div>
  );
}
