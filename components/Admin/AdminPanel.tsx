
import React, { useState, useEffect } from 'react';
import { DailyColor, RGB } from '../../types';
import { storage, getFormattedDate } from '../../utils/helpers';
import { suggestColors } from '../../services/geminiService';
import Toast from '../Toast';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [colors, setColors] = useState<DailyColor[]>([]);
  const [originalColors, setOriginalColors] = useState<DailyColor[]>([]);
  const [newColor, setNewColor] = useState<DailyColor>({ date: getFormattedDate(), color: { r: 128, g: 128, b: 128 } });
  const [isDirty, setIsDirty] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'info' | 'error' | 'success' } | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    const saved = storage.getDailyColors();
    setColors(saved);
    setOriginalColors(saved);
  }, []);

  const handleUpdate = (index: number, field: keyof RGB, value: number) => {
    const updated = [...colors];
    updated[index].color[field] = value;
    setColors(updated);
    setIsDirty(true);
  };

  const handleDelete = (date: string) => {
    setColors(colors.filter(c => c.date !== date));
    setIsDirty(true);
  };

  const handleAdd = () => {
    if (colors.some(c => c.date === newColor.date)) {
      setToast({ message: "Date already exists!", type: 'error' });
      return;
    }
    setColors([newColor, ...colors]);
    setIsDirty(true);
  };

  const handleSuggest = async () => {
    setIsSuggesting(true);
    const suggestions = await suggestColors(3);
    if (suggestions.length > 0) {
      const first = suggestions[0];
      setNewColor({ ...newColor, color: first.color });
      setToast({ message: `AI Suggestion: ${first.name}`, type: 'success' });
    } else {
      setToast({ message: "API Key required for suggestions", type: 'error' });
    }
    setIsSuggesting(false);
  };

  const saveAll = () => {
    storage.saveDailyColors(colors);
    setOriginalColors(colors);
    setIsDirty(false);
    setToast({ message: "All changes saved successfully!", type: 'success' });
  };

  const discardChanges = () => {
    setColors(originalColors);
    setIsDirty(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black text-gray-800">Admin Dashboard</h1>
          <button onClick={onLogout} className="text-red-500 font-bold hover:text-red-600">Logout</button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Add New Form */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 text-gray-700">Add New Daily Color</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date (DD/MM/YYYY)</label>
              <input 
                type="text" 
                value={newColor.date}
                onChange={(e) => setNewColor({...newColor, date: e.target.value})}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-indigo-100 transition-all font-mono"
                placeholder="25/12/2024"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">RGB Values</label>
              <div className="grid grid-cols-3 gap-2">
                <input type="number" min="0" max="255" value={newColor.color.r} onChange={(e) => setNewColor({...newColor, color: {...newColor.color, r: +e.target.value}})} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center"/>
                <input type="number" min="0" max="255" value={newColor.color.g} onChange={(e) => setNewColor({...newColor, color: {...newColor.color, g: +e.target.value}})} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center"/>
                <input type="number" min="0" max="255" value={newColor.color.b} onChange={(e) => setNewColor({...newColor, color: {...newColor.color, b: +e.target.value}})} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center"/>
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={handleSuggest} disabled={isSuggesting} className="flex-1 p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-all flex items-center justify-center">
                {isSuggesting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
              </button>
              <button onClick={handleAdd} className="flex-[2] p-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">Add</button>
            </div>
          </div>
        </section>

        {/* List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-700">Existing Puzzles ({colors.length})</h2>
          {colors.map((item, idx) => (
            <div key={item.date} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 animate-in fade-in">
              <div 
                className="w-16 h-16 rounded-xl border-2 border-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: `rgb(${item.color.r}, ${item.color.g}, ${item.color.b})` }}
              ></div>
              <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-28 font-mono font-bold text-gray-600">{item.date}</div>
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <input type="number" min="0" max="255" value={item.color.r} onChange={(e) => handleUpdate(idx, 'r', +e.target.value)} className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-center text-sm"/>
                  <input type="number" min="0" max="255" value={item.color.g} onChange={(e) => handleUpdate(idx, 'g', +e.target.value)} className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-center text-sm"/>
                  <input type="number" min="0" max="255" value={item.color.b} onChange={(e) => handleUpdate(idx, 'b', +e.target.value)} className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-center text-sm"/>
                </div>
              </div>
              <button onClick={() => handleDelete(item.date)} className="p-3 text-red-300 hover:text-red-500 transition-colors">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Action Bar */}
      {isDirty && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-lg px-6 z-50 animate-in slide-in-from-bottom-4">
          <div className="bg-indigo-900/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl flex items-center justify-between border border-indigo-700">
            <span className="text-indigo-100 text-sm font-medium ml-2">You have unsaved changes</span>
            <div className="flex space-x-2">
              <button onClick={discardChanges} className="px-4 py-2 text-indigo-200 hover:text-white transition-colors text-sm font-bold uppercase">Discard</button>
              <button onClick={saveAll} className="px-6 py-2 bg-white text-indigo-900 rounded-xl text-sm font-black hover:bg-indigo-50 transition-all uppercase">Save All Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
