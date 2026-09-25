import { useState, useEffect } from "react";
import { FiEdit3, FiX, FiCheck } from "react-icons/fi";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useToast } from "../ui/ToastProvider";
import api from "../../api/client";

const FIELD_OPTIONS = ["Software", "Data", "DevOps"];

const ALL_INTERESTS = [
  "Arrays", "Strings", "Linked Lists", "Trees", "Graphs", 
  "Dynamic Programming", "DBMS", "SQL", "Operating Systems", 
  "Computer Networks", "OOP", "JavaScript", "React", "Node.js", 
  "Python", "System Design", "Behavioral & HR"
];

export const EditProfileModal = ({
  isOpen,
  onClose,
  profile,
  refreshProfile
}) => {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [targetField, setTargetField] = useState("Software");
  const [interests, setInterests] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setBio(profile.bio || "");
      setTargetField(profile.targetField || "Software");
      setInterests(profile.interests || []);
    }
  }, [profile, isOpen]);

  const handleToggleInterest = (item) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Name cannot be empty.", "error");
      return;
    }

    setSaving(true);
    try {
      await api.put("/users/profile", {
        name: name.trim(),
        bio: bio.trim(),
        targetField,
        interests
      });
      await refreshProfile?.();
      showToast("Profile updated successfully.", "success");
      onClose();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      title={
        <div className="flex items-center gap-2">
          <FiEdit3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-base font-bold text-slate-900 dark:text-white">
            Edit Developer Profile
          </span>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSave} className="space-y-4 text-xs">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            maxLength={80}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-9 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] px-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            placeholder="Your developer name"
            required
          />
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Developer Bio
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {bio.length} / 300
            </span>
          </div>
          <textarea
            rows={3}
            value={bio}
            maxLength={300}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] p-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            placeholder="Short headline or bio (e.g. CS Sophomore preparing for software roles)."
          />
        </div>

        {/* Target Track */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Target Preparation Track
          </label>
          <select
            value={targetField}
            onChange={(e) => setTargetField(e.target.value)}
            className="w-full h-9 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] px-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 cursor-pointer"
          >
            {FIELD_OPTIONS.map((field) => (
              <option key={field} value={field}>
                {field} Engineering
              </option>
            ))}
          </select>
        </div>

        {/* Focus Interests / Skills */}
        <div className="space-y-2 pt-1">
          <label className="font-semibold text-slate-700 dark:text-slate-300 block">
            Focus Topics & Technologies ({interests.length} selected)
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1 snx-scrollbar">
            {ALL_INTERESTS.map((item) => {
              const active = interests.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleToggleInterest(item)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    active
                      ? "bg-indigo-600 text-white font-semibold shadow-xs"
                      : "bg-[var(--snx-surface-subtle)] text-slate-600 hover:text-slate-900 border border-[var(--snx-border)] dark:text-slate-300 dark:hover:text-white dark:border-slate-800"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
