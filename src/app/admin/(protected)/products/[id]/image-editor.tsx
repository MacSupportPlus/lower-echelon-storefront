"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addImageUrl, removeImage } from "../actions";

type Img = { id: string; url: string };

export function ImageEditor({ productId, images }: { productId: string; images: Img[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  function remove(id: string) {
    startTransition(async () => {
      await removeImage(productId, id);
      router.refresh();
    });
  }

  function add() {
    setError(null);
    startTransition(async () => {
      const res = await addImageUrl(productId, url);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setUrl("");
      router.refresh();
    });
  }

  return (
    <div className="mt-4">
      <p className="label mb-3 text-concrete-500">
        Paste a path already in /public/products/… or a full image URL. The first photo is the one shown on the shop grid.
      </p>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((im) => (
            <div key={im.id} className="relative aspect-[4/5] overflow-hidden bg-concrete-900">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin-only thumbnail; owner may paste any host, and next/image requires allow-listing hosts ahead of time */}
              <img src={im.url} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() => remove(im.id)}
                disabled={pending}
                className="label absolute right-1 top-1 bg-ink/80 px-1.5 py-0.5 text-paper hover:text-accent"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="label mt-5 flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-concrete-500">Image URL or path</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/products/my-product/1.jpg"
            className="mt-1 w-full border border-concrete-700 bg-transparent px-2 py-1.5 text-paper outline-none focus:border-paper"
          />
        </div>
        <button
          onClick={add}
          disabled={pending || !url.trim()}
          className="border border-paper px-4 py-1.5 hover:bg-paper hover:text-ink disabled:opacity-50"
        >
          + Add
        </button>
      </div>
      {error && <p className="label mt-2 text-accent">{error}</p>}
    </div>
  );
}
