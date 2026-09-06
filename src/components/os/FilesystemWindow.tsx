import React, { useState } from 'react';
import { VirtualFS, VFile } from '../../engine/virtualFs';
import { Folder, FileText, Code2, Save, Trash2, Plus, HardDrive, Cpu, RefreshCw, Eye, Check } from 'lucide-react';

export const FilesystemWindow: React.FC = () => {
  const [files, setFiles] = useState<VFile[]>(VirtualFS.listFiles());
  const [selectedFile, setSelectedFile] = useState<VFile | null>(files[0] || null);
  const [fileContent, setFileContent] = useState<string>(files[0]?.content || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newFilePath, setNewFilePath] = useState('/custom/script.py');
  const [filterType, setFilterType] = useState<string>('all');

  const handleSelectFile = (file: VFile) => {
    setSelectedFile(file);
    setFileContent(file.content);
    setIsSaved(false);
  };

  const handleSaveCurrent = () => {
    if (!selectedFile) return;
    const updated = VirtualFS.saveFile(selectedFile.path, fileContent, selectedFile.type);
    setFiles(VirtualFS.listFiles());
    setSelectedFile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDeleteCurrent = () => {
    if (!selectedFile || selectedFile.readOnly) return;
    if (confirm(`Delete file ${selectedFile.path}?`)) {
      VirtualFS.deleteFile(selectedFile.path);
      const updated = VirtualFS.listFiles();
      setFiles(updated);
      setSelectedFile(updated[0] || null);
      setFileContent(updated[0]?.content || '');
    }
  };

  const handleCreateFile = () => {
    if (!newFilePath.trim()) return;
    const path = newFilePath.startsWith('/') ? newFilePath : `/${newFilePath}`;
    const created = VirtualFS.saveFile(path, '# PyMACS New Script\n');
    setFiles(VirtualFS.listFiles());
    setSelectedFile(created);
    setFileContent(created.content);
    setIsCreatingNew(false);
    setNewFilePath('');
  };

  const filteredFiles = filterType === 'all'
    ? files
    : files.filter((f) => f.type === filterType);

  const getFileIcon = (type: VFile['type']) => {
    switch (type) {
      case 'python':
        return <Code2 className="w-3.5 h-3.5 text-[#EAB308]" />;
      case 'json':
        return <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />;
      case 'xml':
      case 'pml':
        return <FileText className="w-3.5 h-3.5 text-[#A78BFA]" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div className="flex h-full bg-[#0E0E11] text-gray-200 font-mono text-xs overflow-hidden">
      {/* Sidebar: File Directory & Filters */}
      <div className="w-64 border-r border-[#26262E] bg-[#131317] flex flex-col shrink-0">
        {/* VFS Header */}
        <div className="p-3 border-b border-[#26262E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="font-semibold text-gray-200">Thread VFS</span>
          </div>
          <button
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            className="p-1 hover:bg-[#202028] text-gray-400 hover:text-white rounded cursor-pointer transition-colors"
            title="Create new file"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Create File Drawer */}
        {isCreatingNew && (
          <div className="p-2.5 bg-[#1B1B22] border-b border-[#26262E] space-y-1.5">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">New File Path</div>
            <input
              type="text"
              value={newFilePath}
              onChange={(e) => setNewFilePath(e.target.value)}
              placeholder="/apps/my_agent.py"
              className="w-full bg-[#111115] border border-[#2D2D35] px-2 py-1 text-xs text-white rounded focus:outline-none focus:border-[#38BDF8]"
            />
            <div className="flex justify-end gap-1.5 pt-1">
              <button
                onClick={() => setIsCreatingNew(false)}
                className="px-2 py-0.5 text-[10px] text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFile}
                className="px-2.5 py-0.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded text-[10px] font-semibold"
              >
                Create
              </button>
            </div>
          </div>
        )}

        {/* Filter Pills */}
        <div className="p-2 border-b border-[#222228] flex flex-wrap gap-1">
          {['all', 'python', 'json', 'xml', 'pml'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-1.5 py-0.5 rounded text-[9.5px] uppercase tracking-wider cursor-pointer ${
                filterType === cat ? 'bg-[#2563EB] text-white' : 'bg-[#1A1A20] text-gray-400 hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
          {filteredFiles.map((f) => (
            <div
              key={f.path}
              onClick={() => handleSelectFile(f)}
              className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors text-[11px] ${
                selectedFile?.path === f.path
                  ? 'bg-[#2563EB]/20 border border-[#2563EB]/40 text-white'
                  : 'hover:bg-[#1C1C22] text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {getFileIcon(f.type)}
                <span className="truncate">{f.name}</span>
              </div>
              <span className="text-[9px] text-gray-500 shrink-0 font-mono">
                {f.threadOwner}
              </span>
            </div>
          ))}
        </div>

        {/* Storage stats */}
        <div className="p-2.5 border-t border-[#222228] text-[10px] text-gray-500 flex items-center justify-between">
          <span>{files.length} VFS Inodes</span>
          <span>Buffer: 128KB</span>
        </div>
      </div>

      {/* Main Area: File Editor / Viewer */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0E0E11]">
        {selectedFile ? (
          <>
            {/* File Sub-header */}
            <div className="bg-[#16161C] border-b border-[#26262E] px-4 py-2 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 truncate">
                {getFileIcon(selectedFile.type)}
                <span className="font-semibold text-gray-200 truncate">{selectedFile.path}</span>
                <span className="text-[10px] bg-[#22222A] text-gray-400 px-1.5 py-0.5 rounded uppercase">
                  {selectedFile.type}
                </span>
                <span className="text-[10px] text-gray-500">
                  owner: <span className="text-gray-400">{selectedFile.threadOwner}</span>
                </span>
                {selectedFile.readOnly && (
                  <span className="text-[9px] text-yellow-500 bg-yellow-500/10 px-1 rounded border border-yellow-500/20">
                    READ-ONLY
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {isSaved && (
                  <span className="flex items-center gap-1 text-[#4ADE80] text-[10px]">
                    <Check className="w-3 h-3" /> Saved
                  </span>
                )}
                <button
                  onClick={handleSaveCurrent}
                  className="flex items-center gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors"
                >
                  <Save className="w-3 h-3" />
                  <span>Save</span>
                </button>
                {!selectedFile.readOnly && (
                  <button
                    onClick={handleDeleteCurrent}
                    className="p-1 hover:bg-[#2A2A32] text-gray-400 hover:text-red-400 rounded cursor-pointer transition-colors"
                    title="Delete file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Code Content Editor */}
            <div className="flex-1 p-3 overflow-hidden flex flex-col">
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                readOnly={selectedFile.readOnly}
                className="w-full h-full bg-[#121216] text-gray-200 border border-[#24242C] rounded p-3 font-mono text-[11px] leading-relaxed resize-none focus:outline-none focus:border-[#38BDF8]"
                spellCheck={false}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-xs">
            Select a file from the VFS tree on the left.
          </div>
        )}
      </div>
    </div>
  );
};
