import React from 'react';
import Editor from '@monaco-editor/react';

export default function MonacoEditor({ value, onChange, language = 'javascript', height = '350px', readOnly = false }) {
  return (
    <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shadow-inner">
      <Editor
        height={height}
        language={language.toLowerCase()}
        theme="vs-dark"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
