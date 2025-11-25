import { useMemo, useState, useCallback } from "react";
import ReturnButton from "../Components/ReturnButton";

function RoomCard({ room, selected, disabledAdd, onToggle }) {
  return (
    <div
      className={[
        "relative rounded-lg border shadow-sm transition-all bg-[#f0e9e2] border-neutral-200",
        selected ? "ring-2 ring-[#7a0d26] shadow-md" : "hover:shadow",
      ].join(" ")}
    >
      
      <div>
      <div className="flex gap-4 p-4">
        <div className="w-28 h-28 rounded-md bg-neutral-200/70 border border-neutral-300 flex items-center justify-center text-neutral-400 text-xs">
          Image
        </div>
        <div className="flex-1">
          <div className="inline-block px-3 py-1 rounded-md bg-white/80 text-[#7a0d26] font-semibold tracking-wide">
            {room.name}
          </div>
          <div className="mt-3 space-y-1 text-sm text-neutral-600">
            <div className="h-3 w-40 bg-white/70 rounded" />
            <div className="h-3 w-48 bg-white/70 rounded" />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onToggle(room.id)}
        className={[
          "absolute -top-3 -right-3 h-9 w-9 rounded-full text-white text-xl leading-none",
          "flex items-center justify-center shadow-md transition-colors",
          "bg-[#7a0d26] hover:bg-[#5d0a1d]",
          !selected && disabledAdd ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
        aria-label={selected ? "Remove from selection" : "Add to selection"}
        disabled={!selected && disabledAdd}
      >
        {selected ? "−" : "+"}
      </button>
    </div>
    </div>
  );
}

function SelectionBar({ count, maxSelection, onView }) {
  return (
    <div className="flex items-center justify-end">
      <button
        type="button"
        onClick={onView}
        className="px-4 py-2 rounded-md bg-[#7a0d26] text-white hover:bg-[#5d0a1d] transition-colors disabled:opacity-50"
        disabled={count === 0}
      >
        View Selection ({count}/{maxSelection})
      </button>
    </div>
  );
}

function SelectionPreviewModal({ open, onClose, selectedRooms, onSendRequest }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-h-[80vh] w-[min(900px,92vw)] overflow-auto rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-[#7a0d26]">Selected Rooms</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {selectedRooms.map((room) => (
            <div key={room.id} className="rounded-lg border bg-[#f6efe9] p-4">
              <div className="flex gap-4">
                <div className="h-20 w-20 rounded bg-neutral-200 border border-neutral-300" />
                <div>
                  <div className="px-2 py-1 inline-block rounded bg-white text-[#7a0d26] font-medium">
                    {room.name}
                  </div>
                  <div className="mt-2 h-3 w-40 bg-white/70 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onSendRequest}
            className="px-4 py-2 rounded-md bg-[#7a0d26] text-white hover:bg-[#5d0a1d]"
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
}

function RequestModal({ open, onClose, onSubmit, selectedCount, isSubmitting = false }) {
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});

  if (!open) return null;

  const validate = () => {
    const e = {};
    if (selectedCount === 0) e.selection = "No rooms selected.";
    if (!name || name.trim().length < 2) e.name = "Please enter a valid name.";
    if (!reason || reason.trim().length < 10) e.reason = "Please provide a brief reason (min 10 chars).";
    if (!terms) e.terms = "You must accept terms.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit?.({ name: name.trim(), reason: reason.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form className="relative w-[min(680px,92vw)] rounded-lg bg-white p-6 shadow-xl" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-semibold tracking-wide text-[#7a0d26]">Room Request</h2>
          <button type="button" onClick={onClose} className="text-2xl text-neutral-500 hover:text-neutral-700">
            ×
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {errors.selection && <p className="text-sm text-red-600">{errors.selection}</p>}

          <label className="block">
            <span className="text-sm text-[#7a0d26] font-medium">Name</span>
            <input
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a0d26]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
            {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
          </label>

          <label className="block">
            <span className="text-sm text-[#7a0d26] font-medium">Reason</span>
            <textarea
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 min-h-[110px] focus:outline-none focus:ring-2 focus:ring-[#7a0d26]"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why do you need these rooms?"
            />
            {errors.reason && <span className="text-xs text-red-600">{errors.reason}</span>}
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
            <span className="text-sm text-neutral-700">I accept terms and conditions.</span>
          </label>
          {errors.terms && <span className="text-xs text-red-600">{errors.terms}</span>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md bg-[#7a0d26] text-white hover:bg-[#5d0a1d] disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send Request"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Rooms() {
  const maxSelection = 6;

  const rooms = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: String(i + 1),
        name: `ROOM ${i + 1}`,
      })),
    []
  );

  const [selectedIds, setSelectedIds] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const isSelected = useCallback((id) => selectedIds.includes(id), [selectedIds]);
  const canAddMore = selectedIds.length < maxSelection;

  const toggle = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= maxSelection) return prev;
      return [...prev, id];
    });
  };

  const selectedRooms = rooms.filter((r) => selectedIds.includes(r.id));

  const handleSendFromPreview = () => {
    setPreviewOpen(false);
    setRequestOpen(true);
  };

  const submitRequest = async ({ name, reason }) => {
    try {
      setSending(true);
      await new Promise((r) => setTimeout(r, 800)); // mock
      alert(`Request sent!\nRooms: ${selectedIds.join(", ")}`);
      setRequestOpen(false);
    } catch (e) {
      console.error(e);
      alert("There was an error sending your request.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="sticky top-0 z-30 bg-[#7a0d26] text-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="font-semibold tracking-wide">Rooms</div>
          <SelectionBar
            count={selectedIds.length}
            maxSelection={maxSelection}
            onView={() => setPreviewOpen(true)}
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
        <aside className="hidden md:block">
          <div className="rounded-lg bg-[#7a0d26]/10 p-4 border border-[#7a0d26]/20">
            <h3 className="font-semibold text-[#7a0d26]">Filters</h3>
            <div className="mt-3 space-y-2">
              <div className="h-3 w-40 bg-white rounded" />
              <div className="h-3 w-36 bg-white rounded" />
              <div className="h-3 w-44 bg-white rounded" />
              <button className="mt-4 w-full rounded-md bg-[#7a0d26] text-white py-2 hover:bg-[#5d0a1d]">
                Apply Filter
              </button>
            </div>
          </div>
        </aside>

        <main>
        <div> 
          <ReturnButton>
          </ReturnButton>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                selected={isSelected(room.id)}
                disabledAdd={!isSelected(room.id) && !canAddMore}
                onToggle={toggle}
              />
            ))}
          </div>
          </div>
        </main>
      </div>

      <SelectionPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        selectedRooms={selectedRooms}
        onSendRequest={handleSendFromPreview}
      />
      <RequestModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        onSubmit={submitRequest}
        selectedCount={selectedIds.length}
        isSubmitting={sending}
      />
    </div>
  );
}
