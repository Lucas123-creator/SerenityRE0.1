import React, { useState, useEffect } from 'react';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'contract_alice.pdf',
    type: 'PDF',
    size: '1.2 MB',
    uploadedAt: '2024-03-08',
  },
  {
    id: '2',
    name: 'property_photo.jpg',
    type: 'Image',
    size: '2.5 MB',
    uploadedAt: '2024-03-07',
  },
];

export default function Files() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use mock data for now
    setFiles(mockFiles);
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-3xl mb-10 text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Files</h1>
        <p className="text-lg text-gray-500 mb-6">Access and manage your important files.</p>
      </div>
      <div className="w-full max-w-2xl card bg-white/70 backdrop-blur-xl border-0 shadow-xl rounded-2xl p-6">
        {loading ? (
          <div className="p-4 text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <div key={file.id} className="card flex justify-between items-center bg-white/80 shadow-none border-0">
                <div>
                  <h2 className="font-semibold text-gray-900">{file.name}</h2>
                  <p className="text-gray-600 text-sm">{file.type} • {file.size}</p>
                </div>
                <span className="text-xs text-gray-400">{file.uploadedAt}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 