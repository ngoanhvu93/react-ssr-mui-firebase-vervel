import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Keyboard, Activity, Zap } from "lucide-react";
import App from "~/root";
import { TopAppBar } from "~/components/TopAppBar";
import { useNavigate } from "react-router";

// Enhanced custom styles for better visual feedback
const pressedKeyStyles = `
  @keyframes pressedGlow {
    0% {
      box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
      transform: scale(1) translateY(0);
    }
    50% {
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.8), 0 0 25px rgba(59, 130, 246, 0.6);
      transform: scale(1.03) translateY(1px);
    }
    100% {
      box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
      transform: scale(1) translateY(0);
    }
  }
  
  @keyframes continuousGlow {
    0% {
      box-shadow: 0 0 8px rgba(34, 197, 94, 0.6), 0 0 12px rgba(59, 130, 246, 0.4);
      transform: scale(1.02) translateY(1px);
    }
    50% {
      box-shadow: 0 0 15px rgba(34, 197, 94, 0.8), 0 0 20px rgba(59, 130, 246, 0.6);
      transform: scale(1.04) translateY(1px);
    }
    100% {
      box-shadow: 0 0 8px rgba(34, 197, 94, 0.6), 0 0 12px rgba(59, 130, 246, 0.4);
      transform: scale(1.02) translateY(1px);
    }
  }
  
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(3);
      opacity: 0;
    }
  }
  
  @keyframes continuousRipple {
    0% {
      transform: scale(0);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.4;
    }
    100% {
      transform: scale(2.5);
      opacity: 0;
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-3px);
    }
  }
  
  @keyframes breathe {
    0%, 100% {
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
    }
    50% {
      box-shadow: 0 0 25px rgba(59, 130, 246, 0.6);
    }
  }
  
  @keyframes fullScreenPulse {
    0% {
      transform: scale(0.9);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.05);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0.95;
    }
  }
  
  @keyframes keyPressFlash {
    0% {
      background: rgba(34, 197, 94, 0.2);
      transform: scale(1);
    }
    25% {
      background: rgba(34, 197, 94, 0.4);
      transform: scale(1.01);
    }
    50% {
      background: rgba(59, 130, 246, 0.5);
      transform: scale(1.02);
    }
    75% {
      background: rgba(59, 130, 246, 0.3);
      transform: scale(1.01);
    }
    100% {
      background: transparent;
      transform: scale(1);
    }
  }
  
  @keyframes soundWave {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(2.5);
      opacity: 0;
    }
  }
  
  @keyframes continuousSoundWave {
    0% {
      transform: scale(0);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.3;
    }
    100% {
      transform: scale(2.5);
      opacity: 0;
    }
  }
  
  @keyframes sparkle {
    0%, 100% {
      opacity: 0;
      transform: scale(0) rotate(0deg);
    }
    50% {
      opacity: 1;
      transform: scale(1) rotate(180deg);
    }
  }
  
  .pressed-key {
    animation: pressedGlow 0.3s ease-out, keyPressFlash 0.3s ease-out;
    position: relative;
    transform: translateY(1px) !important;
  }
  
  .pressed-key::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: ripple 0.3s ease-out;
  }
  
  .pressed-key::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 32px;
    height: 32px;
    border: 2px solid rgba(34, 197, 94, 0.7);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: soundWave 0.4s ease-out;
  }
  
  .continuously-pressed {
    animation: continuousGlow 1s ease-in-out infinite !important;
    position: relative;
    transform: translateY(1px) scale(1.02) !important;
  }
  
  .continuously-pressed::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: continuousRipple 1.5s ease-in-out infinite;
  }
  
  .continuously-pressed::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    border: 2px solid rgba(34, 197, 94, 0.8);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: continuousSoundWave 2s ease-in-out infinite;
  }
  
  .continuously-pressed .sparkle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    animation: sparkle 1s ease-in-out infinite;
  }
  
  .continuously-pressed .sparkle:nth-child(1) {
    top: 20%;
    left: 20%;
    animation-delay: 0s;
  }
  
  .continuously-pressed .sparkle:nth-child(2) {
    top: 20%;
    right: 20%;
    animation-delay: 0.2s;
  }
  
  .continuously-pressed .sparkle:nth-child(3) {
    bottom: 20%;
    left: 20%;
    animation-delay: 0.4s;
  }
  
  .continuously-pressed .sparkle:nth-child(4) {
    bottom: 20%;
    right: 20%;
    animation-delay: 0.6s;
  }
  
  .full-screen-effect {
    animation: fullScreenPulse 0.2s ease-out;
  }
  
  .recently-pressed {
    background: linear-gradient(135deg, #f59e0b, #d97706) !important;
    color: white !important;
    border-color: #f59e0b !important;
    box-shadow: 0 0 12px rgba(245, 158, 11, 0.6) !important;
    transform: translateY(-1px) !important;
  }
  
  .frequently-pressed {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
    color: white !important;
    border-color: #8b5cf6 !important;
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.5) !important;
  }
  
  .key-hover {
    transition: all 0.15s ease;
  }
  
  .key-hover:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }
  
  .glass-effect {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .glass-effect-dark {
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .gradient-border {
    position: relative;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2px;
    border-radius: 12px;
  }
  
  .gradient-border::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    padding: 2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
  }
  
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.7);
  }
  
  .keyboard-container {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  .keyboard-container-dark {
    background: linear-gradient(145deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }
  
  .key-3d {
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 4px 8px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    position: relative;
  }
  
  .key-3d::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 30%, rgba(0, 0, 0, 0.05) 100%);
    border-radius: 6px;
    pointer-events: none;
  }
  
  .key-3d-dark {
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.3),
      0 4px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    position: relative;
  }
  
  .key-3d-dark::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, transparent 30%, rgba(0, 0, 0, 0.1) 100%);
    border-radius: 6px;
    pointer-events: none;
  }
  
  .key-3d:hover {
    transform: translateY(-1px);
    box-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.15),
      0 8px 16px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
  
  .key-3d-dark:hover {
    transform: translateY(-1px);
    box-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.4),
      0 8px 16px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  .floating-animation {
    animation: float 2s ease-in-out infinite;
  }
  
  .breathing-animation {
    animation: breathe 1.5s ease-in-out infinite;
  }
  
  .keyboard-glow {
    position: relative;
  }
  
  .keyboard-glow::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c);
    border-radius: 16px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .keyboard-glow:hover::before {
    opacity: 0.3;
  }
  
  .keyboard-glow::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c);
    border-radius: 14px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.2s ease;
    filter: blur(20px);
  }
  
  .keyboard-glow:hover::after {
    opacity: 0.1;
  }
  
  /* Realistic keyboard styling */
  .realistic-key {
    border-radius: 4px;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    user-select: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(0, 0, 0, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  .realistic-key::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%, rgba(0, 0, 0, 0.1) 100%);
    pointer-events: none;
  }
  
  .realistic-key-dark {
    border-radius: 4px;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    user-select: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.3),
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }
  
  .realistic-key-dark::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 50%, rgba(0, 0, 0, 0.2) 100%);
    pointer-events: none;
  }
  
  /* Improved keyboard layout styles */
  .keyboard-section {
    position: relative;
  }
  
  .keyboard-section::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  }
  
  .keyboard-section-dark::after {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
  
  .keyboard-row {
    display: flex;
    gap: 3px;
    justify-content: center;
    margin-bottom: 3px;
    align-items: center;
  }
  
  .keyboard-row:last-child {
    margin-bottom: 0;
  }
  
  .keyboard-key {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(0, 0, 0, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  .keyboard-key::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%, rgba(0, 0, 0, 0.1) 100%);
    pointer-events: none;
  }
  
  .keyboard-key-dark::before {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 50%, rgba(0, 0, 0, 0.2) 100%);
  }
  
  .keyboard-separator {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    margin: 16px 0;
  }
  
  .keyboard-separator-dark {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  }
  
  .numpad-section {
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    padding-left: 16px;
  }
  
  .numpad-section-dark {
    border-left-color: rgba(255, 255, 255, 0.05);
  }
  
  .arrow-keys-section {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3px;
    width: fit-content;
  }
  
  .arrow-keys-section .keyboard-key:nth-child(1) {
    grid-column: 2;
  }
  
  .arrow-keys-section .keyboard-key:nth-child(2) {
    grid-column: 1;
    grid-row: 2;
  }
  
  .arrow-keys-section .keyboard-key:nth-child(3) {
    grid-column: 2;
    grid-row: 2;
  }
  
  .arrow-keys-section .keyboard-key:nth-child(4) {
    grid-column: 3;
    grid-row: 2;
  }
  
  /* Fixed layout improvements */
  .keyboard-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: fit-content;
    margin: 0 auto;
    padding: 20px;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  .function-keys-row {
    display: flex;
    gap: 3px;
    justify-content: center;
    margin-bottom: 20px;
    width: 100%;
  }
  
  .main-keyboard {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-bottom: 40px;
    width: 100%;
  }
  
  .keyboard-row {
    display: flex;
    gap: 3px;
    justify-content: center;
    align-items: center;
  }
  
  .bottom-section {
    display: flex;
    gap: 40px;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
  }
  
  .navigation-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
  
  .navigation-keys-row {
    display: flex;
    gap: 3px;
    justify-content: center;
  }
  
  .arrow-keys-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3px;
    width: fit-content;
  }
  
  .numpad-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 3px;
    width: fit-content;
  }
  
  /* Ensure consistent key sizing */
  .key-consistent {
    min-width: 48px;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .keyboard-container {
      transform: scale(0.8);
      transform-origin: top center;
    }
  }
  
  @media (max-width: 640px) {
    .keyboard-container {
      transform: scale(0.6);
      transform-origin: top center;
    }
  }

  /* Mechanical keyboard key styling */
  .mechanical-key {
    border-radius: 4px;
    font-weight: 600;
    letter-spacing: 0.3px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    user-select: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.15);
    box-shadow: 
      0 1px 3px rgba(0, 0, 0, 0.1),
      0 2px 6px rgba(0, 0, 0, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
    transition: all 0.15s ease;
  }
  
  .mechanical-key::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.12) 0%, transparent 40%, rgba(0, 0, 0, 0.08) 100%);
    pointer-events: none;
  }
  
  .mechanical-key-dark {
    border-radius: 4px;
    font-weight: 600;
    letter-spacing: 0.3px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
    user-select: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 
      0 1px 3px rgba(0, 0, 0, 0.3),
      0 2px 6px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.03);
    transition: all 0.15s ease;
  }
  
  .mechanical-key-dark::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.06) 0%, transparent 40%, rgba(0, 0, 0, 0.15) 100%);
    pointer-events: none;
  }
  
  .mechanical-key:hover {
    transform: translateY(-1px);
    box-shadow: 
      0 2px 6px rgba(0, 0, 0, 0.15),
      0 4px 12px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
  
  .mechanical-key-dark:hover {
    transform: translateY(-1px);
    box-shadow: 
      0 2px 6px rgba(0, 0, 0, 0.4),
      0 4px 12px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
`;

interface KeyPress {
  key: string;
  keyCode: number;
  timestamp: number;
  type: "keydown" | "keyup";
}

const KeyDisplay = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col leading-tight items-center justify-center h-full">
    {children}
  </div>
);

// Keyboard layout data with realistic sizes and positioning
const keyboardLayout = [
  [
    {
      key: "`",
      display: (
        <KeyDisplay>
          <span>~</span>
          <span>`</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    {
      key: "1",
      display: (
        <KeyDisplay>
          <span>!</span>
          <span>1</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    {
      key: "2",
      display: (
        <KeyDisplay>
          <span>@</span>
          <span>2</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    {
      key: "3",
      display: (
        <KeyDisplay>
          <span>#</span>
          <span>3</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    {
      key: "4",
      display: (
        <KeyDisplay>
          <span>$</span>
          <span>4</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    {
      key: "5",
      display: (
        <KeyDisplay>
          <span>%</span>
          <span>5</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    {
      key: "6",
      display: (
        <KeyDisplay>
          <span>^</span>
          <span>6</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    {
      key: "7",
      display: (
        <KeyDisplay>
          <span>&</span>
          <span>7</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    {
      key: "8",
      display: (
        <KeyDisplay>
          <span>*</span>
          <span>8</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    {
      key: "9",
      display: (
        <KeyDisplay>
          <span>(</span>
          <span>9</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    {
      key: "0",
      display: (
        <KeyDisplay>
          <span>)</span>
          <span>0</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    {
      key: "-",
      display: (
        <KeyDisplay>
          <span>_</span>
          <span>-</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    {
      key: "=",
      display: (
        <KeyDisplay>
          <span>+</span>
          <span>=</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    { key: "Backspace", display: "Backspace", width: "w-20 h-12" },
  ],
  [
    { key: "Tab", display: "Tab", width: "w-14 h-12" },
    { key: "q", display: "Q", width: "w-12 h-12" },
    { key: "w", display: "W", width: "w-12 h-12" },
    { key: "e", display: "E", width: "w-12 h-12" },
    { key: "r", display: "R", width: "w-12 h-12" },
    { key: "t", display: "T", width: "w-12 h-12" },
    { key: "y", display: "Y", width: "w-12 h-12" },
    { key: "u", display: "U", width: "w-12 h-12" },
    { key: "i", display: "I", width: "w-12 h-12" },
    { key: "o", display: "O", width: "w-12 h-12" },
    { key: "p", display: "P", width: "w-12 h-12" },
    {
      key: "[",
      display: (
        <KeyDisplay>
          <span>{"{"}</span>
          <span>[</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    {
      key: "]",
      display: (
        <KeyDisplay>
          <span>{"}"}</span>
          <span>]</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    {
      key: "\\",
      display: (
        <KeyDisplay>
          <span>|</span>
          <span>\</span>
        </KeyDisplay>
      ),
      width: "w-16 h-12",
    },
  ],
  [
    { key: "CapsLock", display: "Caps Lock", width: "w-20 h-12" },
    { key: "a", display: "A", width: "w-12 h-12" },
    { key: "s", display: "S", width: "w-12 h-12" },
    { key: "d", display: "D", width: "w-12 h-12" },
    { key: "f", display: "F", width: "w-12 h-12" },
    { key: "g", display: "G", width: "w-12 h-12" },
    { key: "h", display: "H", width: "w-12 h-12" },
    { key: "j", display: "J", width: "w-12 h-12" },
    { key: "k", display: "K", width: "w-12 h-12" },
    { key: "l", display: "L", width: "w-12 h-12" },
    {
      key: ";",
      display: (
        <KeyDisplay>
          <span>:</span>
          <span>;</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    {
      key: "'",
      display: (
        <KeyDisplay>
          <span>"</span>
          <span>'</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    { key: "Enter", display: "Enter", width: "w-20 h-12" },
  ],
  [
    { key: "ShiftLeft", display: "Shift", width: "w-24 h-12" },
    { key: "z", display: "Z", width: "w-12 h-12" },
    { key: "x", display: "X", width: "w-12 h-12" },
    { key: "c", display: "C", width: "w-12 h-12" },
    { key: "v", display: "V", width: "w-12 h-12" },
    { key: "b", display: "B", width: "w-12 h-12" },
    { key: "n", display: "N", width: "w-12 h-12" },
    { key: "m", display: "M", width: "w-12 h-12" },
    {
      key: ",",
      display: (
        <KeyDisplay>
          <span>{"<"}</span>
          <span>,</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    {
      key: ".",
      display: (
        <KeyDisplay>
          <span>{">"}</span>
          <span>.</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    {
      key: "/",
      display: (
        <KeyDisplay>
          <span>?</span>
          <span>/</span>
        </KeyDisplay>
      ),
      width: "w-12 h-12",
    },
    { key: "ShiftRight", display: "Shift", width: "w-24 h-12" },
  ],
  [
    { key: "ControlLeft", display: "Ctrl", width: "w-16 h-12" },
    { key: "MetaLeft", display: "Win", width: "w-16 h-12" },
    { key: "AltLeft", display: "Alt", width: "w-16 h-12" },
    { key: "Space", display: "Space", width: "w-80 h-12" },
    { key: "AltRight", display: "Alt", width: "w-16 h-12" },
    { key: "MetaRight", display: "Win", width: "w-16 h-12" },
    { key: "ControlRight", display: "Ctrl", width: "w-16 h-12" },
  ],
];

// Function keys row with proper spacing
const functionKeys = [
  { key: "Escape", display: "Esc", width: "w-16 h-12" },
  { key: "F1", display: "F1", width: "w-12 h-12" },
  { key: "F2", display: "F2", width: "w-12 h-12" },
  { key: "F3", display: "F3", width: "w-12 h-12" },
  { key: "F4", display: "F4", width: "w-12 h-12" },
  { key: "F5", display: "F5", width: "w-12 h-12" },
  { key: "F6", display: "F6", width: "w-12 h-12" },
  { key: "F7", display: "F7", width: "w-12 h-12" },
  { key: "F8", display: "F8", width: "w-12 h-12" },
  { key: "F9", display: "F9", width: "w-12 h-12" },
  { key: "F10", display: "F10", width: "w-12 h-12" },
  { key: "F11", display: "F11", width: "w-12 h-12" },
  { key: "F12", display: "F12", width: "w-12 h-12" },
];

// Navigation keys section (Insert, Home, PageUp, etc.)
const navigationKeys = [
  { key: "Insert", display: "Insert", width: "w-16 h-12" },
  { key: "Home", display: "Home", width: "w-16 h-12" },
  { key: "PageUp", display: "Pg Up", width: "w-16 h-12" },
  { key: "Delete", display: "Delete", width: "w-16 h-12" },
  { key: "End", display: "End", width: "w-16 h-12" },
  { key: "PageDown", display: "Pg Dn", width: "w-16 h-12" },
];

// Numpad section with proper layout
const numpadKeys = [
  { key: "NumLock", display: "NumLk", width: "w-16 h-12" },
  { key: "NumpadDivide", display: "/", width: "w-16 h-12" },
  { key: "NumpadMultiply", display: "*", width: "w-16 h-12" },
  { key: "NumpadSubtract", display: "-", width: "w-16 h-12" },
  { key: "Numpad7", display: "7", width: "w-16 h-12" },
  { key: "Numpad8", display: "8", width: "w-16 h-12" },
  { key: "Numpad9", display: "9", width: "w-16 h-12" },
  {
    key: "NumpadAdd",
    display: "+",
    width: "w-16 h-24",
    extraClass: "row-span-2",
  },
  { key: "Numpad4", display: "4", width: "w-16 h-12" },
  { key: "Numpad5", display: "5", width: "w-16 h-12" },
  { key: "Numpad6", display: "6", width: "w-16 h-12" },
  { key: "Numpad1", display: "1", width: "w-16 h-12" },
  { key: "Numpad2", display: "2", width: "w-16 h-12" },
  { key: "Numpad3", display: "3", width: "w-16 h-12" },
  {
    key: "NumpadEnter",
    display: "Enter",
    width: "w-16 h-24",
    extraClass: "row-span-2",
  },
  {
    key: "Numpad0",
    display: "0",
    width: "w-32 h-12",
    extraClass: "col-span-2",
  },
  { key: "NumpadDecimal", display: ".", width: "w-16 h-12" },
];

export default function KeyboardTester() {
  const [keyPresses, setKeyPresses] = useState<KeyPress[]>([]);
  const [isListening, setIsListening] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [totalPresses, setTotalPresses] = useState(0);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [recentlyPressedKeys, setRecentlyPressedKeys] = useState<Set<string>>(
    new Set()
  );
  const [permanentlyPressedKeys, setPermanentlyPressedKeys] = useState<
    Set<string>
  >(new Set());

  const handleKeyEvent = useCallback(
    (event: KeyboardEvent, type: "keydown" | "keyup") => {
      if (!isListening) return;

      // Map keys to their proper identifiers
      let keyName = event.key;

      // Handle modifier keys with location-specific codes
      if (
        event.key === "Shift" ||
        event.key === "Control" ||
        event.key === "Alt" ||
        event.key === "Meta"
      ) {
        keyName = event.code;
      }

      // Handle numpad keys
      if (event.location === 3) {
        switch (event.key) {
          case "0":
            keyName = "Numpad0";
            break;
          case "1":
            keyName = "Numpad1";
            break;
          case "2":
            keyName = "Numpad2";
            break;
          case "3":
            keyName = "Numpad3";
            break;
          case "4":
            keyName = "Numpad4";
            break;
          case "5":
            keyName = "Numpad5";
            break;
          case "6":
            keyName = "Numpad6";
            break;
          case "7":
            keyName = "Numpad7";
            break;
          case "8":
            keyName = "Numpad8";
            break;
          case "9":
            keyName = "Numpad9";
            break;
          case "/":
            keyName = "NumpadDivide";
            break;
          case "*":
            keyName = "NumpadMultiply";
            break;
          case "-":
            keyName = "NumpadSubtract";
            break;
          case "+":
            keyName = "NumpadAdd";
            break;
          case "Enter":
            keyName = "NumpadEnter";
            break;
          case ".":
            keyName = "NumpadDecimal";
            break;
        }
      }

      // Handle special keys that might have different names
      const specialKeyMap: { [key: string]: string } = {
        " ": "Space",
        Space: "Space",
        Escape: "Escape",
        Tab: "Tab",
        Enter: "Enter",
        Backspace: "Backspace",
        Delete: "Delete",
        ArrowUp: "ArrowUp",
        ArrowDown: "ArrowDown",
        ArrowLeft: "ArrowLeft",
        ArrowRight: "ArrowRight",
        CapsLock: "CapsLock",
        Insert: "Insert",
        Home: "Home",
        End: "End",
        PageUp: "PageUp",
        PageDown: "PageDown",
        PrintScreen: "PrintScreen",
        ScrollLock: "ScrollLock",
        Pause: "Pause",
        NumLock: "NumLock",
        ContextMenu: "ContextMenu",
      };

      // Use mapped name if available, otherwise use original
      keyName = specialKeyMap[keyName] || keyName;

      const keyPress: KeyPress = {
        key: keyName,
        keyCode: event.keyCode,
        timestamp: Date.now(),
        type,
      };

      setKeyPresses((prev) => [keyPress, ...prev.slice(0, 49)]); // Keep last 50 presses
      setTotalPresses((prev) => prev + 1);

      if (type === "keydown") {
        setCurrentKey(keyName);
        setPressedKeys((prev) => new Set(prev).add(keyName));
        setRecentlyPressedKeys((prev) => new Set(prev).add(keyName));
        setPermanentlyPressedKeys((prev) => new Set(prev).add(keyName));

        // Remove from recently pressed after 2 seconds
        setTimeout(() => {
          setRecentlyPressedKeys((prev) => {
            const newSet = new Set(prev);
            newSet.delete(keyName);
            return newSet;
          });
        }, 2000);

        // Add visual feedback for any pressed key
        const keyElement = document.querySelector(
          `[data-key="${keyName}"]`
        ) as HTMLElement;
        if (keyElement) {
          keyElement.classList.add("pressed-key");
          setTimeout(() => {
            keyElement.classList.remove("pressed-key");
          }, 300);
        }
      } else {
        setPressedKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(keyName);
          return newSet;
        });
      }
    },
    [isListening]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) =>
      handleKeyEvent(event, "keydown");
    const handleKeyUp = (event: KeyboardEvent) => {
      handleKeyEvent(event, "keyup");
      setTimeout(() => setCurrentKey(null), 100);
    };

    if (isListening) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [isListening, handleKeyEvent]);

  const clearStats = () => {
    setKeyPresses([]);
    setTotalPresses(0);
    setPressedKeys(new Set());
    setRecentlyPressedKeys(new Set());
    setPermanentlyPressedKeys(new Set());
  };

  const isKeyPressed = (key: string) => {
    // Check exact match first, then case variations
    if (pressedKeys.has(key)) return true;

    // For letter keys, check both cases
    if (key.length === 1) {
      if (
        pressedKeys.has(key.toLowerCase()) ||
        pressedKeys.has(key.toUpperCase())
      ) {
        return true;
      }
    }

    // For special keys, check common variations
    const keyVariations: { [key: string]: string[] } = {
      Shift: ["ShiftLeft", "ShiftRight"],
      Control: ["ControlLeft", "ControlRight"],
      Alt: ["AltLeft", "AltRight"],
      Meta: ["MetaLeft", "MetaRight"],
    };

    const variations = keyVariations[key];
    if (variations) {
      return variations.some((variation) => pressedKeys.has(variation));
    }

    return false;
  };

  const isRecentlyPressed = (key: string) => {
    // Check exact match first, then case variations
    if (recentlyPressedKeys.has(key)) return true;

    // For letter keys, check both cases
    if (key.length === 1) {
      if (
        recentlyPressedKeys.has(key.toLowerCase()) ||
        recentlyPressedKeys.has(key.toUpperCase())
      ) {
        return true;
      }
    }

    // For special keys, check common variations
    const keyVariations: { [key: string]: string[] } = {
      Shift: ["ShiftLeft", "ShiftRight"],
      Control: ["ControlLeft", "ControlRight"],
      Alt: ["AltLeft", "AltRight"],
      Meta: ["MetaLeft", "MetaRight"],
    };

    const variations = keyVariations[key];
    if (variations) {
      return variations.some((variation) => recentlyPressedKeys.has(variation));
    }

    return false;
  };

  const isPermanentlyPressed = (key: string) => {
    // Check exact match first, then case variations
    if (permanentlyPressedKeys.has(key)) return true;

    // For letter keys, check both cases
    if (key.length === 1) {
      if (
        permanentlyPressedKeys.has(key.toLowerCase()) ||
        permanentlyPressedKeys.has(key.toUpperCase())
      ) {
        return true;
      }
    }

    // For special keys, check common variations
    const keyVariations: { [key: string]: string[] } = {
      Shift: ["ShiftLeft", "ShiftRight"],
      Control: ["ControlLeft", "ControlRight"],
      Alt: ["AltLeft", "AltRight"],
      Meta: ["MetaLeft", "MetaRight"],
    };

    const variations = keyVariations[key];
    if (variations) {
      return variations.some((variation) =>
        permanentlyPressedKeys.has(variation)
      );
    }

    return false;
  };
  const navigate = useNavigate();

  const getWideKeyStyle = (key: string, width: string, extraClass = "") => {
    const isPressed = isKeyPressed(key);
    const isRecent = isRecentlyPressed(key);
    const isPermanent = isPermanentlyPressed(key);

    const baseStyle = `${width} h-12 rounded-md font-medium text-xs flex items-center justify-center cursor-pointer transition-all duration-150 key-hover flex-shrink-0 mechanical-key ${extraClass}`;

    if (isPermanent) {
      return `${baseStyle} bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-400 key-3d`;
    }

    if (isPressed) {
      return `${baseStyle} bg-gradient-to-r from-green-500 to-blue-500 text-white border-green-400 key-3d`;
    }

    if (isRecent) {
      return `${baseStyle} recently-pressed key-3d`;
    }

    return isDarkMode
      ? `${baseStyle} bg-gradient-to-br from-gray-700 to-gray-800 text-gray-200 hover:from-gray-600 hover:to-gray-700 key-3d-dark mechanical-key-dark`
      : `${baseStyle} bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 key-3d`;
  };

  return (
    <>
      <TopAppBar title="Keyboard Tester" onBack={() => navigate(-1)} />
      <div>
        <style dangerouslySetInnerHTML={{ __html: pressedKeyStyles }} />

        <div className="container mx-auto px-4 py-4">
          {/* Compact Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="inline-block p-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-2">
              <Keyboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Keyboard Tester
            </h1>
          </motion.div>

          {/* Compact Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-2 mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg text-sm ${
                isDarkMode
                  ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
                  : "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white"
              }`}
            >
              <Zap className="w-4 h-4" />
              {isDarkMode ? "Light" : "Dark"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearStats}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white transition-all duration-300 shadow-lg text-sm"
            >
              <Activity className="w-4 h-4" />
              Clear All
            </motion.button>
          </motion.div>

          {/* Keyboard Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="text-center mb-6">
              {/* Enhanced Stats Display */}
              <div className="flex justify-center mb-4">
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-2 bg-black/20 rounded-full px-3 py-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>{permanentlyPressedKeys.size} permanent</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/20 rounded-full px-3 py-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>{totalPresses} presses</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div
                className={`p-8 rounded-2xl shadow-2xl max-w-full overflow-x-auto keyboard-glow ${
                  isDarkMode ? "keyboard-container-dark" : "keyboard-container"
                }`}
              >
                {/* Function Keys Row - Fixed Layout */}
                <div className="flex gap-1 justify-between mb-4">
                  {functionKeys.map((keyData) => (
                    <motion.div
                      key={keyData.key}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={getWideKeyStyle(keyData.key, keyData.width)}
                      data-key={keyData.key}
                    >
                      <span className="text-xs font-semibold">
                        {keyData.display}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Main Keyboard - Fixed Layout */}
                <div className="space-y-1 mb-8">
                  {keyboardLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-1 justify-between">
                      {row.map((keyData) => (
                        <motion.div
                          key={keyData.key}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className={getWideKeyStyle(
                            keyData.key,
                            keyData.width
                          )}
                          data-key={keyData.key}
                        >
                          <span className="text-xs font-semibold">
                            {keyData.display}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Bottom section with navigation keys, arrow keys and numpad - Fixed Layout */}
                <div className="flex gap-8 justify-center items-start">
                  {/* Left side - Navigation and Arrow Keys */}
                  <div className="flex flex-col gap-2 justify-between">
                    {/* Navigation Keys Row 1 */}
                    <div className="flex gap-1">
                      {navigationKeys.slice(0, 3).map((keyData) => (
                        <motion.div
                          key={keyData.key}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className={getWideKeyStyle(
                            keyData.key,
                            keyData.width
                          )}
                          data-key={keyData.key}
                        >
                          <span className="text-xs font-semibold">
                            {keyData.display}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Navigation Keys Row 2 */}
                    <div className="flex gap-1">
                      {navigationKeys.slice(3, 6).map((keyData) => (
                        <motion.div
                          key={keyData.key}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className={getWideKeyStyle(
                            keyData.key,
                            keyData.width
                          )}
                          data-key={keyData.key}
                        >
                          <span className="text-xs font-semibold">
                            {keyData.display}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Arrow Keys in Cross Layout */}
                    <div className="grid grid-cols-3 gap-1 w-[13.5rem]">
                      <div />
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={getWideKeyStyle("ArrowUp", "w-16 h-12")}
                        data-key="ArrowUp"
                      >
                        <span className="text-xs font-semibold">↑</span>
                      </motion.div>
                      <div />

                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={getWideKeyStyle("ArrowLeft", "w-16 h-12")}
                        data-key="ArrowLeft"
                      >
                        <span className="text-xs font-semibold">←</span>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={getWideKeyStyle("ArrowDown", "w-16 h-12")}
                        data-key="ArrowDown"
                      >
                        <span className="text-xs font-semibold">↓</span>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={getWideKeyStyle("ArrowRight", "w-16 h-12")}
                        data-key="ArrowRight"
                      >
                        <span className="text-xs font-semibold">→</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Right side - Numpad */}
                  <div className="grid grid-cols-4 gap-1">
                    {numpadKeys.map((keyData) => (
                      <motion.div
                        key={keyData.key}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={getWideKeyStyle(
                          keyData.key,
                          keyData.width,
                          keyData.extraClass
                        )}
                        data-key={keyData.key}
                      >
                        <span className="text-xs font-semibold">
                          {keyData.display}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
