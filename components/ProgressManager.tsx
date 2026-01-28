
import React, { useState } from 'react';
import { ProgressStep, ProgressStatus } from '../types';
import { Plus, Trash, GripVertical, MessageSquare, Clock, Calendar, Check, MoreHorizontal, CheckCircle2, Circle } from 'lucide-react';

interface Props {
  steps: ProgressStep[];
  isEditing: boolean;
  onUpdate: (steps: ProgressStep[]) => void;
}

interface ColumnProps {
  title: string;
  status: ProgressStatus;
  colorClass: string;
  steps: ProgressStep[];
  isEditing: boolean;
  expandedStep: string | null;
  setExpandedStep: (id: string | null) => void;
  onUpdate: (steps: ProgressStep[]) => void;
}

const Column: React.FC<ColumnProps> = ({ 
  title, 
  status, 
  colorClass, 
  steps, 
  isEditing, 
  expandedStep, 
  setExpandedStep, 
  onUpdate 
}) => {
  const columnSteps = steps.filter(s => s.status === status);
  const [isOver, setIsOver] = useState(false);

  const addStep = (status: ProgressStatus) => {
    const newStep: ProgressStep = {
      id: crypto.randomUUID(),
      text: '',
      note: '',
      isCompleted: status === 'done',
      status: status
    };
    onUpdate([...steps, newStep]);
    setExpandedStep(newStep.id);
  };

  const updateStatus = (id: string, newStatus: ProgressStatus) => {
    onUpdate(steps.map(s => s.id === id ? { 
      ...s, 
      status: newStatus, 
      isCompleted: newStatus === 'done' 
    } : s));
  };

  const deleteStep = (id: string) => {
    onUpdate(steps.filter(s => s.id !== id));
  };

  const toggleComplete = (id: string) => {
    onUpdate(steps.map(s => {
      if (s.id === id) {
        const nextStatus: ProgressStatus = s.status === 'done' ? 'todo' : 'done';
        return { ...s, status: nextStatus, isCompleted: nextStatus === 'done' };
      }
      return s;
    }));
  };

  const updateStepField = (id: string, field: keyof ProgressStep, value: any) => {
    onUpdate(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('stepId', id);
    e.dataTransfer.effectAllowed = 'move';
    (e.target as HTMLElement).style.opacity = '0.4';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const id = e.dataTransfer.getData('stepId');
    if (id) {
      updateStatus(id, status);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col flex-1 min-w-0 h-full min-h-[600px] rounded-[32px] p-4 transition-all duration-400 ${isOver ? 'bg-[var(--brand-primary)]/5 ring-2 ring-[var(--brand-primary)]/20' : 'bg-[var(--brand-column-bg)]'}`}
    >
      <div className="px-4 py-5 flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${colorClass} shadow-sm`}></div>
          <h4 className="text-[13px] font-black text-[var(--brand-text)] tracking-wider uppercase">
            {title}
          </h4>
          <span className="text-[11px] font-black text-[var(--brand-text-subtle)] bg-[var(--brand-surface)] px-2.5 py-0.5 rounded-lg border border-[var(--brand-border)]">
            {columnSteps.length}
          </span>
        </div>
        <button className="p-2 text-[var(--brand-text-subtle)] hover:text-[var(--brand-text)] hover:bg-[var(--brand-surface)] rounded-xl transition-all"><MoreHorizontal className="w-5 h-5" /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-1 pb-16 space-y-5 custom-scrollbar no-scrollbar">
        {columnSteps.map((step) => {
          return (
            <div 
              key={step.id} 
              draggable={!isEditing}
              onDragStart={(e) => handleDragStart(e, step.id)}
              onDragEnd={handleDragEnd}
              className={`modern-card p-6 group relative border border-[var(--brand-border)] bg-[var(--brand-card-bg)] transition-all cursor-grab active:cursor-grabbing ${expandedStep === step.id ? 'ring-2 ring-[var(--brand-primary)] border-transparent shadow-2xl scale-[1.01]' : 'hover:shadow-lg'}`}
              onClick={() => !isEditing && setExpandedStep(expandedStep === step.id ? null : step.id)}
            >
              <div className="flex items-start gap-4">
                {!isEditing && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleComplete(step.id); }}
                    className={`mt-0.5 transition-all transform active:scale-90 ${step.status === 'done' ? 'text-emerald-500' : 'text-[var(--brand-text-subtle)] hover:text-[var(--brand-primary)]'}`}
                  >
                    {step.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </button>
                )}
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <textarea 
                      value={step.text}
                      onChange={(e) => updateStepField(step.id, 'text', e.target.value)}
                      className="w-full text-[15px] font-bold border-none focus:ring-0 p-0 bg-transparent outline-none text-[var(--brand-text)] resize-none overflow-hidden placeholder:text-[var(--brand-text-subtle)] opacity-70"
                      placeholder="Görev Başlığı..."
                      rows={1}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${target.scrollHeight}px`;
                      }}
                      autoFocus={!step.text}
                    />
                  ) : (
                    <p className={`text-[15px] font-bold leading-[1.5] transition-all ${step.status === 'done' ? 'text-[var(--brand-text-subtle)] line-through opacity-60' : 'text-[var(--brand-text)]'}`}>
                      {step.text || "Yeni Görev"}
                    </p>
                  )}
                </div>
                
                {isEditing && (
                  <button onClick={(e) => { e.stopPropagation(); deleteStep(step.id); }} className="p-1.5 text-[var(--brand-text-subtle)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                    <Trash className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Enhanced Date Metadata Area */}
              <div className="mt-6 space-y-3">
                 {isEditing ? (
                   <div className="grid grid-cols-1 gap-3">
                     <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--brand-text-subtle)] opacity-60 ml-1">Görev Başlangıç</label>
                        <div className="flex items-center gap-2 p-2.5 bg-[var(--brand-bg)] rounded-xl border border-[var(--brand-border)] shadow-inner transition-all focus-within:border-[var(--brand-primary)]/50">
                          <Calendar className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                          <input 
                            type="date"
                            value={step.startDate || ''}
                            onChange={(e) => updateStepField(step.id, 'startDate', e.target.value)}
                            className="text-[11px] font-bold text-[var(--brand-text)] bg-transparent outline-none border-none focus:ring-0 cursor-pointer p-0 w-full"
                          />
                        </div>
                     </div>
                     <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--brand-text-subtle)] opacity-60 ml-1">Görev Bitiş</label>
                        <div className="flex items-center gap-2 p-2.5 bg-[var(--brand-bg)] rounded-xl border border-[var(--brand-border)] shadow-inner transition-all focus-within:border-[var(--brand-primary)]/50">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                          <input 
                            type="date"
                            value={step.dueDate || ''}
                            onChange={(e) => updateStepField(step.id, 'dueDate', e.target.value)}
                            className="text-[11px] font-bold text-[var(--brand-text)] bg-transparent outline-none border-none focus:ring-0 cursor-pointer p-0 w-full"
                          />
                        </div>
                     </div>
                   </div>
                 ) : (
                   (step.startDate || step.dueDate) && (
                     <div className="flex flex-col gap-2.5">
                       {step.startDate && (
                         <div className="flex items-center justify-between bg-[var(--brand-bg)] px-3 py-2.5 rounded-xl border border-[var(--brand-border)] shadow-sm">
                            <span className="text-[10px] font-black text-[var(--brand-text-subtle)] opacity-60 uppercase tracking-tighter">Başlangıç</span>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-[var(--brand-primary)]" />
                              <span className="text-[11px] font-bold text-[var(--brand-text)]">
                                {new Date(step.startDate).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                         </div>
                       )}
                       {step.dueDate && (
                         <div className="flex items-center justify-between bg-[var(--brand-bg)] px-3 py-2.5 rounded-xl border border-[var(--brand-border)] shadow-sm">
                            <span className="text-[10px] font-black text-[var(--brand-text-subtle)] opacity-60 uppercase tracking-tighter">Bitiş</span>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-emerald-500" />
                              <span className="text-[11px] font-bold text-[var(--brand-text)]">
                                {new Date(step.dueDate).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                         </div>
                       )}
                     </div>
                   )
                 )}
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--brand-bg)]">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-[var(--brand-text-subtle)] bg-[var(--brand-bg)] px-2.5 py-1 rounded-lg border border-[var(--brand-border)] tracking-tighter">ID-{steps.indexOf(step) + 1}</span>
                  {step.note && <MessageSquare className="w-4 h-4 text-[var(--brand-text-subtle)]" />}
                  {step.status === 'in-progress' && <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>}
                </div>
                {!isEditing && <GripVertical className="w-5 h-5 text-[var(--brand-text-subtle)] opacity-20 group-hover:opacity-100 transition-opacity" />}
              </div>

              {(expandedStep === step.id || isEditing) && (
                <div className="mt-5 pt-5 border-t border-[var(--brand-bg)]">
                  {isEditing ? (
                    <textarea 
                      value={step.note}
                      onChange={(e) => updateStepField(step.id, 'note', e.target.value)}
                      className="w-full text-xs text-[var(--brand-text)] bg-[var(--brand-bg)] border border-[var(--brand-border)] rounded-2xl p-5 focus:bg-[var(--brand-surface)] focus:ring-4 focus:ring-[#5E6AD2]/10 outline-none min-h-[140px] resize-none leading-relaxed placeholder:italic"
                      placeholder="Gelişim ve strateji notları..."
                    />
                  ) : (
                    <div className="bg-[var(--brand-bg)] p-6 rounded-[24px] text-[14px] text-[var(--brand-text-subtle)] leading-relaxed border border-[var(--brand-border)] shadow-inner font-medium italic">
                      {step.note || <span className="opacity-40 italic font-normal">Not bulunmuyor.</span>}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {isEditing && (
          <button 
            onClick={() => addStep(status)}
            className="w-full py-5 flex items-center justify-center gap-3 text-[13px] font-black text-[var(--brand-text-subtle)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-surface)] rounded-[28px] transition-all border-2 border-dashed border-[var(--brand-border)] hover:border-[var(--brand-primary)] mt-2 group shadow-sm"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" /> Yeni Kart Ekle
          </button>
        )}
      </div>
    </div>
  );
};

const ProgressManager: React.FC<Props> = ({ steps, isEditing, onUpdate }) => {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row gap-8 h-full pb-10 overflow-x-hidden print:block print:space-y-8">
        <Column 
          title="BACKLOG" 
          status="todo" 
          colorClass="bg-slate-400" 
          steps={steps}
          isEditing={isEditing}
          expandedStep={expandedStep}
          setExpandedStep={setExpandedStep}
          onUpdate={onUpdate}
        />
        <Column 
          title="AKTİF" 
          status="in-progress" 
          colorClass="bg-amber-500" 
          steps={steps}
          isEditing={isEditing}
          expandedStep={expandedStep}
          setExpandedStep={setExpandedStep}
          onUpdate={onUpdate}
        />
        <Column 
          title="TAMAMLANDI" 
          status="done" 
          colorClass="bg-emerald-500" 
          steps={steps}
          isEditing={isEditing}
          expandedStep={expandedStep}
          setExpandedStep={setExpandedStep}
          onUpdate={onUpdate}
        />
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ProgressManager;
