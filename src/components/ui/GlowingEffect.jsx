import { memo } from "react";

const GlowingEffect = memo(({ className = "" }) => {
  return (
    <div 
      className={`absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400 via-yellow-400 via-green-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none scale-105 group-hover:scale-110 ${className}`}
    />
  );
});

GlowingEffect.displayName = "GlowingEffect";

export default GlowingEffect; 