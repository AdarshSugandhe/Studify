import { useEffect, useState, useContext } from "react";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function StudentDashboard() {
  const { token, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await api("/api/students/me", { token });
      setProfile(res);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      const { name, email, course } = profile;
      const updated = await api("/api/students/me", {
        method: "PUT",
        body: { name, email, course },
        token,
      });
      setProfile(updated);
      setEditing(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>No profile found</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
        <button
          className="px-5 py-2 bg-red-200 text-red-800 rounded-lg hover:bg-red-300 transition cursor-pointer"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 max-w-md mx-auto">
        {editing ? (
          <>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Name"
            />
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
              value={profile.email || ""}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              placeholder="Email"
            />
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
              value={profile.course || ""}
              onChange={(e) =>
                setProfile({ ...profile, course: e.target.value })
              }
              placeholder="Course"
            />
            <div className="flex gap-3">
              <button
                onClick={updateProfile}
                disabled={saving}
                className={`flex-1 py-3 rounded-xl cursor-pointer ${
                  saving
                    ? "bg-gray-400"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-800">
              <span className="font-semibold">Name:</span> {profile.name}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">Email:</span> {profile.email}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">Course:</span>{" "}
              {profile.course || "—"}
            </p>
            <button
              onClick={() => setEditing(true)}
              className="w-full py-3 rounded-xl bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}
