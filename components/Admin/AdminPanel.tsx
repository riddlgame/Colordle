import React, { useState, useEffect } from 'react';
import { DailyColor, RGB } from '../../types';
import { storage, getFormattedDate, generateRandomColor } from '../../utils/helpers';
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

  useEffect(() => {
    const saved = storage.getDailyColors();
    setColors(saved);
    setOriginalColors(saved);
  }, []);

  const handleUpdate = (index: number, field: keyof RGB, value: number) => {
    const updated = [...colors];
    updated[index].color[field] = Math.min(255, Math.max(0, value));
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
    setToast({ message: "Added color to list", type: 'success' });
  };

  const handleRandomize = () => {
    setNewColor({ ...newColor, color: generateRandomColor() });
  };

  const saveAll = () => {
    storage.saveDailyColors(colors);
    setOriginalColors(colors);
    setIsDirty(false);
    setToast({ message: "Changes saved to local storage", type: 'success' });
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
          <button onClick={onLogout} className="text-red-500 font-bold hover:text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors">Logout</button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 text-gray-700">Add New Daily Color</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date</label>
              <input 
                type="text" 
                value={newColor.date}
                onChange={(e) => setNewColor({...newColor, date: e.target.value})}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-mono outline-none"
                placeholder="DD/MM/YYYY"
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
              <button onClick={handleRandomize} className="flex-1 p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all" title="Random Color">
                <i className="fas fa-random"></i>
              </button>
              <button onClick={handleAdd} className="flex-[2] p-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">Add</button>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-xs text-gray-400 font-bold uppercase">Preview:</span>
            <div className="w-full h-4 rounded-full border border-gray-100" style={{ backgroundColor: `rgb(${newColor.color.r}, ${newColor.color.g}, ${newColor.color.b})` }}></div>
          </div>
        </section>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-700">Existing Puzzles ({colors.length})</h2>
          {colors.map((item, idx) => (
            <div key={`${item.date}-${idx}`} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-xl border-2 border-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: `rgb(${item.color.r}, ${item.color.g}, ${item.color.b})` }}
              ></div>
              <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-28 font-mono font-bold text-gray-600">{item.date}</div>
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <input type="number" value={item.color.r} onChange={(e) => handleUpdate(idx, 'r', +e.target.value)} className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-center text-sm"/>
                  <input type="number" value={item.color.g} onChange={(e) => handleUpdate(idx, 'g', +e.target.value)} className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-center text-sm"/>
                  <input type="number" value={item.color.b} onChange={(e) => handleUpdate(idx, 'b', +e.target.value)} className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-center text-sm"/>
                </div>
              </div>
              <button onClick={() => handleDelete(item.date)} className="p-3 text-red-300 hover:text-red-500">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
      </main>

      {isDirty && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-lg px-6 z-50">
          <div className="bg-gray-900 p-4 rounded-3xl shadow-2xl flex items-center justify-between border border-gray-800">
            <span className="text-white text-sm font-medium ml-2">Unsaved changes</span>
            <div className="flex space-x-2">
              <button onClick={discardChanges} className="px-4 py-2 text-gray-400 hover:text-white text-sm font-bold uppercase">Discard</button>
              <button onClick={saveAll} className="px-6 py-2 bg-indigo-500 text-white rounded-xl text-sm font-black hover:bg-indigo-400 transition-all uppercase">Save All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;