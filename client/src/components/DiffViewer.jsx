import React from 'react';
import { DiffEditor } from '@monaco-editor/react';

export default function DiffViewer({ original, modified, language = 'javascript', height = '350px' }) {
  return (
    <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shadow-inner">
      <DiffEditor
        height={height}
        language={language.toLowerCase()}
        theme="vs-dark"
        original={original}
        modified={modified}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
          renderSideBySide: true,
        }}
      />
    </div>
  );
}
