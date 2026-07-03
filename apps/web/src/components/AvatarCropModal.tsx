import { useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { cropImageToBlob, type PixelCrop } from '../lib/cropImage';

interface Props {
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}

export function AvatarCropModal({ imageSrc, onCancel, onConfirm }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixelCrop, setPixelCrop] = useState<PixelCrop | null>(null);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    if (!pixelCrop) return;
    setBusy(true);
    try {
      const blob = await cropImageToBlob(imageSrc, pixelCrop);
      onConfirm(blob);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-lg font-bold">Adjust your avatar</h2>
        <p className="mt-1 text-sm text-slate-400">Drag to reposition, use the slider to zoom.</p>

        <div className="relative mt-4 h-80 w-full overflow-hidden rounded-xl bg-slate-950">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_area: Area, areaPixels: Area) => setPixelCrop(areaPixels)}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-slate-500">🔍</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-forge-500"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={busy || !pixelCrop}
            className="rounded-lg bg-forge-600 px-5 py-2 text-sm font-semibold text-white hover:bg-forge-500 disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Save avatar'}
          </button>
        </div>
      </div>
    </div>
  );
}
