"use client";

import { useState } from "react";

type VideoData = {
  id: string;
  title: string;
  cover: string;
  play: string;
  hdplay: string | null;
  music: string;
  duration: number;
  author: {
    unique_id: string;
    nickname: string;
    avatar: string;
  };
};

const fmtDuration = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VideoData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("https://www.tikwm.com/api/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ url: url.trim() }),
      });
      const json = await res.json();
      if (json.code !== 0) throw new Error(json.msg || "Invalid TikTok link.");
      setData(json.data);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Failed to fetch video. Check the link and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const download = (href: string, filename: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center px-4 py-12 sm:py-20">
      <h1 className="animate-fade-up text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        TikTok Downloader
      </h1>
      <p className="animate-fade-up mt-3 text-center text-base text-gray-500 sm:text-lg [animation-delay:80ms]">
        Paste a TikTok link and download the video or audio. Free, no signup.
      </p>

      <form
        onSubmit={handleSubmit}
        className="animate-fade-up mt-10 flex w-full flex-col gap-3 sm:flex-row [animation-delay:160ms]"
      >
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste TikTok link here…"
          required
          className="h-14 flex-1 rounded-xl border border-gray-300 bg-white px-5 text-base text-gray-900 shadow-sm placeholder:text-gray-400 transition-all duration-200 focus:border-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-14 shrink-0 rounded-xl bg-gray-900 px-8 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-700 hover:shadow-xl active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? "Loading…" : "Download"}
        </button>
      </form>

      {loading && (
        <div
          role="status"
          className="animate-fade-in mt-10 flex items-center gap-3 text-sm text-gray-500"
        >
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          Fetching video…
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="animate-fade-in mt-10 w-full rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-base text-red-700"
        >
          {error}
        </div>
      )}

      {data && (
        <div className="animate-fade-up mt-10 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="aspect-video w-full bg-black">
            <video
              src={data.play}
              poster={data.cover}
              controls
              playsInline
              className="h-full w-full"
            />
          </div>
          <div className="flex items-center gap-3 px-5 py-4">
            <img
              src={data.author.avatar}
              alt={data.author.nickname}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-gray-900">
                {data.author.nickname}
              </p>
              <p className="truncate text-sm text-gray-500">
                @{data.author.unique_id} · {fmtDuration(data.duration)}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row">
            <button
              onClick={() =>
                download(
                  data.hdplay || data.play,
                  `${data.author.unique_id}_${data.id}.mp4`
                )
              }
              className="h-12 flex-1 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-700 active:translate-y-0 active:scale-[0.98]"
            >
              Download Without Watermark
            </button>
            <button
              onClick={() =>
                download(data.music, `${data.author.unique_id}_${data.id}.mp3`)
              }
              className="h-12 flex-1 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 active:translate-y-0 active:scale-[0.98]"
            >
              Download MP3
            </button>
          </div>
        </div>
      )}

      <footer className="animate-fade-in mt-auto pt-10 text-xs text-gray-400 [animation-delay:300ms]">
        For personal use only. Respect content creators&apos; rights.
      </footer>
    </main>
  );
}