
import React, { useMemo } from 'react';
import { Workspace, ProgressStep } from '../types';
import { Plus, Box, Star, MoreHorizontal, AlertCircle, CalendarClock } from 'lucide-react';

interface Props {
  workspaces: Workspace[];
  onSelect: (id: string) => void;
  onCreate: () => void;
}

const WorkspaceList: React.FC<Props> = ({ workspaces, onSelect, onCreate }) => {
  const stats = useMemo(() => {
    let overdueCount = 0;
    let upcomingCount = 0;
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    workspaces.forEach(ws => {
      ws.progressSteps.forEach((step: ProgressStep) => {
        if (step.dueDate && step.status !== 'done') {
          const dueDate = new Date(step.dueDate);
          if (dueDate < now) {
            overdueCount++;
          } else if (dueDate <= threeDaysFromNow) {
            upcomingCount++;
          }
        }
      });
    });

    return { overdueCount, upcomingCount };
  }, [workspaces]);

  if (workspaces.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center animate-in fade-in">
        <div className="w-32 h-32 bg-[var(--brand-surface)] border border-[var(--brand-border)] rounded-full flex items-center justify-center mb-6">
          <Box className="w-12 h-12 text-[#B3BAC5] dark:text-[#3F3F46]" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-[var(--brand-text)]">Henüz projeniz yok</h2>
        <p className="text-[#6B778C] dark:text-[#9CA3AF] max-w-sm mb-8">
          Fikirlerinizi organize etmek için yeni bir çalışma alanı oluşturun.
        </p>
        <button onClick={onCreate} className="btn-modern">Proje oluştur</button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in flex flex-col min-h-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[var(--brand-text)] tracking-tight">Projeler</h1>
          <p className="text-[#6B778C] dark:text-[#9CA3AF] text-sm font-medium mt-1">Stratejik yol haritalarınız ve analizleriniz.</p>
        </div>
        <button onClick={onCreate} className="btn-modern flex items-center gap-2">
          <Plus className="w-4 h-4" /> Yeni Proje
        </button>
      </div>

      <div className="border border-[var(--brand-border)] rounded-[24px] overflow-hidden modern-card bg-[var(--brand-surface)] mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[var(--brand-bg)] border-b border-[var(--brand-border)] text-[11px] font-black text-[#9CA3AF] tracking-[0.2em] uppercase">
                <th className="px-6 py-4 w-10"></th>
                <th className="px-6 py-4">Proje Adı</th>
                <th className="px-6 py-4">Özet Analiz</th>
                <th className="px-6 py-4">Aşama</th>
                <th className="px-6 py-4">Son İşlem</th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--brand-border)]">
              {workspaces.map(w => (
                <tr 
                  key={w.id} 
                  onClick={() => onSelect(w.id)}
                  className="hover:bg-[var(--brand-bg)]/50 cursor-pointer transition-colors text-sm"
                >
                  <td className="px-6 py-6">
                    <Star className="w-4 h-4 text-gray-300 dark:text-[#3F3F46] hover:text-yellow-400 cursor-pointer" />
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-[#5E6AD2] text-white rounded-lg flex items-center justify-center text-[11px] font-black">
                        {w.title.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-[var(--brand-text)] text-lg tracking-tight">{w.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-[#6B778C] dark:text-[#9CA3AF] truncate max-w-xs font-medium">{w.summary || "Analiz girişi bekliyor"}</p>
                  </td>
                  <td className="px-6 py-6">
                    <span className="bg-[#F1F3F5] dark:bg-[#3F3F46] text-[#42526E] dark:text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider">
                      {w.progressSteps.length} ADIM
                    </span>
                  </td>
                  <td className="px-6 py-6 text-[#6B778C] dark:text-[#9CA3AF] font-medium">
                    {new Date(w.lastModified).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-6">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Summary Bar */}
      <div className="mt-auto py-6 border-t border-[var(--brand-border)] flex flex-wrap gap-8 items-center justify-center md:justify-start">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <CalendarClock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Yaklaşan Görevler</span>
            <span className="text-sm font-bold text-[var(--brand-text)]">{stats.upcomingCount} görev (3 gün içinde)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Tarihi Geçenler</span>
            <span className="text-sm font-bold text-[var(--brand-text)]">{stats.overdueCount} gecikmiş görev</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceList;
