// src/pages/Equipo.jsx
import { useMemo, useState, useCallback, useEffect } from "react";
import ReturnButton from "../Components/ReturnButton";

function TeamCard({ team, selected, disabledAdd, onToggle }) {
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
            Logo
          </div>
          <div className="flex-1">
            <div className="inline-block px-3 py-1 rounded-md bg-white/80 text-[#7a0d26] font-semibold tracking-wide">
              {team.name}
            </div>

            {/* Info real del backend */}
            <div className="mt-3 space-y-1 text-sm text-neutral-700">
              {team.type && (
                <p>
                  <span className="font-medium">Tipo:</span> {team.type}
                </p>
              )}
              {"available" in team && (
                <p>
                  <span className="font-medium">Estado:</span>{" "}
                  <span className={team.available ? "text-green-700" : "text-red-700"}>
                    {team.available ? "Disponible" : "No disponible"}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggle(team.id)}
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
        Ver selección ({count}/{maxSelection})
      </button>
    </div>
  );
}

function SelectionPreviewModal({ open, onClose, selectedTeams, onSendRequest }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-h-[80vh] w-[min(900px,92vw)] overflow-auto rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-[#7a0d26]">Equipos seleccionados</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {selectedTeams.map((team) => (
            <div key={team.id} className="rounded-lg border bg-[#f6efe9] p-4">
              <div className="flex gap-4">
                <div className="h-20 w-20 rounded bg-neutral-200 border border-neutral-300" />
                <div>
                  <div className="px-2 py-1 inline-block rounded bg-white text-[#7a0d26] font-medium">
                    {team.name}
                  </div>
                  {team.type && (
                    <p className="mt-2 text-sm text-neutral-700">
                      <span className="font-medium">Tipo:</span> {team.type}
                    </p>
                  )}
                  {"available" in team && (
                    <p className="text-sm text-neutral-700">
                      <span className="font-medium">Estado:</span>{" "}
                      <span className={team.available ? "text-green-700" : "text-red-700"}>
                        {team.available ? "Disponible" : "No disponible"}
                      </span>
                    </p>
                  )}
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
            Cerrar
          </button>
          <button
            type="button"
            onClick={onSendRequest}
            className="px-4 py-2 rounded-md bg-[#7a0d26] text-white hover:bg-[#5d0a1d]"
          >
            Enviar solicitud
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
    if (selectedCount === 0) e.selection = "No hay equipos seleccionados.";
    if (!name || name.trim().length < 2) e.name = "Ingresa un nombre válido.";
    if (!reason || reason.trim().length < 10) e.reason = "Agrega un motivo breve (mín. 10 caracteres).";
    if (!terms) e.terms = "Debes aceptar los términos.";
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
          <h2 className="text-2xl font-semibold tracking-wide text-[#7a0d26]">Solicitud de equipos</h2>
          <button type="button" onClick={onClose} className="text-2xl text-neutral-500 hover:text-neutral-700">
            ×
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {errors.selection && <p className="text-sm text-red-600">{errors.selection}</p>}

          <label className="block">
            <span className="text-sm text-[#7a0d26] font-medium">Nombre</span>
            <input
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a0d26]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre completo"
            />
            {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
          </label>

          <label className="block">
            <span className="text-sm text-[#7a0d26] font-medium">Motivo</span>
            <textarea
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 min-h-[110px] focus:outline-none focus:ring-2 focus:ring-[#7a0d26]"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="¿Por qué necesitas estos equipos?"
            />
            {errors.reason && <span className="text-xs text-red-600">{errors.reason}</span>}
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
            <span className="text-sm text-neutral-700">Acepto términos y condiciones.</span>
          </label>
          {errors.terms && <span className="text-xs text-red-600">{errors.terms}</span>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md bg-[#7a0d26] text-white hover:bg-[#5d0a1d] disabled:opacity-60"
          >
            {isSubmitting ? "Enviando..." : "Enviar solicitud"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Equipo() {
  const maxSelection = 6;

  // ✅ Equipos desde el backend
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/equipment")
      .then((res) => res.json())
      .then((data) => setEquipment(data))
      .catch((err) => console.error("Error al obtener equipo:", err));
  }, []);

  // Adaptamos los datos del backend a la estructura usada en la UI
  const teams = useMemo(
    () =>
      equipment.map((item) => ({
        id: item._id,          // usamos _id como id interno
        name: item.name,
        type: item.type,
        available: item.available,
      })),
    [equipment]
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

  const selectedTeams = teams.filter((t) => selectedIds.includes(t.id));

  const handleSendFromPreview = () => {
    setPreviewOpen(false);
    setRequestOpen(true);
  };

  const submitRequest = async ({ name, reason }) => {
    try {
      setSending(true);
      // Aquí podrías hacer un POST real al backend si quieres
      // await fetch("http://localhost:5000/api/solicitudes", { ... })

      await new Promise((r) => setTimeout(r, 800)); // simulación
      alert(`Solicitud enviada!\nEquipos: ${selectedIds.join(", ")}`);
      setRequestOpen(false);
    } catch (e) {
      console.error(e);
      alert("Hubo un error al enviar la solicitud.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="sticky top-0 z-30 bg-[#7a0d26] text-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="font-semibold tracking-wide">Equipo</div>
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
            <h3 className="font-semibold text-[#7a0d26]">Filtros</h3>
            <div className="mt-3 space-y-2">
              <div className="h-3 w-40 bg-white rounded" />
              <div className="h-3 w-36 bg-white rounded" />
              <div className="h-3 w-44 bg-white rounded" />
              <button className="mt-4 w-full rounded-md bg-[#7a0d26] text-white py-2 hover:bg-[#5d0a1d]">
                Aplicar filtro
              </button>
            </div>
          </div>
        </aside>

        <main>
          <div>
            <ReturnButton />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  selected={isSelected(team.id)}
                  disabledAdd={!isSelected(team.id) && !canAddMore}
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
        selectedTeams={selectedTeams}
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
