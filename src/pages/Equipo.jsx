// src/pages/Equipo.jsx
import { useMemo, useState, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx"; 
import ReturnButton from "../Components/ReturnButton";
import axios from "axios";

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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});

  if (!open) return null;

  const validate = () => {
    const e = {};
    if (selectedCount === 0) e.selection = "No hay equipos seleccionados.";
    if (!name || name.trim().length < 2) e.name = "Ingresa un nombre válido.";
    if (!reason || reason.trim().length < 10) e.reason = "Agrega un motivo breve (mín. 10 caracteres).";
    if (!startDate) e.startDate = "Selecciona la fecha de inicio.";
    if (!endDate) e.endDate = "Selecciona la fecha de fin.";
    if (startDate && endDate && startDate > endDate) e.dates = "La fecha de fin debe ser posterior a la de inicio.";
    if (!terms) e.terms = "Debes aceptar los términos.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit?.({ 
      name: name.trim(), 
      reason: reason.trim(),
      startDate,
      endDate
    });
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

          {/* Campos de fecha para equipos */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-[#7a0d26] font-medium">Fecha inicio</span>
              <input
                type="date"
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a0d26]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              {errors.startDate && <span className="text-xs text-red-600">{errors.startDate}</span>}
            </label>

            <label className="block">
              <span className="text-sm text-[#7a0d26] font-medium">Fecha fin</span>
              <input
                type="date"
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a0d26]"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              {errors.endDate && <span className="text-xs text-red-600">{errors.endDate}</span>}
            </label>
          </div>
          {errors.dates && <span className="text-xs text-red-600">{errors.dates}</span>}

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

function FilterSection({ filters, onFilterChange, onApplyFilter }) {
  const filterOptions = ["Cámara", "Luz", "Micrófono", "Altavoz"];

  const handleFilterToggle = (filter) => {
    onFilterChange(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="rounded-lg bg-[#7a0d26]/10 p-4 border border-[#7a0d26]/20">
      <h3 className="font-semibold text-[#7a0d26] mb-4">Filtros por Tipo</h3>
      <div className="space-y-3">
        {filterOptions.map((option) => (
          <label key={option} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.includes(option)}
              onChange={() => handleFilterToggle(option)}
              className="w-4 h-4 text-[#7a0d26] border-neutral-300 rounded focus:ring-[#7a0d26]"
            />
            <span className="text-sm text-neutral-700 font-medium">{option}</span>
          </label>
        ))}
      </div>
      <button
        onClick={onApplyFilter}
        className="mt-4 w-full rounded-md bg-[#7a0d26] text-white py-2 hover:bg-[#5d0a1d] transition-colors"
      >
        Aplicar filtro
      </button>
      {filters.length > 0 && (
        <button
          onClick={() => onFilterChange([])}
          className="mt-2 w-full rounded-md border border-[#7a0d26] text-[#7a0d26] py-2 hover:bg-[#7a0d26]/5 transition-colors"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

// Nuevo componente para agregar equipos (solo para admin)
function AddEquipmentModal({ open, onClose, onSubmit, isSubmitting = false }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    available: true
  });
  const [errors, setErrors] = useState({});

  const equipmentTypes = ["Cámara", "Luz", "Micrófono", "Altavoz"];

  useEffect(() => {
    if (open) {
      setFormData({ name: "", type: "", available: true });
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const e = {};
    if (!formData.name || formData.name.trim().length < 2) {
      e.name = "El nombre debe tener al menos 2 caracteres";
    }
    if (!formData.type) {
      e.type = "Selecciona un tipo de equipo";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit?.(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form className="relative w-[min(500px,92vw)] rounded-lg bg-white p-6 shadow-xl" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-semibold tracking-wide text-[#7a0d26]">Agregar Nuevo Equipo</h2>
          <button type="button" onClick={onClose} className="text-2xl text-neutral-500 hover:text-neutral-700">
            ×
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-[#7a0d26] font-medium">Nombre del Equipo *</span>
            <input
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a0d26]"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ej: Cámara Sony A7III"
            />
            {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
          </label>

          <label className="block">
            <span className="text-sm text-[#7a0d26] font-medium">Tipo de Equipo *</span>
            <select
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a0d26]"
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <option value="">Selecciona un tipo</option>
              {equipmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.type && <span className="text-xs text-red-600">{errors.type}</span>}
          </label>

          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={formData.available}
              onChange={(e) => handleChange("available", e.target.checked)}
              className="w-4 h-4 text-[#7a0d26] border-neutral-300 rounded focus:ring-[#7a0d26]"
            />
            <span className="text-sm text-neutral-700">Equipo disponible</span>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md bg-[#7a0d26] text-white hover:bg-[#5d0a1d] disabled:opacity-60"
          >
            {isSubmitting ? "Agregando..." : "Agregar Equipo"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Equipo() {
  const { role } = useAuth();
  const maxSelection = 6;

  const [equipment, setEquipment] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  
  // Estados para el modal de agregar equipo
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addingEquipment, setAddingEquipment] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = () => {
    fetch("http://localhost:5000/api/equipment")
      .then((res) => res.json())
      .then((data) => setEquipment(data))
      .catch((err) => console.error("Error al obtener equipo:", err));
  };

  const teams = useMemo(
    () =>
      equipment.map((item) => ({
        id: item._id,
        name: item.name,
        type: item.type,
        available: item.available,
      })),
    [equipment]
  );

  const filteredTeams = useMemo(() => {
    if (!isFilterApplied || activeFilters.length === 0) {
      return teams;
    }
    return teams.filter(team =>
      team.type && activeFilters.includes(team.type)
    );
  }, [teams, activeFilters, isFilterApplied]);

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

  const handleApplyFilter = () => {
    setIsFilterApplied(true);
  };

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    if (newFilters.length === 0) {
      setIsFilterApplied(false);
    }
  };

  const handleSendFromPreview = () => {
    setPreviewOpen(false);
    setRequestOpen(true);
  };

  // Función para agregar nuevo equipo (solo admin)
  const handleAddEquipment = async (equipmentData) => {
    try {
      setAddingEquipment(true);
      
      const response = await axios.post(
        "http://localhost:5000/api/equipment", 
        equipmentData
      );
      
      setEquipment(prev => [...prev, response.data]);
      setAddModalOpen(false);
      alert("¡Equipo agregado exitosamente!");
      
    } catch (error) {
      console.error("Error agregando equipo:", error);
      alert("Hubo un error al agregar el equipo");
    } finally {
      setAddingEquipment(false);
    }
  };

  const submitRequest = async ({ name, reason, startDate, endDate }) => {
    try {
      setSending(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión para reservar.");
        return;
      }

      for (const equipmentId of selectedIds) {
        const team = selectedTeams.find(t => t.id === equipmentId);
        await axios.post(
          "http://localhost:5000/api/reservations",
          {
            resourceType: team.type,
            resourceId: equipmentId,
            startDate: startDate,
            endDate: endDate
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      alert("¡Reservas creadas exitosamente!");
      setRequestOpen(false);
      setSelectedIds([]);
    } catch (error) {
      console.error("Error creando reservas:", error);
      alert("Hubo un error y no se pudieron crear las reservas.");
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
          <FilterSection
            filters={activeFilters}
            onFilterChange={handleFilterChange}
            onApplyFilter={handleApplyFilter}
          />
          
          {/* Botón para agregar equipo (solo visible para admin) */}
          {role === "admin" && (
            <div className="mt-6 rounded-lg bg-[#8A1538] p-4 border border-[#8A1538] shadow-md">
              <h3 className="font-semibold text-white mb-3">Panel de Administrador</h3>
              <button
                onClick={() => setAddModalOpen(true)}
                className="w-full rounded-md bg-white text-[#8A1538] py-2 hover:bg-gray-100 transition-colors font-medium"
              >
                + Agregar Equipo
              </button>
            </div>
          )}
        </aside>

        <main>
          <div>
            <ReturnButton />

            {/* Botón agregar equipo para móvil (solo admin) */}
            {role === "admin" && (
              <div className="md:hidden mb-4 rounded-lg bg-[#8A1538] p-4 border border-[#8A1538] shadow-md">
                <button
                  onClick={() => setAddModalOpen(true)}
                  className="w-full rounded-md bg-white text-[#8A1538] py-2 hover:bg-gray-100 transition-colors font-medium"
                >
                  + Agregar Equipo
                </button>
              </div>
            )}

            {/* Indicador de filtros activos */}
            {isFilterApplied && activeFilters.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Mostrando equipos de tipo: <strong>{activeFilters.join(", ")}</strong>
                  <button
                    onClick={() => {
                      setActiveFilters([]);
                      setIsFilterApplied(false);
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs"
                  >
                    (mostrar todos)
                  </button>
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  selected={isSelected(team.id)}
                  disabledAdd={!isSelected(team.id) && !canAddMore}
                  onToggle={toggle}
                />
              ))}
            </div>

            {isFilterApplied && filteredTeams.length === 0 && (
              <div className="text-center py-8">
                <p className="text-neutral-500">No se encontraron equipos con los filtros seleccionados.</p>
                <button
                  onClick={() => {
                    setActiveFilters([]);
                    setIsFilterApplied(false);
                  }}
                  className="mt-2 text-[#7a0d26] hover:underline"
                >
                  Ver todos los equipos
                </button>
              </div>
            )}
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
      
      {/* Modal para agregar equipo (solo para admin) */}
      <AddEquipmentModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddEquipment}
        isSubmitting={addingEquipment}
      />
    </div>
  );
}