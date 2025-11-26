// src/pages/Rooms.jsx

// type en la linea 283

import { useMemo, useState, useCallback, useEffect } from "react";
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

            {/* Info real del backend */}
            <div className="mt-3 space-y-1 text-sm text-neutral-700">
              {"capacity" in room && (
                <p>
                  <span className="font-medium">Capacidad:</span> {room.capacity}
                </p>
              )}
              {"available" in room && (
                <p>
                  <span className="font-medium">Estado:</span>{" "}
                  <span className={room.available ? "text-green-700" : "text-red-700"}>
                    {room.available ? "Disponible" : "Ocupado"}
                  </span>
                </p>
              )}
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
        Ver selección ({count}/{maxSelection})
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
        <h2 className="text-xl font-semibold text-[#7a0d26]">Cuartos seleccionados</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {selectedRooms.map((room) => (
            <div key={room.id} className="rounded-lg border bg-[#f6efe9] p-4">
              <div className="flex gap-4">
                <div className="h-20 w-20 rounded bg-neutral-200 border border-neutral-300" />
                <div>
                  <div className="px-2 py-1 inline-block rounded bg-white text-[#7a0d26] font-medium">
                    {room.name}
                  </div>
                  {"capacity" in room && (
                    <p className="mt-2 text-sm text-neutral-700">
                      <span className="font-medium">Capacidad:</span> {room.capacity}
                    </p>
                  )}
                  {"available" in room && (
                    <p className="text-sm text-neutral-700">
                      <span className="font-medium">Estado:</span>{" "}
                      <span className={room.available ? "text-green-700" : "text-red-700"}>
                        {room.available ? "Disponible" : "Ocupado"}
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
    if (selectedCount === 0) e.selection = "No hay cuartos seleccionados.";
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
          <h2 className="text-2xl font-semibold tracking-wide text-[#7a0d26]">Solicitud de cuartos</h2>
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
              placeholder="¿Por qué necesitas estos cuartos?"
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

// Componente de filtros por capacidad
function CapacityFilterSection({ capacityFilter, onCapacityFilterChange, onApplyFilter, onClearFilter }) {
  const handleCapacityChange = (e) => {
    const value = e.target.value;
    // Solo permitir números
    if (value === '' || /^\d+$/.test(value)) {
      onCapacityFilterChange(value);
    }
  };

  return (
    <div className="rounded-lg bg-[#7a0d26]/10 p-4 border border-[#7a0d26]/20">
      <h3 className="font-semibold text-[#7a0d26] mb-4">Filtro por Capacidad</h3>
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm text-[#7a0d26] font-medium mb-2 block">Capacidad exacta</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={capacityFilter}
            onChange={handleCapacityChange}
            placeholder="Ej: 10"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a0d26]"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Ingresa el número exacto de personas
          </p>
        </label>
      </div>
      
      <div className="mt-4 space-y-2">
        <button 
          onClick={onApplyFilter}
          disabled={!capacityFilter}
          className="w-full rounded-md bg-[#7a0d26] text-white py-2 hover:bg-[#5d0a1d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Aplicar filtro
        </button>
        
        {capacityFilter && (
          <button 
            onClick={onClearFilter}
            className="w-full rounded-md border border-[#7a0d26] text-[#7a0d26] py-2 hover:bg-[#7a0d26]/5 transition-colors"
          >
            Limpiar filtro
          </button>
        )}
      </div>
    </div>
  );
}

export default function Rooms() {
  const maxSelection = 6;

  // ✅ Rooms desde el backend
  const [roomsData, setRoomsData] = useState([]);

  const [capacityFilter, setCapacityFilter] = useState("");
  const [isFilterApplied, setIsFilterApplied] = useState(false);


  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((res) => res.json())
      .then((data) => setRoomsData(data))
      .catch((err) => console.error("Error al obtener rooms:", err));
  }, []);

  // Adaptamos los datos del backend a la estructura usada en la UI
  const rooms = useMemo(
    () =>
      roomsData.map((room) => ({
        id: room._id,          // usamos _id como id interno
        name: room.name,
        capacity: room.capacity,
        available: room.available,
      })),
    [roomsData]
  );

  // Filtrar rooms según la capacidad
  const filteredRooms = useMemo(() => {
    if (!isFilterApplied || !capacityFilter) {
      return rooms;
    }
    
    const targetCapacity = parseInt(capacityFilter);
    return rooms.filter(room => 
      room.capacity === targetCapacity
    );
  }, [rooms, capacityFilter, isFilterApplied]);

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

  const handleApplyFilter = () => {
    if (capacityFilter) {
      setIsFilterApplied(true);
    }
  };

  const handleClearFilter = () => {
    setCapacityFilter("");
    setIsFilterApplied(false);
  };

  const handleCapacityFilterChange = (newCapacity) => {
    setCapacityFilter(newCapacity);
    // Si se limpia el campo, también quitamos el filtro aplicado
    if (!newCapacity) {
      setIsFilterApplied(false);
    }
  };

  const handleSendFromPreview = () => {
    setPreviewOpen(false);
    setRequestOpen(true);
  };

  const submitRequest = async ({ name, reason }) => {
    try {
      setSending(true);

      const token = localStorage.getItem("token");
      // Aquí podrías hacer un POST real al backend
      // await fetch("http://localhost:5000/api/room-requests", { ... })

      // Enviar al backend cada cuarto seleccionado
    for (const roomId of selectedIds) {
      await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resourceType: "room", 
          resourceId: roomId,
          day: "2025-11-26", // <- luego lo cambias por el date picker
          startHour: "14:00",
          endHour: "16:00",
        }),
      });
    }

      alert(`Solicitud enviada!\nCuartos: ${selectedIds.join(", ")}`);
      setRequestOpen(false);
    } catch (e) {
      console.error(e);

      alert("Hubo un error al enviar la solicitud de reserva de cuarto.");

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

          <CapacityFilterSection 
            capacityFilter={capacityFilter}
            onCapacityFilterChange={handleCapacityFilterChange}
            onApplyFilter={handleApplyFilter}
            onClearFilter={handleClearFilter}
          />

        </aside>

        <main>
          <div>
            <ReturnButton />

            
            {/* Indicador de filtro activo */}
            {isFilterApplied && capacityFilter && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Mostrando cuartos con capacidad exacta de: <strong>{capacityFilter} personas</strong>
                  <button 
                    onClick={handleClearFilter}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs"
                  >
                    (mostrar todos)
                  </button>
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredRooms.map((room) => (

                <RoomCard
                  key={room.id}
                  room={room}
                  selected={isSelected(room.id)}
                  disabledAdd={!isSelected(room.id) && !canAddMore}
                  onToggle={toggle}
                />
              ))}
            </div>


            {/* Mensaje cuando no hay resultados */}
            {isFilterApplied && filteredRooms.length === 0 && (
              <div className="text-center py-8">
                <p className="text-neutral-500">
                  No se encontraron cuartos con capacidad exacta de {capacityFilter} personas.
                </p>
                <button 
                  onClick={handleClearFilter}
                  className="mt-2 text-[#7a0d26] hover:underline"
                >
                  Ver todos los cuartos
                </button>
              </div>
            )}

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