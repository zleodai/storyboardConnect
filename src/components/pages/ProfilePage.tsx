import React, { useEffect, useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profileService';
import { UpdateUserProfileInput, UserProfile } from '../../types/profile.types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

type FormState = {
  name: string;
  avatarUrl: string;
  school: string;
  major: string;
  graduationYear: string;
  about: string;
  topSkills: string;
  boardTypes: string;
  availabilityStatus: '' | 'open' | 'busy' | 'unavailable';
  nextAvailable: string;
  rate: string;
};

function toFormState(profile: UserProfile): FormState {
  return {
    name: profile.name,
    avatarUrl: profile.avatarUrl || '',
    school: profile.school,
    major: profile.major || '',
    graduationYear: profile.graduationYear || '',
    about: profile.about,
    topSkills: profile.topSkills.join(', '),
    boardTypes: profile.boardTypes.join(', '),
    availabilityStatus: profile.availability?.status || '',
    nextAvailable: profile.availability?.nextAvailable || '',
    rate: profile.availability?.rate ? String(profile.availability.rate) : '',
  };
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export const ProfilePage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const { user, loginWithGoogle, updateUserProfilePreview } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formState, setFormState] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await profileService.getMyProfile();
        setProfile(data);
        setFormState(toFormState(data));
        setEditMode(data.onboardingRequired);
        updateUserProfilePreview({
          name: data.name,
          avatarUrl: data.avatarUrl,
        });
      } catch (loadError) {
        console.error('Failed to load profile:', loadError);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId, updateUserProfilePreview]);

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState((current) => (current ? { ...current, [key]: value } : current));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

    updateForm('avatarUrl', dataUrl);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formState) {
      return;
    }

    setSaving(true);
    setError(null);

    const payload: UpdateUserProfileInput = {
      name: formState.name,
      avatarUrl: formState.avatarUrl || undefined,
      school: formState.school,
      major: formState.major || undefined,
      graduationYear: formState.graduationYear || undefined,
      about: formState.about,
      topSkills: splitList(formState.topSkills),
      boardTypes: splitList(formState.boardTypes),
      availability: formState.availabilityStatus
        ? {
            status: formState.availabilityStatus,
            nextAvailable: formState.nextAvailable || undefined,
            rate: formState.rate ? Number(formState.rate) : undefined,
          }
        : undefined,
    };

    try {
      const savedProfile = await profileService.updateMyProfile(payload);
      setProfile(savedProfile);
      setFormState(toFormState(savedProfile));
      setEditMode(false);
      updateUserProfilePreview({
        name: savedProfile.name,
        avatarUrl: savedProfile.avatarUrl,
      });
    } catch (saveError) {
      console.error('Failed to save profile:', saveError);
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center bg-cinema-black px-6">
        <div className="max-w-lg rounded-2xl border border-gray-800 bg-gray-900/60 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">Sign in to view your profile</h2>
          <p className="mb-6 text-gray-400">
            Your profile is tied to your Google account and stores the identity you will use when
            chat features are added.
          </p>
          <Button variant="primary" onClick={loginWithGoogle}>
            Continue with Google
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-cinema-black text-gray-400">
        Loading profile...
      </div>
    );
  }

  if (!profile || !formState) {
    return (
      <div className="flex flex-1 items-center justify-center bg-cinema-black px-6">
        <div className="max-w-lg rounded-2xl border border-gray-800 bg-gray-900/60 p-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-white">Profile unavailable</h2>
          <p className="mb-6 text-gray-400">{error || 'Unable to load profile data right now.'}</p>
          <Button variant="outline" onClick={() => setCurrentPage('grid')}>
            Back to Explore
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-cinema-black">
      <div className="sticky top-0 z-20 border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
              Profile
            </p>
            <h2 className="text-lg font-bold text-white">
              {profile.onboardingRequired ? 'Complete Your Profile' : 'Your Artist Page'}
            </h2>
          </div>
          <div className="flex gap-3">
            {!editMode && (
              <Button variant="outline" onClick={() => setEditMode(true)}>
                Edit Profile
              </Button>
            )}
            <Button variant="outline" onClick={() => setCurrentPage('grid')}>
              Back to Explore
            </Button>
          </div>
        </div>
      </div>

      {editMode ? (
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="rounded-3xl border border-gray-800 bg-gray-900/50 p-8 md:p-10">
            <h3 className="mb-2 text-3xl font-bold text-white">
              {profile.onboardingRequired ? 'Tell us about yourself' : 'Edit your profile'}
            </h3>
            <p className="mb-8 text-gray-400">
              Add the details other users will eventually see in profile views and chat.
            </p>

            {error && (
              <div className="mb-6 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <form className="space-y-8" onSubmit={handleSave}>
              <div className="grid gap-8 md:grid-cols-[220px_1fr]">
                <div>
                  <div className="mb-4 h-44 w-44 overflow-hidden rounded-3xl border border-gray-700 bg-gray-800">
                    {formState.avatarUrl ? (
                      <img
                        src={formState.avatarUrl}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-gray-500">
                        {formState.name.slice(0, 1).toUpperCase() || user.email.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <label className="block cursor-pointer rounded-xl border border-gray-700 px-4 py-3 text-center text-sm font-semibold text-gray-300 transition hover:border-white hover:text-white">
                    Upload Profile Picture
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="mt-3 text-xs text-gray-500">
                    This image will be reused for future chat avatars.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-gray-300">Display Name</span>
                    <input
                      value={formState.name}
                      onChange={(event) => updateForm('name', event.target.value)}
                      className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-white"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-gray-300">School</span>
                    <input
                      value={formState.school}
                      onChange={(event) => updateForm('school', event.target.value)}
                      className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-white"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-gray-300">Major</span>
                    <input
                      value={formState.major}
                      onChange={(event) => updateForm('major', event.target.value)}
                      className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-gray-300">Graduation Year</span>
                    <input
                      value={formState.graduationYear}
                      onChange={(event) => updateForm('graduationYear', event.target.value)}
                      className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-white"
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-gray-300">About</span>
                    <textarea
                      value={formState.about}
                      onChange={(event) => updateForm('about', event.target.value)}
                      rows={5}
                      className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-white"
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-gray-300">Top Skills</span>
                    <input
                      value={formState.topSkills}
                      onChange={(event) => updateForm('topSkills', event.target.value)}
                      className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-white"
                      placeholder="Storyboard Pro, Blender, Photoshop"
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-gray-300">Board Types</span>
                    <input
                      value={formState.boardTypes}
                      onChange={(event) => updateForm('boardTypes', event.target.value)}
                      className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-white"
                      placeholder="Action Board, Cinematic"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-gray-300">Availability</span>
                    <select
                      value={formState.availabilityStatus}
                      onChange={(event) =>
                        updateForm(
                          'availabilityStatus',
                          event.target.value as FormState['availabilityStatus'],
                        )
                      }
                      className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-white"
                    >
                      <option value="">Not set</option>
                      <option value="open">Open</option>
                      <option value="busy">Busy</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-gray-300">Next Available</span>
                    <input
                      value={formState.nextAvailable}
                      onChange={(event) => updateForm('nextAvailable', event.target.value)}
                      className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-white"
                      placeholder="Oct 2026"
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-gray-300">Day Rate</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formState.rate}
                      onChange={(event) => updateForm('rate', event.target.value)}
                      className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-white"
                      placeholder="450"
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Saving...' : profile.onboardingRequired ? 'Create Profile' : 'Save Changes'}
                </Button>
                {!profile.onboardingRequired && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormState(toFormState(profile));
                      setEditMode(false);
                      setError(null);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="h-64 w-full bg-gray-800 relative">
            <img
              src={profile.banner}
              alt="Banner"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cinema-black to-transparent"></div>
          </div>

          <div className="max-w-5xl mx-auto px-6 relative -top-16">
            <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-300 rounded-full border-4 border-cinema-black flex-shrink-0 overflow-hidden relative z-10 shadow-xl">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-gray-700">
                    {profile.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 pb-2">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{profile.name}</h1>
                <div className="text-gray-400 text-sm md:text-base flex flex-wrap gap-y-1 gap-x-3 items-center">
                  <span className="text-accent">
                    <i className="fas fa-graduation-cap mr-1"></i>
                    {profile.school}
                  </span>
                  {profile.major && (
                    <>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <span>{profile.major}</span>
                    </>
                  )}
                  {profile.graduationYear && (
                    <>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <span>Class of {profile.graduationYear}</span>
                    </>
                  )}
                </div>
                <p className="mt-3 text-sm text-gray-500">{profile.email}</p>
              </div>

              <div className="flex gap-3 pb-3 w-full md:w-auto mt-4 md:mt-0">
                <Button variant="primary" className="flex-1 md:flex-none">
                  Contact
                </Button>
                <Button variant="outline" className="flex-1 md:flex-none">
                  <i className="fas fa-share-alt"></i>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
              <div className="lg:col-span-2 space-y-6">
                <section>
                  <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-accent pl-3">
                    About
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    {profile.about || 'Add your bio to introduce yourself to collaborators.'}
                  </p>
                </section>

                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white border-l-4 border-accent pl-3">
                      Top Skills
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.topSkills.length > 0 ? (
                      profile.topSkills.map((skill) => <Badge key={skill}>{skill}</Badge>)
                    ) : (
                      <p className="text-sm text-gray-500">No skills added yet.</p>
                    )}
                  </div>
                </section>

                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white border-l-4 border-accent pl-3">
                      Board Types
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.boardTypes.length > 0 ? (
                      profile.boardTypes.map((type) => <Badge key={type}>{type}</Badge>)
                    ) : (
                      <p className="text-sm text-gray-500">No board types added yet.</p>
                    )}
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                  <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">
                    Availability Status
                  </h4>
                  {profile.availability ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            profile.availability.status === 'busy'
                              ? 'bg-yellow-500'
                              : profile.availability.status === 'unavailable'
                                ? 'bg-red-500'
                                : 'bg-green-500'
                          }`}
                        ></div>
                        <span className="text-white font-bold capitalize">
                          {profile.availability.status}
                        </span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Next Available:</span>
                          <span className="text-gray-300">
                            {profile.availability.nextAvailable || 'Now'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Rate:</span>
                          <span className="text-gray-300">
                            {profile.availability.rate
                              ? `$${profile.availability.rate}/day`
                              : 'Contact'}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Set your availability so other users know when to reach out.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
