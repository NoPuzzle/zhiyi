"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HexagramLines } from "@/components/hexagram/HexagramLines";
import type { Hexagram } from "../../../data/hexagrams";
import { type Trigram, trigramsById } from "../../../data/trigrams";
import { trigramCopy } from "./trigram-copy";

type HexagramBrowserProps = {
  hexagrams: Hexagram[];
  trigrams: Trigram[];
};

function trigramName(id: string) {
  return trigramsById.get(id)?.chineseName ?? id;
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

function matchesSearch(hexagram: Hexagram, query: string) {
  if (!query) {
    return true;
  }

  const fields = [
    hexagram.chineseName,
    hexagram.name,
    hexagram.id.toString(),
    ...hexagram.keywords,
  ];

  return fields.some((field) => field.toLowerCase().includes(query));
}

export function HexagramBrowser({ hexagrams, trigrams }: HexagramBrowserProps) {
  const [search, setSearch] = useState("");
  const [upperTrigramId, setUpperTrigramId] = useState("all");
  const [lowerTrigramId, setLowerTrigramId] = useState("all");

  const filteredHexagrams = useMemo(() => {
    const query = normalizeSearch(search);

    return hexagrams.filter((hexagram) => {
      const upperMatches =
        upperTrigramId === "all" || hexagram.upperTrigramId === upperTrigramId;
      const lowerMatches =
        lowerTrigramId === "all" || hexagram.lowerTrigramId === lowerTrigramId;

      return upperMatches && lowerMatches && matchesSearch(hexagram, query);
    });
  }, [hexagrams, lowerTrigramId, search, upperTrigramId]);

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">
      <div className="rounded-sm border border-mist/70 bg-paper/75 p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
          <label className="ui-copy text-sm font-medium text-ink">
            搜索
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-sm border border-mist bg-paper-deep/45 px-3 text-base text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-vermilion"
              placeholder="乾、Qian、主动、1..."
            />
          </label>

          <label className="ui-copy text-sm font-medium text-ink md:w-44">
            上卦
            <select
              value={upperTrigramId}
              onChange={(event) => setUpperTrigramId(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-sm border border-mist bg-paper px-3 text-ink outline-none focus:border-vermilion"
            >
              <option value="all">全部</option>
              {trigrams.map((trigram) => (
                <option key={trigram.id} value={trigram.id}>
                  {trigram.chineseName} · {trigramCopy[trigram.id].imageZh}
                </option>
              ))}
            </select>
          </label>

          <label className="ui-copy text-sm font-medium text-ink md:w-44">
            下卦
            <select
              value={lowerTrigramId}
              onChange={(event) => setLowerTrigramId(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-sm border border-mist bg-paper px-3 text-ink outline-none focus:border-vermilion"
            >
              <option value="all">全部</option>
              {trigrams.map((trigram) => (
                <option key={trigram.id} value={trigram.id}>
                  {trigram.chineseName} · {trigramCopy[trigram.id].imageZh}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="ui-copy text-sm text-ink-soft">
            显示 {filteredHexagrams.length} / {hexagrams.length} 卦
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setUpperTrigramId("all");
              setLowerTrigramId("all");
            }}
            className="ui-copy rounded-sm border border-mist px-3 py-2 text-xs font-medium text-ink-soft transition hover:border-ink hover:text-ink"
          >
            清除筛选
          </button>
        </div>
      </div>

      {filteredHexagrams.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHexagrams.map((hexagram) => (
            <Link
              key={hexagram.id}
              href={`/hexagrams/${hexagram.id}`}
              className="group rounded-sm border border-mist/70 bg-paper/75 p-5 transition hover:border-ink hover:bg-paper"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="ui-copy text-xs text-vermilion">
                    第 {hexagram.id} 卦
                  </p>
                  <h2 className="mt-2 text-4xl font-semibold leading-none text-ink">
                    {hexagram.chineseName}
                  </h2>
                  <p className="ui-copy mt-2 text-xs uppercase tracking-[0.16em] text-ink-soft">
                    {hexagram.name}
                  </p>
                </div>
                <span
                  className="text-4xl leading-none text-ink-soft transition group-hover:text-ink"
                  aria-hidden="true"
                >
                  {hexagram.unicodeSymbol}
                </span>
              </div>

              <div className="mt-5 flex justify-center">
                <HexagramLines
                  lines={hexagram.lines}
                  size="sm"
                  label={`${hexagram.chineseName}卦`}
                />
              </div>

              <div className="ui-copy mt-5 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="block text-xs uppercase tracking-[0.16em] text-ink-soft/75">
                    上卦
                  </span>
                  <span className="mt-1 block text-ink">
                    {trigramName(hexagram.upperTrigramId)}
                  </span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-[0.16em] text-ink-soft/75">
                    下卦
                  </span>
                  <span className="mt-1 block text-ink">
                    {trigramName(hexagram.lowerTrigramId)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {hexagram.keywords.slice(0, 4).map((keyword) => (
                  <span
                    key={keyword}
                    className="ui-copy rounded-sm border border-mist/70 px-2.5 py-1 text-xs text-ink-soft"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-sm border border-mist/70 bg-paper/75 p-8 text-center">
          <p className="text-lg font-semibold text-ink">未找到匹配卦象</p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            可以减少关键词，或清除上下卦筛选后再试。
          </p>
        </div>
      )}
    </section>
  );
}
