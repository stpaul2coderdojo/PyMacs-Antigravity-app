import React, { useState } from 'react';
import { MessageSquare, Send, Bell, Mailbox, ArrowDownLeft, ArrowUpRight, Cpu } from 'lucide-react';

interface IPCMessage {
  id: string;
  sender: string;
  channel: 'FreeRTOS_Mailbox' | 'IPC_Bus' | 'OpenRAN_Edge' | 'User_Console';
  text: string;
  timestamp: string;
  priority: 'URGENT' | 'NORMAL' | 'DEBUG';
}

export const MessagesWindow: React.FC = () => {
  const [messages, setMessages] = useState<IPCMessage[]>([
    {
      id: 'msg_1',
      sender: 'sysinit.kthread',
      channel: 'FreeRTOS_Mailbox',
      text: 'Microkernel IPC bus established. Mailbox depth: 256 queue slots.',
      timestamp: '12:00:01',
      priority: 'NORMAL',
    },
    {
      id: 'msg_2',
      sender: 'brother_bsi.agent',
      channel: 'IPC_Bus',
      text: 'Printer MFC-L8900CDW connected on port 8080. Ready for XML-DOM spooling.',
      timestamp: '12:00:04',
      priority: 'NORMAL',
    },
    {
      id: 'msg_3',
      sender: 'pml_verifier.core',
      channel: 'FreeRTOS_Mailbox',
      text: 'Merkle root confirmed: 0x9E4B... PML theorem proven for active DOM schema.',
      timestamp: '12:00:08',
      priority: 'NORMAL',
    },
    {
      id: 'msg_4',
      sender: 'htcondor.scheduler',
      channel: 'OpenRAN_Edge',
      text: 'Shadow node pool affinity synchronized with cell cluster 7.',
      timestamp: '12:00:15',
      priority: 'DEBUG',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [activeChannel, setActiveChannel] = useState<string>('all');

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const newMsg: IPCMessage = {
      id: Math.random().toString(36).substring(2),
      sender: 'operator.terminal',
      channel: 'User_Console',
      text: inputVal.trim(),
      timestamp: new Date().toLocaleTimeString(),
      priority: 'NORMAL',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');
  };

  const filtered = activeChannel === 'all'
    ? messages
    : messages.filter((m) => m.channel === activeChannel);

  return (
    <div className="flex flex-col h-full bg-[#0E0E11] text-gray-200 font-mono text-xs overflow-hidden">
      {/* Messages Header */}
      <div className="p-3 bg-[#16161C] border-b border-[#26262E] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#38BDF8]" />
          <span className="font-semibold text-gray-200">Unified Text Communication &amp; IPC Mailbox</span>
        </div>
        <div className="flex items-center gap-1">
          {['all', 'FreeRTOS_Mailbox', 'IPC_Bus', 'OpenRAN_Edge', 'User_Console'].map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider cursor-pointer ${
                activeChannel === ch ? 'bg-[#2563EB] text-white' : 'bg-[#1D1D24] text-gray-400 hover:text-gray-200'
              }`}
            >
              {ch.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.map((msg) => (
          <div
            key={msg.id}
            className={`p-2.5 rounded border transition-colors ${
              msg.sender.includes('operator')
                ? 'bg-[#2563EB]/15 border-[#2563EB]/30'
                : 'bg-[#141418] border-[#222228]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-200">{msg.sender}</span>
                <span className="text-[9.5px] text-[#38BDF8] bg-[#38BDF8]/10 px-1 py-0.2 rounded border border-[#38BDF8]/20">
                  {msg.channel}
                </span>
              </div>
              <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
            </div>
            <p className="text-gray-300 text-[11px] leading-relaxed pl-1">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Dispatch Input */}
      <div className="p-2.5 bg-[#141419] border-t border-[#26262E] flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Broadcast IPC message to FreeRTOS message queue..."
          className="flex-1 bg-[#101014] text-gray-100 border border-[#2D2D35] px-3 py-1.5 rounded text-xs focus:outline-none focus:border-[#38BDF8]"
        />
        <button
          onClick={handleSend}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Send className="w-3 h-3" />
          <span>Post</span>
        </button>
      </div>
    </div>
  );
};
