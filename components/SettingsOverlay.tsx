
import React, { useState } from 'react';
import { User } from '../types';
import { X, User as UserIcon, Trash2, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  user: User;
  onClose: () => void;
  onUpdate: (user: User) => void;
  onDeleteAccount: () => void;
}

const SettingsOverlay: React.FC<Props> = ({ user, onClose, onUpdate, onDeleteAccount }) => {
  const [username, setUsername] = useState(user.username);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (username.length < 3) {
      setError('Kullanıcı adı en az 3 karakter olmalıdır.');
      return;
    }

    let updatedUser = { ...user, username };

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setError('Şifreler eşleşmiyor.');
        return;
      }
      if (newPassword.length < 4) {
        setError('Yeni şifre en az 4 karakter olmalıdır.');
        return;
      }
      updatedUser.password = newPassword;
    }

    onUpdate(updatedUser);
    setSuccess('Profil başarıyla güncellendi.');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDelete = () => {
    if (deleteConfirmPassword !== user.password) {
      setError('Hesabı silmek için geçerli şifrenizi girmelisiniz.');
      return;
    }
    onDeleteAccount();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-[var(--brand-overlay)] backdrop-blur-md animate-modern">
      <div className="bg-[var(--brand-surface)] border border-[var(--brand-border)] w-full max-w-2xl rounded-[36px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-10 border-b border-[var(--brand-border)] flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-[var(--brand-text)] tracking-tighter">Tercihler</h2>
            <p className="text-[13px] text-[#9CA3AF] font-medium mt-1.5 opacity-80 uppercase tracking-widest">Workspace Ayarları</p>
          </div>
          <button onClick={onClose} className="p-3 bg-[var(--brand-bg)] text-[#9CA3AF] hover:text-[var(--brand-text)] rounded-2xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-14 custom-scrollbar">
          {/* Profile Section */}
          <section>
            <h3 className="text-[11px] font-black tracking-[0.25em] text-[#9CA3AF] uppercase mb-8 border-l-4 border-[#5E6AD2] pl-3">Profil & Güvenlik</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-wider">Kullanıcı Adı</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D1D5DB]" />
                  <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[var(--brand-bg)] border border-[var(--brand-border)] rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:bg-[var(--brand-surface)] focus:ring-4 focus:ring-[#5E6AD2]/10 outline-none text-[var(--brand-text)] transition-all"
                  />
                </div>
              </div>

              <div className="p-8 bg-[#5E6AD2]/5 border border-[#5E6AD2]/10 rounded-3xl space-y-6">
                <div className="flex items-center gap-3 text-[#5E6AD2]">
                  <ShieldCheck className="w-5 h-5" />
                  <p className="text-[12px] font-black uppercase tracking-widest">Şifre Yönetimi</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="password"
                    placeholder="Yeni şifre"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[var(--brand-surface)] border border-[var(--brand-border)] rounded-2xl px-5 py-3 text-sm outline-none text-[var(--brand-text)] shadow-sm"
                  />
                  <input 
                    type="password"
                    placeholder="Onayla"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[var(--brand-surface)] border border-[var(--brand-border)] rounded-2xl px-5 py-3 text-sm outline-none text-[var(--brand-text)] shadow-sm"
                  />
                </div>
              </div>

              {error && <p className="text-xs font-bold text-red-500 bg-red-500/10 p-3 rounded-xl border-l-4 border-red-500">{error}</p>}
              {success && <p className="text-xs font-bold text-green-500 bg-green-500/10 p-3 rounded-xl border-l-4 border-green-500">{success}</p>}

              <button type="submit" className="w-full md:w-auto bg-[var(--brand-accent-bg)] text-[var(--brand-accent-text)] px-10 py-4 rounded-2xl text-[11px] font-black tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">
                DEĞİŞİKLİKLERİ KAYDET
              </button>
            </form>
          </section>

          {/* Danger Zone */}
          <section className="pt-14 border-t border-[var(--brand-border)]">
            <h3 className="text-[11px] font-black tracking-[0.25em] text-red-500 uppercase mb-8 flex items-center gap-2 border-l-4 border-red-500 pl-3">
              Kritik Bölge
            </h3>
            
            {!showDeleteConfirm ? (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="group flex items-center gap-5 text-red-500 bg-red-500/5 px-8 py-6 rounded-[28px] border border-red-500/10 hover:bg-red-500/10 transition-all w-full"
              >
                <div className="p-3 bg-[var(--brand-surface)] rounded-2xl shadow-sm text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-black uppercase tracking-tight">HESABI KALICI OLARAK SİL</p>
                  <p className="text-[11px] opacity-70 font-medium">Bu işlem tüm verileri geri alınamaz şekilde imha eder.</p>
                </div>
              </button>
            ) : (
              <div className="bg-red-500/5 border border-red-500/20 p-10 rounded-[32px] animate-modern">
                <div className="flex items-center gap-4 mb-4 text-red-600">
                  <AlertTriangle className="w-8 h-8" />
                  <p className="text-lg font-black tracking-tight">Hesap Silme Onayı</p>
                </div>
                <p className="text-[13px] text-[#9CA3AF] mb-8 leading-relaxed font-medium">Güvenliğiniz için şifrenizi girerek onaylayın. Tüm verileriniz silinecektir.</p>
                <div className="flex flex-col md:flex-row gap-4">
                  <input 
                    type="password"
                    placeholder="Onay için şifreniz"
                    value={deleteConfirmPassword}
                    onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                    className="flex-1 bg-[var(--brand-surface)] border-2 border-red-500/20 rounded-2xl px-6 py-4 text-sm outline-none text-[var(--brand-text)] focus:border-red-500 transition-all"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleDelete}
                      className="bg-red-600 text-white px-8 py-4 rounded-2xl text-[11px] font-black tracking-widest hover:bg-red-700 active:scale-[0.95] transition-all"
                    >
                      HESABI SİL
                    </button>
                    <button 
                      onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmPassword(''); }}
                      className="bg-[var(--brand-surface)] border border-[var(--brand-border)] px-8 py-4 rounded-2xl text-[11px] font-black tracking-widest hover:bg-[var(--brand-bg)] transition-all text-[var(--brand-text)]"
                    >
                      İPTAL
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsOverlay;
