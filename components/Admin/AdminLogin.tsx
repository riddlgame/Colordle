
import React, { useState } from 'react';
import { ADMIN_PASSWORD } from '../../constants';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLoginSuccess();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-indigo-900 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-500">
          <i className="fas fa-lock text-3xl"></i>
        </div>
        <h2 className="text-3xl font-black text-center text-gray-900 mb-2">Admin Panel</h2>
        <p className="text-center text-gray-500 mb-8 font-medium">Please enter your super-secret password to proceed.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="password"
              autoFocus
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter Password"
              className={`w-full p-4 bg-gray-50 rounded-2xl border-2 outline-none transition-all text-center text-lg font-bold tracking-widest ${error ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-100 focus:border-indigo-500 focus:ring-4 ring-indigo-50'}`}
            />
            {error && <p className="text-red-500 text-sm font-bold mt-2 text-center animate-bounce">Incorrect Password!</p>}
          </div>

          <div className="space-y-3">
            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
            >
              UNLOCK ACCESS
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-gray-100 transition-all"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
