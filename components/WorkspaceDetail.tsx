
import React, { useState } from 'react';
import { Workspace } from '../types';
import { ArrowLeft, Edit3, Trash2, Sparkles, Share2, Check, FileText, Package, Layout, UserPlus, Users } from 'lucide-react';
import { refineBusinessSummary } from '../services/geminiService';
import ResourceTable from './ResourceTable';
import ProgressManager from './ProgressManager';

interface Props {
  workspace: Workspace;
  onUpdate: (workspace: Workspace) => void;
  onDelete: () => void;
  onBack: () => void;
  readOnly?: boolean;
  currentUserId?: string;
}

type Tab = 'summary' | 'roadmap' | 'resources';

const WorkspaceDetail: React.FC<Props> = ({ workspace, onUpdate, onDelete, onBack, readOnly = false, currentUserId }) => {
  const [activeTab, setActiveTab] = useState<Tab>('roadmap');
  const [isEditing, setIsEditing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [showInviteInfo, setShowInviteInfo] = useState(false);

  const isOwner = workspace.userId === currentUserId;

  const handleRefine = async () => {
    if (!workspace.summary || readOnly) return;
    setIsRefining(true);
    const refined = await refineBusinessSummary(workspace.summary);
    onUpdate({ ...workspace, summary: refined });
    setIsRefining(false);
  };

  const handleShare = () => {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(workspace))));
    const shareUrl = `${window.location.origin}${window.location.pathname}#share:${encoded}`;
    navigator.clipboard.writeText(shareUrl);
    setShowShareSuccess(true);
    setTimeout(() => setShowShareSuccess(false), 2000);
  };

  const copyInviteCode = () => {
    if (workspace.inviteCode) {
      navigator.clipboard.writeText(workspace.inviteCode);
      alert('Davet kodu kopyalandı: ' + workspace.inviteCode);
    }
  };

  return (
    <div className="flex flex-col h-full animate-modern">
      {/* Navigation & Actions Top Bar */}
      <div className="flex items-center justify-between mb-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[11px] font-black text-[var(--brand-text)] hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl px-5 py-2.5 rounded-2xl border border-transparent hover:border-[var(--brand-border)] transition-all group tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Geri Dön
        </button>

        <div className="flex items-center gap-4">
          {isOwner && !readOnly && (
            <button 
              onClick={() => setShowInviteInfo(!showInviteInfo)}
              className="bg-[#5E6AD2]/5 dark:bg-[#5E6AD2]/10 text-[#5E6AD2] border border-[#5E6AD2]/20 px-5 py-2.5 rounded-2xl text-[13px] font-black hover:bg-[#5E6AD2]/15 transition-all flex items-center gap-2.5"
            >
              <UserPlus className="w-4 h-4" /> İşbirliği
            </button>
          )}

          {!readOnly && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-2xl text-[13px] font-black transition-all ${
                isEditing ? 'bg-[var(--brand-accent-bg)] text-[var(--brand-accent-text)] shadow-lg scale-105' : 'bg-white dark:bg-zinc-800 border border-[var(--brand-border)] text-[var(--brand-text)] hover:bg-slate-50 dark:hover:bg-zinc-900 shadow-sm'
              }`}
            >
              {isEditing ? <><Check className="w-4 h-4" /> Kaydet</> : <><Edit3 className="w-4 h-4" /> Düzenle</>}
            </button>
          )}
          <button onClick={handleShare} className="bg-white dark:bg-zinc-800 border border-[var(--brand-border)] text-[var(--brand-text)] px-5 py-2.5 rounded-2xl text-[13px] font-black hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all flex items-center gap-2.5 shadow-sm">
            {showShareSuccess ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />} Paylaş
          </button>
          <div className="w-px h-8 bg-[var(--brand-border)] mx-1 opacity-50"></div>
          {isOwner && !readOnly && (
            <button onClick={onDelete} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all">
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-[var(--brand-accent-bg)] text-[var(--brand-accent-text)] rounded-[28px] flex items-center justify-center text-3xl font-black shadow-2xl transition-transform hover:scale-105 duration-500">
            {workspace.title.charAt(0).toUpperCase()}
          </div>
          <div>
            {workspace.collaborators && workspace.collaborators.length > 0 && (
              <div className="flex items-center gap-1.5 text-[#36B37E] text-[11px] font-black tracking-[0.2em] mb-2 uppercase">
                <Users className="w-3.5 h-3.5" />
                <span>{workspace.collaborators.length}/3 İşbirlikçi</span>
              </div>
            )}
            <h1 className="text-4xl font-black text-[var(--brand-text)] tracking-tighter leading-tight">{workspace.title}</h1>
          </div>
        </div>
      </div>

      {showInviteInfo && isOwner && (
        <div className="mb-10 p-8 bg-[#5E6AD2]/5 dark:bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 rounded-[32px] animate-modern">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div>
                <h4 className="text-[16px] font-black text-[var(--brand-text)] mb-1">İşbirliği Paneli</h4>
                <p className="text-xs text-[#636D7E] dark:text-[#9CA3AF] font-medium">Bu boarda maksimum 3 kişi davet edebilirsiniz. Mevcut durum: {workspace.collaborators?.length || 0}/3</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-zinc-800 border border-[var(--brand-border)] px-6 py-3 rounded-2xl font-mono font-bold text-lg text-[var(--brand-text)] shadow-sm tracking-[0.3em]">
                  {workspace.inviteCode}
                </div>
                <button 
                  onClick={copyInviteCode}
                  className="bg-[var(--brand-accent-bg)] text-[var(--brand-accent-text)] px-6 py-3.5 rounded-2xl text-[11px] font-black hover:opacity-90 transition-all tracking-[0.1em] uppercase shadow-lg shadow-black/10"
                >
                  Kodu Kopyala
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase mb-1">Board Sahibi</p>
              <p className="text-sm font-black text-[var(--brand-text)]">Siz</p>
            </div>
          </div>
        </div>
      )}

      {/* Modern Segmented Control Tabs */}
      <div className="flex p-2 bg-slate-100 dark:bg-zinc-900/60 backdrop-blur-md rounded-[24px] mb-12 w-fit transition-all shadow-inner border border-[var(--brand-border)]">
        <button onClick={() => setActiveTab('roadmap')} className={`flex items-center gap-3 px-8 py-3 rounded-[20px] text-[14px] font-black transition-all ${activeTab === 'roadmap' ? 'bg-white dark:bg-zinc-800 text-[var(--brand-text)] shadow-xl' : 'text-slate-500 dark:text-zinc-500 hover:text-[var(--brand-text)]'}`}>
          <Layout className="w-4 h-4" /> Board
        </button>
        <button onClick={() => setActiveTab('summary')} className={`flex items-center gap-3 px-8 py-3 rounded-[20px] text-[14px] font-black transition-all ${activeTab === 'summary' ? 'bg-white dark:bg-zinc-800 text-[var(--brand-text)] shadow-xl' : 'text-slate-500 dark:text-zinc-500 hover:text-[var(--brand-text)]'}`}>
          <FileText className="w-4 h-4" /> Manifesto
        </button>
        <button onClick={() => setActiveTab('resources')} className={`flex items-center gap-3 px-8 py-3 rounded-[20px] text-[14px] font-black transition-all ${activeTab === 'resources' ? 'bg-white dark:bg-zinc-800 text-[var(--brand-text)] shadow-xl' : 'text-slate-500 dark:text-zinc-500 hover:text-[var(--brand-text)]'}`}>
          <Package className="w-4 h-4" /> Envanter
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {activeTab === 'summary' && (
          <div className="max-w-5xl animate-modern h-full">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-[var(--brand-text)] tracking-tighter">Stratejik Manifesto</h3>
              {isEditing && (
                <button 
                  onClick={handleRefine}
                  disabled={isRefining || !workspace.summary}
                  className="flex items-center gap-2.5 text-[11px] font-black text-[#5E6AD2] bg-[#5E6AD2]/5 dark:bg-[#5E6AD2]/10 px-6 py-3 rounded-full border border-[#5E6AD2]/20 hover:bg-[#5E6AD2]/15 transition-all tracking-[0.1em] uppercase"
                >
                  <Sparkles className={`w-4 h-4 ${isRefining ? 'animate-spin' : ''}`} />
                  {isRefining ? 'Yapay Zeka Çalışıyor...' : 'AI ile Optimize Et'}
                </button>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase pl-1">BAŞLIK</label>
                  <input 
                    type="text" 
                    value={workspace.title}
                    onChange={(e) => onUpdate({ ...workspace, title: e.target.value })}
                    className="w-full text-3xl font-black bg-white dark:bg-zinc-800 border border-[var(--brand-border)] rounded-[24px] p-8 focus:ring-4 focus:ring-[#5E6AD2]/10 outline-none transition-all shadow-sm text-[var(--brand-text)]"
                    placeholder="Proje adı"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase pl-1">İÇERİK</label>
                  <textarea 
                    value={workspace.summary}
                    onChange={(e) => onUpdate({ ...workspace, summary: e.target.value })}
                    className="w-full min-h-[500px] p-10 bg-white dark:bg-zinc-800 border border-[var(--brand-border)] rounded-[32px] focus:ring-4 focus:ring-[#5E6AD2]/10 outline-none text-[var(--brand-text)] leading-relaxed text-[18px] shadow-sm font-medium"
                    placeholder="Manifestonuzu buraya yazın..."
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-800 border border-[var(--brand-border)] rounded-[40px] p-14 md:p-20 shadow-xl transition-all hover:shadow-2xl">
                <p className="text-[22px] md:text-[26px] text-[var(--brand-text)] leading-[1.7] whitespace-pre-wrap font-medium font-serif opacity-90 tracking-tight">
                  {workspace.summary || "Burası henüz boş."}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="h-full">
            <ProgressManager 
              steps={workspace.progressSteps} 
              isEditing={isEditing}
              onUpdate={(steps) => onUpdate({ ...workspace, progressSteps: steps })}
            />
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="animate-modern h-full overflow-y-auto pr-4 custom-scrollbar">
            <ResourceTable 
              resources={workspace.resources} 
              isEditing={isEditing}
              onUpdate={(resources) => onUpdate({ ...workspace, resources: resources })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceDetail;
