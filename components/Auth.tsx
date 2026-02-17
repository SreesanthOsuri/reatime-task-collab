
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (email: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) onLogin(email);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 pb-4 text-center">
          <div className="inline-block bg-black text-white p-3 rounded-lg font-black tracking-tighter text-xl mb-6">HINTRO</div>
          <h2 className="text-2xl font-bold text-gray-900">{isLogin ? 'Welcome Back' : 'Get Started'}</h2>
          <p className="text-gray-500 mt-2 text-sm">Real-time collaboration for elite teams.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="name@company.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Or continue with</span></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium">
              <i className="fa-brands fa-google"></i> Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium">
              <i className="fa-brands fa-github"></i> GitHub
            </button>
          </div>
        </form>

        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-black font-bold hover:underline"
            >
              {isLogin ? 'Create one' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
