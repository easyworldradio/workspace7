
import React from 'react';
import { Resource } from '../types';
import { Plus, Trash, Tag, Link2, DollarSign, ExternalLink } from 'lucide-react';

interface Props {
  resources: Resource[];
  isEditing: boolean;
  onUpdate: (resources: Resource[]) => void;
}

const ResourceTable: React.FC<Props> = ({ resources, isEditing, onUpdate }) => {
  const addResource = () => {
    onUpdate([...resources, { id: crypto.randomUUID(), name: '', note: '', price: '', links: [''] }]);
  };

  const updateResource = (id: string, field: keyof Resource, value: any) => {
    onUpdate(resources.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const updateLink = (resId: string, linkIndex: number, value: string) => {
    const resource = resources.find(r => r.id === resId);
    if (!resource) return;
    const newLinks = [...resource.links];
    newLinks[linkIndex] = value;
    updateResource(resId, 'links', newLinks);
  };

  const deleteResource = (id: string) => {
    onUpdate(resources.filter(r => r.id !== id));
  };

  if (isEditing) {
    return (
      <div className="space-y-8 max-w-5xl animate-modern">
        {resources.map((res) => (
          <div key={res.id} className="bg-[var(--brand-card-bg)] border border-[var(--brand-border)] rounded-[32px] p-10 relative group shadow-sm transition-all hover:shadow-xl">
            <button onClick={() => deleteResource(res.id)} className="absolute top-8 right-8 p-2.5 text-[var(--brand-text-subtle)] hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
              <Trash className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[var(--brand-text-subtle)] tracking-[0.2em] uppercase block pl-1">İsimlendirme</label>
                  <input 
                    type="text"
                    value={res.name}
                    onChange={(e) => updateResource(res.id, 'name', e.target.value)}
                    className="w-full text-xl font-black bg-[var(--brand-bg)] border border-[var(--brand-border)] rounded-2xl p-5 focus:bg-[var(--brand-surface)] focus:ring-4 focus:ring-[#5E6AD2]/10 transition-all outline-none text-[var(--brand-text)]"
                    placeholder="Kalem adı"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[var(--brand-text-subtle)] tracking-[0.2em] uppercase block pl-1">Analiz</label>
                  <textarea 
                    value={res.note}
                    onChange={(e) => updateResource(res.id, 'note', e.target.value)}
                    className="w-full bg-[var(--brand-bg)] border border-[var(--brand-border)] rounded-2xl p-5 text-sm min-h-[140px] focus:bg-[var(--brand-surface)] focus:ring-4 focus:ring-[#5E6AD2]/10 transition-all outline-none text-[var(--brand-text)] leading-relaxed"
                    placeholder="Notlar..."
                  />
                </div>
              </div>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[var(--brand-text-subtle)] tracking-[0.2em] uppercase block pl-1">Bütçe</label>
                  <div className="relative">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--brand-text-subtle)]" />
                    <input 
                      type="text"
                      value={res.price}
                      onChange={(e) => updateResource(res.id, 'price', e.target.value)}
                      className="w-full bg-[var(--brand-bg)] border border-[var(--brand-border)] rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:bg-[var(--brand-surface)] focus:ring-4 focus:ring-[#5E6AD2]/10 transition-all outline-none text-[var(--brand-text)]"
                      placeholder="Maliyet"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[var(--brand-text-subtle)] tracking-[0.2em] uppercase block pl-1">URL Kaynakları</label>
                  <div className="space-y-4">
                    {res.links.map((link, idx) => (
                      <div key={idx} className="flex gap-2">
                        <div className="relative flex-1">
                          <Link2 className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--brand-text-subtle)]" />
                          <input 
                            type="text"
                            value={link}
                            onChange={(e) => updateLink(res.id, idx, e.target.value)}
                            className="w-full bg-[var(--brand-bg)] border border-[var(--brand-border)] rounded-xl py-4 pl-12 pr-6 text-xs focus:bg-[var(--brand-surface)] transition-all outline-none text-[var(--brand-text)] font-medium"
                            placeholder="Bağlantı URL"
                          />
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => updateResource(res.id, 'links', [...res.links, ''])}
                      className="text-[12px] font-black text-[#5E6AD2] bg-[#5E6AD2]/5 px-4 py-2 rounded-xl border border-[#5E6AD2]/20 hover:bg-[#5E6AD2]/10 transition-all"
                    >
                      + Yeni Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button onClick={addResource} className="w-full py-10 border-2 border-dashed border-[var(--brand-border)] rounded-[32px] text-[var(--brand-text-subtle)] hover:border-[#5E6AD2] hover:text-[#5E6AD2] hover:bg-[var(--brand-surface)] transition-all font-black flex items-center justify-center gap-4 group">
          <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" /> Yeni Envanter Kalemi
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[var(--brand-card-bg)] border border-[var(--brand-border)] rounded-[40px] overflow-hidden shadow-sm transition-all max-w-6xl animate-modern">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[var(--brand-column-bg)] border-b border-[var(--brand-border)] text-[12px] font-black text-[var(--brand-text-subtle)] tracking-[0.25em] uppercase">
              <th className="px-12 py-8">Kalem & Servis</th>
              <th className="px-12 py-8">Analiz</th>
              <th className="px-12 py-8">Bütçe</th>
              <th className="px-12 py-8">Kaynaklar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--brand-border)]">
            {resources.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-12 py-32 text-center text-[var(--brand-text-subtle)] font-bold italic opacity-60">Tanımlanmış kaynak bulunmuyor.</td>
              </tr>
            ) : (
              resources.map((res) => (
                <tr key={res.id} className="hover:bg-[var(--brand-bg)] transition-colors group">
                  <td className="px-12 py-10 align-top">
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-[var(--brand-primary)]/5 rounded-2xl shadow-sm">
                        <Tag className="w-6 h-6 text-[var(--brand-primary)]" />
                      </div>
                      <span className="font-black text-[var(--brand-text)] text-xl tracking-tight">{res.name || "İsimsiz"}</span>
                    </div>
                  </td>
                  <td className="px-12 py-10 align-top">
                    <p className="text-[var(--brand-text-subtle)] text-[15px] leading-relaxed max-w-sm italic font-medium">{res.note || "—"}</p>
                  </td>
                  <td className="px-12 py-10 align-top">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black px-5 py-2 rounded-2xl text-[14px] border border-emerald-500/20">
                      {res.price || "—"}
                    </div>
                  </td>
                  <td className="px-12 py-10 align-top">
                    <div className="flex flex-wrap gap-3">
                      {res.links.filter(l => l.trim() !== '').map((link, idx) => (
                        <a 
                          key={idx} 
                          href={link.startsWith('http') ? link : `https://${link}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 px-4 py-2.5 bg-[var(--brand-bg)] border border-[var(--brand-border)] rounded-2xl text-[var(--brand-text)] hover:bg-[var(--brand-primary)] hover:text-white hover:border-[var(--brand-primary)] transition-all group/link shadow-sm"
                          title={link}
                        >
                          <Link2 className="w-4 h-4" />
                          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                      ))}
                      {res.links.filter(l => l.trim() !== '').length === 0 && <span className="text-[var(--brand-border)] text-sm font-bold opacity-40">—</span>}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceTable;
