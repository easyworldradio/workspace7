
import React, { useState } from 'react';
import { User } from '../types';
import { ArrowRight, Lock, User as UserIcon, ChevronRight } from 'lucide-react';

interface Props {
  onAuthSuccess: (user: User) => void;
}

const AuthScreen: React.FC<Props> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.length < 3 || password.length < 4) {
      setError('Kullanıcı adı min 3, şifre min 4 karakter olmalıdır.');
      return;
    }

    const USERS_KEY = 'workspace7_users';
    const savedUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

    if (isLogin) {
      const user = savedUsers.find(u => u.username === username && u.password === password);
      if (user) {
        onAuthSuccess(user);
      } else {
        setError('Hatalı kullanıcı adı veya şifre.');
      }
    } else {
      const exists = savedUsers.find(u => u.username === username);
      if (exists) {
        setError('Bu kullanıcı adı zaten alınmış.');
      } else {
        const newUser: User = {
          id: crypto.randomUUID(),
          username,
          password
        };
        localStorage.setItem(USERS_KEY, JSON.stringify([...savedUsers, newUser]));
        onAuthSuccess(newUser);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-[#1A1D23] dark:text-white font-sans selection:bg-[#1A1D23] selection:text-white flex flex-col overflow-x-hidden transition-colors duration-500">
      {/* Structural Grid Background Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="h-full w-full grid grid-cols-4 md:grid-cols-12 gap-0">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border-r border-[#1A1D23] dark:border-white h-full"></div>
          ))}
        </div>
      </div>

      {/* Header Area */}
      <header className="relative z-10 border-b border-[#E2E4E9] dark:border-[#1F1F23] px-6 md:px-12 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="brand-logo-text text-[#1A1D23] dark:text-white text-2xl md:text-3xl">
            Workspace7<span className="brand-logo-reg">®</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-12">
          <span className="text-[11px] font-black tracking-[0.1em] text-[#1A1D23] dark:text-white">Studio Mitsun</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col">
        <section className="px-6 md:px-12 py-16 md:py-32 border-b border-[#E2E4E9] dark:border-[#1F1F23]">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-[13vw] md:text-[10vw] font-black tracking-[-0.04em] leading-[1.05] animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Articulate<br />
              The Vision<span className="text-[#9CA3AF]">.</span>
            </h1>
            
            <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
              <div className="md:col-span-7">
                <p className="text-2xl md:text-4xl font-medium tracking-tight leading-[1.2] max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 opacity-90">
                  Fikirlerinizi rasyonel yapılara dönüştüren, tasarım odaklı dijital çalışma istasyonu. 
                  Stratejinizi berraklaştırın, operasyonu yönetin.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Portal Section */}
        <section className="flex flex-col md:flex-row min-h-[600px]">
          <div className="flex-1 p-6 md:p-12 border-b md:border-b-0 md:border-r border-[#E2E4E9] dark:border-[#1F1F23] flex flex-col justify-between">
            <div className="max-w-md">
               <p className="text-lg font-medium leading-relaxed opacity-60 italic">
                 "Ücretsiz kayıt ol ve iş akış süreçlerini planlamaya başla"
               </p>
            </div>
            <div className="mt-12 flex items-baseline gap-2">
              <span className="text-5xl font-black">01</span>
              <span className="text-[10px] font-black tracking-widest text-[#9CA3AF]">Portal access</span>
            </div>
          </div>

          <div className="w-full md:w-[600px] p-6 md:p-12 bg-[#FBFBFB] dark:bg-[#0E0E10] flex items-center justify-center">
            <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-700 delay-300">
              <div className="mb-12">
                <h2 className="text-3xl font-black tracking-tighter mb-2">Giriş portalı</h2>
                <div className="h-1 w-12 bg-[#1A1D23] dark:bg-white border-none"></div>
              </div>

              <form onSubmit={handleAuth} className="space-y-8">
                <div className="space-y-2 group">
                  <label className="text-[9px] font-black tracking-[0.1em] text-[#9CA3AF] group-focus-within:text-[#1A1D23] dark:group-focus-within:text-white transition-colors">Kimlik doğrulama</label>
                  <div className="relative">
                    <input 
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-transparent border-b border-[#E2E4E9] dark:border-[#1F1F23] focus:border-[#1A1D23] dark:focus:border-white py-4 outline-none transition-all font-bold text-lg md:text-xl text-[#1A1D23] dark:text-white placeholder:text-[#D1D5DB] rounded-none"
                      placeholder="Kullanıcı adı"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[9px] font-black tracking-[0.1em] text-[#9CA3AF] group-focus-within:text-[#1A1D23] dark:group-focus-within:text-white transition-colors">Güvenlik anahtarı</label>
                  <div className="relative">
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent border-b border-[#E2E4E9] dark:border-[#1F1F23] focus:border-[#1A1D23] dark:focus:border-white py-4 outline-none transition-all font-bold text-lg md:text-xl text-[#1A1D23] dark:text-white placeholder:text-[#D1D5DB] rounded-none"
                      placeholder="Şifre"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-[10px] font-black text-red-500 bg-red-50 dark:bg-red-500/10 p-4 rounded-none border-l-4 border-red-500 animate-shake tracking-widest">
                    {error}
                  </div>
                )}

                <div className="pt-8 space-y-6">
                  <button 
                    type="submit"
                    className="w-full bg-[#1A1D23] dark:bg-white text-white dark:text-[#1A1D23] py-6 font-black text-xs tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-black dark:hover:bg-gray-100 transition-all active:scale-[0.98] shadow-2xl shadow-black/10"
                  >
                    {isLogin ? 'Bağlan' : 'Oluştur'} <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    className="w-full py-2 text-[10px] font-black text-[#9CA3AF] hover:text-[#1A1D23] dark:hover:text-white transition-colors tracking-[0.1em] flex items-center justify-center gap-2 group"
                  >
                    {isLogin ? 'Yeni hesap oluştur' : 'Giriş sayfasına dön'}
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 px-6 md:px-12 py-16 border-t border-[#E2E4E9] dark:border-[#1F1F23] mt-auto bg-white dark:bg-[#0A0A0B]">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
             <div className="brand-logo-text text-[#1A1D23] dark:text-white text-2xl">Workspace7<span className="brand-logo-reg">®</span></div>
             <p className="text-[10px] font-bold text-[#9CA3AF] tracking-[0.1em]">Articulate your vision</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-[11px] font-black tracking-[0.1em] text-[#1A1D23] dark:text-white">Studio Mitsun</p>
            <p className="text-[10px] font-bold text-[#9CA3AF] tracking-[0.1em] mt-1">© 2025 Creative intelligence</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        
        .brand-logo-text { 
            font-family: 'Inter', sans-serif; 
            font-weight: 900; 
            letter-spacing: -0.07em; 
            line-height: 1; 
        }
        .brand-logo-reg { 
            font-size: 0.35em; 
            font-weight: 700; 
            margin-left: 0.1em; 
        }
      `}</style>
    </div>
  );
};

export default AuthScreen;
