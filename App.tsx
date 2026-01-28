
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Search, LogOut, Layout, Settings, Users, Box, FileText, ChevronDown, Activity, UserPlus, Menu, X } from 'lucide-react';
import { Workspace, User } from './types';
import WorkspaceList from './components/WorkspaceList';
import WorkspaceDetail from './components/WorkspaceDetail';
import AuthScreen from './components/AuthScreen';
import SettingsOverlay from './components/SettingsOverlay';

const USERS_KEY = 'workspace7_users';
const SESSION_KEY = 'workspace7_active_user';
const ALL_WORKSPACES_KEY = 'workspace7_all_data_v2';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sharedWorkspace, setSharedWorkspace] = useState<Workspace | null>(null);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [showInviteJoin, setShowInviteJoin] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const quickMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Daima koyu mod sınıfını ekle
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickMenuRef.current && !quickMenuRef.current.contains(event.target as Node)) {
        setIsQuickMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem(SESSION_KEY);
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const handleHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith('share:')) {
        try {
          const encodedData = hash.replace('share:', '');
          const jsonStr = decodeURIComponent(
            atob(encodedData)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const decodedData = JSON.parse(jsonStr);
          setSharedWorkspace(decodedData);
        } catch (e) {
          console.error("Decoding error", e);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const loadData = useCallback(() => {
    if (!currentUser) return;
    const allDataRaw = localStorage.getItem(ALL_WORKSPACES_KEY);
    const allData: Workspace[] = allDataRaw ? JSON.parse(allDataRaw) : [];
    const userWorkspaces = allData.filter(w => 
      w.userId === currentUser.id || (w.collaborators && w.collaborators.includes(currentUser.id))
    );
    setWorkspaces(userWorkspaces);
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
    setSelectedWorkspaceId(null);
    window.location.hash = '';
    setSharedWorkspace(null);
    setIsQuickMenuOpen(false);
    setIsSettingsOpen(false);
  };

  const updateCurrentUser = (updated: User) => {
    setCurrentUser(updated);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    const savedUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const updatedUsers = savedUsers.map(u => u.id === updated.id ? updated : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  };

  const deleteAccount = () => {
    if (!currentUser) return;
    const savedUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const updatedUsers = savedUsers.filter(u => u.id !== currentUser.id);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    
    const allDataRaw = localStorage.getItem(ALL_WORKSPACES_KEY);
    const allData: Workspace[] = allDataRaw ? JSON.parse(allDataRaw) : [];
    const updatedWorkspaces = allData.filter(w => w.userId !== currentUser.id);
    localStorage.setItem(ALL_WORKSPACES_KEY, JSON.stringify(updatedWorkspaces));
    
    handleLogout();
  };

  const createWorkspace = () => {
    if (!currentUser || sharedWorkspace) return;
    const newWorkspace: Workspace = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      collaborators: [],
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      title: 'Yeni proje',
      summary: '',
      progressSteps: [],
      resources: [],
      createdAt: Date.now(),
      lastModified: Date.now()
    };
    
    const allDataRaw = localStorage.getItem(ALL_WORKSPACES_KEY);
    const allData: Workspace[] = allDataRaw ? JSON.parse(allDataRaw) : [];
    const updatedAll = [newWorkspace, ...allData];
    localStorage.setItem(ALL_WORKSPACES_KEY, JSON.stringify(updatedAll));
    
    setWorkspaces(prev => [newWorkspace, ...prev]);
    setSelectedWorkspaceId(newWorkspace.id);
    setIsQuickMenuOpen(false);
  };

  const updateWorkspace = useCallback((updated: Workspace) => {
    if (sharedWorkspace) return;
    const allDataRaw = localStorage.getItem(ALL_WORKSPACES_KEY);
    const allData: Workspace[] = allDataRaw ? JSON.parse(allDataRaw) : [];
    const updatedAll = allData.map(w => w.id === updated.id ? { ...updated, lastModified: Date.now() } : w);
    localStorage.setItem(ALL_WORKSPACES_KEY, JSON.stringify(updatedAll));
    setWorkspaces(prev => prev.map(w => w.id === updated.id ? { ...updated, lastModified: Date.now() } : w));
  }, [sharedWorkspace]);

  const deleteWorkspace = (id: string) => {
    if (sharedWorkspace) return;
    if (confirm('Projeyi silmek istediğinizden emin misiniz?')) {
      const allDataRaw = localStorage.getItem(ALL_WORKSPACES_KEY);
      const allData: Workspace[] = allDataRaw ? JSON.parse(allDataRaw) : [];
      const updatedAll = allData.filter(w => w.id !== id);
      localStorage.setItem(ALL_WORKSPACES_KEY, JSON.stringify(updatedAll));
      setWorkspaces(prev => prev.filter(w => w.id !== id));
      if (selectedWorkspaceId === id) setSelectedWorkspaceId(null);
    }
  };

  const handleJoinInvite = () => {
    if (!currentUser || !inviteCodeInput) return;
    const allDataRaw = localStorage.getItem(ALL_WORKSPACES_KEY);
    const allData: Workspace[] = allDataRaw ? JSON.parse(allDataRaw) : [];
    const targetWorkspaceIndex = allData.findIndex(w => w.inviteCode === inviteCodeInput.toUpperCase());
    if (targetWorkspaceIndex === -1) {
      alert('Geçersiz davet kodu.');
      return;
    }
    const target = allData[targetWorkspaceIndex];
    if (target.userId === currentUser.id) {
      alert('Bu board zaten sizin.');
      return;
    }
    if (target.collaborators && target.collaborators.includes(currentUser.id)) {
      alert('Zaten bu boarda üyesiniz.');
      return;
    }
    if (target.collaborators && target.collaborators.length >= 3) {
      alert('Bu board maksimum işbirlikçi sayısına (3) ulaştı.');
      return;
    }
    const updatedCollaborators = [...(target.collaborators || []), currentUser.id];
    allData[targetWorkspaceIndex] = { ...target, collaborators: updatedCollaborators };
    localStorage.setItem(ALL_WORKSPACES_KEY, JSON.stringify(allData));
    loadData();
    setInviteCodeInput('');
    setShowInviteJoin(false);
    setIsQuickMenuOpen(false);
    alert('Boarda başarıyla katıldınız!');
  };

  if (!currentUser && !sharedWorkspace) {
    return (
      <>
        <AuthScreen onAuthSuccess={handleLogin} />
        <footer className="fixed bottom-6 left-0 right-0 text-center z-[10000]">
          <a 
            href="https://instagram.com/yirmibest" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-elegant italic text-lg text-[#9CA3AF] hover:text-white transition-all duration-500 opacity-60 hover:opacity-100"
          >
            Studio Mitsun
          </a>
        </footer>
      </>
    );
  }

  const selectedWorkspace = sharedWorkspace || workspaces.find(w => w.id === selectedWorkspaceId);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--brand-bg)]">
      <header className="h-[64px] no-print flex items-center justify-between px-6 border-b border-[var(--brand-border)] bg-[var(--brand-header-bg)] backdrop-blur-md z-[100] sticky top-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setSelectedWorkspaceId(null)}>
            <div className="brand-logo-text text-[var(--brand-text)] text-2xl">
              Workspace7<span className="brand-logo-reg">®</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--brand-text-subtle)]" />
            <input 
              type="text" 
              placeholder="Ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[var(--brand-input-bg)] border border-[var(--brand-border)] rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:bg-[var(--brand-surface)] focus:ring-2 focus:ring-[#5E6AD2]/20 transition-all outline-none text-[var(--brand-text)] placeholder-[var(--brand-text-subtle)]"
            />
          </div>

          <div className="w-px h-6 bg-[var(--brand-border)] hidden sm:block"></div>

          <div className="relative" ref={quickMenuRef}>
            <button 
              onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
              className={`p-2 rounded-xl transition-all flex items-center gap-2 ${isQuickMenuOpen ? 'bg-[var(--brand-primary)] text-white shadow-lg' : 'text-[var(--brand-text-subtle)] hover:bg-[var(--brand-input-bg)] hover:text-[var(--brand-text)]'}`}
            >
              <Menu className="w-5 h-5" />
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider">Menü</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isQuickMenuOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {isQuickMenuOpen && (
              <div className="absolute top-12 right-0 w-64 bg-[var(--brand-surface)] border border-[var(--brand-border)] rounded-2xl shadow-2xl p-2 animate-modern overflow-hidden z-[200]">
                <div className="p-3 border-b border-[var(--brand-border)] mb-2">
                  <p className="text-[10px] font-black text-[var(--brand-text-subtle)] mb-1 uppercase tracking-widest">Kullanıcı</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#5E6AD2] rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {currentUser?.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--brand-text)] truncate">{currentUser?.username}</p>
                      <p className="text-[9px] text-[var(--brand-text-subtle)] font-medium uppercase tracking-wider">Node Aktif</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <button onClick={createWorkspace} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[var(--brand-text)] hover:bg-[var(--brand-bg)] transition-all group">
                    <div className="p-1.5 bg-[#5E6AD2]/10 rounded-lg group-hover:bg-[#5E6AD2] group-hover:text-white transition-all"><Plus className="w-3.5 h-3.5" /></div>
                    Yeni workspace
                  </button>
                  <button onClick={() => { setShowInviteJoin(!showInviteJoin); setIsQuickMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[var(--brand-text)] hover:bg-[var(--brand-bg)] transition-all group">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-all"><UserPlus className="w-3.5 h-3.5" /></div>
                    Koda katıl
                  </button>
                  <button onClick={() => { setIsSettingsOpen(true); setIsQuickMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[var(--brand-text)] hover:bg-[var(--brand-bg)] transition-all group">
                    <div className="p-1.5 bg-slate-500/10 rounded-lg group-hover:bg-slate-500 group-hover:text-white transition-all"><Settings className="w-3.5 h-3.5" /></div>
                    Ayarlar
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-[var(--brand-border)]">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all group">
                    <div className="p-1.5 bg-red-500/10 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-all"><LogOut className="w-3.5 h-3.5" /></div>
                    Oturumu kapat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {isSettingsOpen && currentUser && (
        <SettingsOverlay 
          user={currentUser} 
          onClose={() => setIsSettingsOpen(false)} 
          onUpdate={updateCurrentUser}
          onDeleteAccount={deleteAccount}
        />
      )}

      {showInviteJoin && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[var(--brand-overlay)] backdrop-blur-sm animate-modern">
          <div className="bg-[var(--brand-surface)] border border-[var(--brand-border)] p-8 rounded-[32px] shadow-2xl w-full max-w-sm relative">
            <button onClick={() => setShowInviteJoin(false)} className="absolute top-6 right-6 p-2 text-[var(--brand-text-subtle)] hover:text-[var(--brand-text)] transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
              <UserPlus className="w-8 h-8 text-emerald-500" />
            </div>
            <h4 className="text-xl font-black text-[var(--brand-text)] mb-2 tracking-tight">Boarda katıl</h4>
            <p className="text-xs text-[var(--brand-text-subtle)] font-medium mb-6 leading-relaxed">Ortak çalışma alanına dahil olmak için davet kodunu girin.</p>
            
            <div className="flex gap-2">
              <input 
                type="text"
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                placeholder="Örn: XJ82LK"
                className="flex-1 bg-[var(--brand-input-bg)] border border-[var(--brand-border)] rounded-2xl px-5 py-4 text-sm font-black focus:ring-2 focus:ring-[#5E6AD2]/20 outline-none tracking-widest uppercase text-[var(--brand-text)]"
                autoFocus
              />
              <button onClick={handleJoinInvite} className="bg-[var(--brand-accent-bg)] text-[var(--brand-accent-text)] px-6 py-4 rounded-2xl text-xs font-black hover:opacity-90 transition-all shadow-lg">Katıl</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {!sharedWorkspace && (
          <aside className="no-print hidden lg:flex w-[260px] flex-col flex-shrink-0 border-r border-[var(--brand-border)] bg-[var(--brand-surface)]/40 backdrop-blur-md transition-all duration-400">
            <div className="p-6">
              <p className="text-[11px] font-bold text-[var(--brand-text-subtle)] tracking-[0.15em] mb-4 uppercase">Aktif Alanlar</p>
              <nav className="space-y-1">
                {workspaces.map(w => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWorkspaceId(w.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${selectedWorkspaceId === w.id ? 'bg-[var(--brand-surface)] shadow-sm border border-[var(--brand-border)] text-[var(--brand-text)] font-bold' : 'text-[var(--brand-text-subtle)] hover:bg-[var(--brand-input-bg)] hover:text-[var(--brand-text)]'}`}
                  >
                    <div className={`w-2 h-2 rounded-full transition-transform group-hover:scale-125 ${selectedWorkspaceId === w.id ? 'bg-[#5E6AD2]' : 'bg-[var(--brand-border)]'}`}></div>
                    <span className="truncate">{w.title}</span>
                    {w.userId !== currentUser?.id && <Users className="w-3 h-3 text-[var(--brand-text-subtle)] ml-auto" />}
                  </button>
                ))}
                {workspaces.length === 0 && (
                  <p className="text-[11px] text-[var(--brand-text-subtle)] italic px-3 py-2">Henüz proje yok.</p>
                )}
              </nav>
            </div>
            
            <div className="mt-auto p-6 border-t border-[var(--brand-border)]">
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#5E6AD2]/5 border border-[#5E6AD2]/10">
                <Activity className="w-4 h-4 text-[#5E6AD2]" />
                <span className="text-xs font-bold text-[#5E6AD2]">Studio Mitsun Node</span>
              </div>
            </div>
          </aside>
        )}

        <main className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col bg-[var(--brand-bg)]">
          {sharedWorkspace && (
            <div className="bg-[var(--brand-accent-bg)] text-[var(--brand-accent-text)] py-2 text-center text-[10px] font-bold tracking-widest uppercase sticky top-0 z-[110]">
              Paylaşılan analiz • Sadece okuma
            </div>
          )}
          
          <div className="max-w-[1400px] w-full mx-auto p-6 md:p-10 flex-1">
            {selectedWorkspace ? (
              <WorkspaceDetail 
                workspace={selectedWorkspace} 
                onUpdate={updateWorkspace} 
                onDelete={() => deleteWorkspace(selectedWorkspace.id)}
                onBack={() => setSelectedWorkspaceId(null)}
                readOnly={!!sharedWorkspace}
                currentUserId={currentUser?.id}
              />
            ) : (
              <WorkspaceList 
                workspaces={workspaces.filter(w => w.title.toLowerCase().includes(searchQuery.toLowerCase()))} 
                onSelect={setSelectedWorkspaceId} 
                onCreate={createWorkspace}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
