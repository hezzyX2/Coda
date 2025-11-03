"use client";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { UserProfile } from "@/lib/models";
import { loadProfile, saveProfile } from "@/lib/storage";

export default function ProfilePage() {
  const user = getCurrentUser();
  const [profile, setProfile] = useState<UserProfile>({
    email: user?.email || "",
    name: user?.name || "",
    bio: "",
    school: "",
    grade: "",
    goals: [],
    interests: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notificationPreferences: {
      email: true,
      push: false,
      reminders: true,
    },
    privacySettings: {
      shareAnalytics: false,
      shareProgress: false,
    },
  });
  const [newGoal, setNewGoal] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      const savedProfile = loadProfile();
      if (savedProfile) {
        setProfile({ ...profile, ...savedProfile, email: user.email, name: user.name });
      } else {
        setProfile({ ...profile, email: user.email, name: user.name });
      }
    }
  }, [user]);

  function handleSave() {
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function addGoal() {
    if (newGoal.trim()) {
      setProfile({
        ...profile,
        goals: [...(profile.goals || []), newGoal.trim()],
      });
      setNewGoal("");
    }
  }

  function removeGoal(index: number) {
    setProfile({
      ...profile,
      goals: profile.goals?.filter((_, i) => i !== index) || [],
    });
  }

  function addInterest() {
    if (newInterest.trim()) {
      setProfile({
        ...profile,
        interests: [...(profile.interests || []), newInterest.trim()],
      });
      setNewInterest("");
    }
  }

  function removeInterest(index: number) {
    setProfile({
      ...profile,
      interests: profile.interests?.filter((_, i) => i !== index) || [],
    });
  }

  if (!user) {
    return (
      <div className="page fade-in">
        <div className="empty-state">
          <p>Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <div className="dashboard-header">
        <h1 className="page-title">👤 Profile</h1>
        <p className="page-subtitle">Manage your account settings and preferences</p>
      </div>

      {saved && (
        <div className="save-success">
          ✅ Profile saved successfully!
        </div>
      )}

      <div className="grid two">
        <section className="card glass">
          <div className="card-header">
            <h2>Basic Information</h2>
          </div>
          <div className="form-grid">
            <label className="form-group-full">
              <span>Name</span>
              <input
                className="input"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your full name"
              />
            </label>
            <label className="form-group-full">
              <span>Email</span>
              <input
                className="input"
                type="email"
                value={profile.email}
                disabled
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              />
              <small className="form-hint">Email cannot be changed</small>
            </label>
            <label className="form-group-full">
              <span>Bio</span>
              <textarea
                className="input textarea"
                rows={4}
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell us about yourself..."
              />
            </label>
            <label>
              <span>School</span>
              <input
                className="input"
                value={profile.school || ""}
                onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                placeholder="Your school or university"
              />
            </label>
            <label>
              <span>Grade/Year</span>
              <select
                className="input"
                value={profile.grade || ""}
                onChange={(e) => setProfile({ ...profile, grade: e.target.value })}
              >
                <option value="">Select...</option>
                <option value="High School">High School</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>
        </section>

        <section className="card glass">
          <div className="card-header">
            <h2>Goals & Interests</h2>
          </div>
          <div className="form-group-full">
            <label>
              <span>Goals</span>
              <div className="tag-input-group">
                <input
                  className="input"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addGoal()}
                  placeholder="Add a goal..."
                />
                <button type="button" className="btn compact" onClick={addGoal}>
                  Add
                </button>
              </div>
              {profile.goals && profile.goals.length > 0 && (
                <div className="tags-list">
                  {profile.goals.map((goal, i) => (
                    <span key={i} className="tag">
                      {goal}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => removeGoal(i)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </label>
          </div>
          <div className="form-group-full" style={{ marginTop: "20px" }}>
            <label>
              <span>Interests</span>
              <div className="tag-input-group">
                <input
                  className="input"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addInterest()}
                  placeholder="Add an interest..."
                />
                <button type="button" className="btn compact" onClick={addInterest}>
                  Add
                </button>
              </div>
              {profile.interests && profile.interests.length > 0 && (
                <div className="tags-list">
                  {profile.interests.map((interest, i) => (
                    <span key={i} className="tag">
                      {interest}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => removeInterest(i)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </label>
          </div>
        </section>
      </div>

      <div className="grid two" style={{ marginTop: "32px" }}>
        <section className="card glass">
          <div className="card-header">
            <h2>Notifications</h2>
          </div>
          <div className="settings-list">
            <label className="setting-item">
              <input
                type="checkbox"
                checked={profile.notificationPreferences?.email ?? true}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    notificationPreferences: {
                      ...profile.notificationPreferences,
                      email: e.target.checked,
                    },
                  })
                }
              />
              <span>Email notifications</span>
            </label>
            <label className="setting-item">
              <input
                type="checkbox"
                checked={profile.notificationPreferences?.push ?? false}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    notificationPreferences: {
                      ...profile.notificationPreferences,
                      push: e.target.checked,
                    },
                  })
                }
              />
              <span>Push notifications</span>
            </label>
            <label className="setting-item">
              <input
                type="checkbox"
                checked={profile.notificationPreferences?.reminders ?? true}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    notificationPreferences: {
                      ...profile.notificationPreferences,
                      reminders: e.target.checked,
                    },
                  })
                }
              />
              <span>Reminder notifications</span>
            </label>
          </div>
        </section>

        <section className="card glass">
          <div className="card-header">
            <h2>Privacy</h2>
          </div>
          <div className="settings-list">
            <label className="setting-item">
              <input
                type="checkbox"
                checked={profile.privacySettings?.shareAnalytics ?? false}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    privacySettings: {
                      ...profile.privacySettings,
                      shareAnalytics: e.target.checked,
                    },
                  })
                }
              />
              <span>Share analytics (anonymized)</span>
            </label>
            <label className="setting-item">
              <input
                type="checkbox"
                checked={profile.privacySettings?.shareProgress ?? false}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    privacySettings: {
                      ...profile.privacySettings,
                      shareProgress: e.target.checked,
                    },
                  })
                }
              />
              <span>Share progress updates</span>
            </label>
          </div>
        </section>
      </div>

      <div className="card glass" style={{ marginTop: "32px" }}>
        <div className="card-header">
          <h2>Account Information</h2>
        </div>
        <div className="account-info">
          <div className="info-row">
            <span className="info-label">Account Type:</span>
            <span className="info-value">{user.isPremium ? "✨ Premium" : "Free"}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Member Since:</span>
            <span className="info-value">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Sign-in Method:</span>
            <span className="info-value">
              {user.authProvider === "google" ? "Google" : "Email"}
            </span>
          </div>
        </div>
      </div>

      <button className="btn primary large" onClick={handleSave} style={{ marginTop: "32px", width: "100%" }}>
        💾 Save Profile
      </button>
    </div>
  );
}

