
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Text, MeshDistortMaterial } from '@react-three/drei';
import { Heart, Sparkles, Send, RefreshCw } from 'lucide-react';
import Rose3D from './components/Rose3D';
import FallingPetals from './components/FallingPetals';
import { GoogleGenAI } from '@google/genai';
import { RoseMessage } from './types';

const App: React.FC = () => {
  const [message, setMessage] = useState<RoseMessage>({
    title: "Happy Rose Day, Rohit!",
    content: "Sending you a rose as soft as your heart and as beautiful as your soul. May your day be filled with fragrance and love.",
    author: "With Love"
  });
  const [loading, setLoading] = useState(false);

  const generateNewMessage = useCallback(async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Write a short, heart-touching, and romantic Rose Day message specifically for a guy named Rohit. The tone should be soft and poetic. Return as JSON with keys: title, content, author.",
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const resText = response.text || "{}";
      const data = JSON.parse(resText);
      setMessage(data);
    } catch (error) {
      console.error("Failed to generate message", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-rose-950 via-black to-rose-950 overflow-hidden">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <color attach="background" args={['#050002']} />
          <fog attach="fog" args={['#050002', 5, 15]} />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff4d6d" />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#fff" />

          <Suspense fallback={null}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <Rose3D />
            </Float>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          </Suspense>

          <OrbitControls 
            enablePan={false} 
            enableZoom={false} 
            minPolarAngle={Math.PI / 3} 
            maxPolarAngle={Math.PI / 1.5} 
          />
        </Canvas>
      </div>

      {/* Decorative Overlay: Falling Petals */}
      <FallingPetals />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-8 md:p-12">
        {/* Header */}
        <div className="text-center mt-4">
          <h1 className="text-5xl md:text-7xl font-serif text-rose-200 drop-shadow-[0_0_15px_rgba(255,100,100,0.8)] animate-pulse">
            Happy Rose Day
          </h1>
          <p className="text-3xl md:text-5xl font-cursive text-white mt-2 drop-shadow-lg">
            Rohit
          </p>
        </div>

        {/* Floating Message Card */}
        <div className="max-w-md w-full bg-black/40 backdrop-blur-md border border-rose-500/30 p-6 rounded-3xl shadow-2xl pointer-events-auto transform transition-all hover:scale-105 group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex justify-between items-start mb-4">
            <Heart className="text-rose-500 fill-rose-500" size={24} />
            <button 
              onClick={generateNewMessage}
              disabled={loading}
              className="text-rose-300 hover:text-white transition-colors"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
            </button>
          </div>

          <h2 className="text-rose-200 font-serif text-xl mb-3">{message.title}</h2>
          <p className="text-rose-50/80 font-light italic leading-relaxed text-lg mb-4">
            "{message.content}"
          </p>
          <p className="text-right text-rose-400 font-cursive text-xl">— {message.author}</p>
        </div>

        {/* Footer Controls */}
        <div className="flex gap-4 pointer-events-auto mb-4">
          <button 
            className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-full font-medium transition-all transform hover:translate-y-[-2px] active:scale-95 shadow-lg shadow-rose-900/50"
            onClick={() => alert("Happy Rose Day shared with Rohit! ❤️")}
          >
            <Send size={18} />
            Send to Rohit
          </button>
        </div>
      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]"></div>
    </div>
  );
};

export default App;
