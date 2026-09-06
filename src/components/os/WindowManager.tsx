import React, { useState, useRef } from 'react';
import { Minus, Square, X, Maximize2, Minimize2, Move } from 'lucide-react';

export interface WindowState {
  id: string;
  title: string;
  icon?: any;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

interface WindowProps {
  window: WindowState;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onToggleMaximize: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  window: win,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onMove,
  onResize,
  children,
}) => {
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, winX: 0, winY: 0 });
  const isResizing = useRef(false);
  const resizeStart = useRef({ x: 0, y: 0, winW: 0, winH: 0 });

  const handleMouseDownTitle = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    onFocus(win.id);
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      winX: win.x,
      winY: win.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = moveEvent.clientX - dragStart.current.x;
      const dy = moveEvent.clientY - dragStart.current.y;
      onMove(win.id, Math.max(10, dragStart.current.winX + dx), Math.max(10, dragStart.current.winY + dy));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    e.stopPropagation();
    onFocus(win.id);
    isResizing.current = true;
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      winW: win.width,
      winH: win.height,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing.current) return;
      const dw = moveEvent.clientX - resizeStart.current.x;
      const dh = moveEvent.clientY - resizeStart.current.y;
      onResize(win.id, Math.max(340, resizeStart.current.winW + dw), Math.max(220, resizeStart.current.winH + dh));
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (!win.isOpen || win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: win.zIndex,
      }
    : {
        position: 'absolute',
        left: `${win.x}px`,
        top: `${win.y}px`,
        width: `${win.width}px`,
        height: `${win.height}px`,
        zIndex: win.zIndex,
      };

  return (
    <div
      style={style}
      onClick={() => onFocus(win.id)}
      className="bg-[#121217] border border-[#2D2D38] rounded-lg shadow-2xl flex flex-col overflow-hidden font-mono select-none"
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDownTitle}
        className="bg-[#181820] border-b border-[#282834] px-3 py-2 flex items-center justify-between cursor-move select-none"
      >
        <div className="flex items-center gap-2 truncate">
          {win.icon && <win.icon className="w-3.5 h-3.5 text-[#38BDF8]" />}
          <span className="font-semibold text-xs text-gray-200 truncate">{win.title}</span>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-1.5 shrink-0" onMouseDown={(e) => e.stopPropagation()}>
          <button
            onClick={() => onMinimize(win.id)}
            className="w-5 h-5 flex items-center justify-center hover:bg-[#282834] text-gray-400 hover:text-white rounded cursor-pointer transition-colors"
            title="Minimize"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={() => onToggleMaximize(win.id)}
            className="w-5 h-5 flex items-center justify-center hover:bg-[#282834] text-gray-400 hover:text-white rounded cursor-pointer transition-colors"
            title={win.isMaximized ? 'Restore' : 'Maximize'}
          >
            {win.isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
          <button
            onClick={() => onClose(win.id)}
            className="w-5 h-5 flex items-center justify-center hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded cursor-pointer transition-colors"
            title="Close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-hidden relative cursor-default select-text">
        {children}
      </div>

      {/* Resize Handle */}
      {!win.isMaximized && (
        <div
          onMouseDown={handleMouseDownResize}
          className="absolute bottom-0 right-0 w-3.5 h-3.5 cursor-nwse-resize z-50 flex items-center justify-center text-gray-600 hover:text-gray-400"
          title="Resize window"
        >
          <div className="w-1.5 h-1.5 border-r border-b border-gray-500"></div>
        </div>
      )}
    </div>
  );
};
