'use client';
import { useState, type ReactElement } from 'react';

type Language = 'curl' | 'python' | 'javascript' | 'json';

interface CodeTab {
  label: string;
  language: Language;
  code: string;
}

interface CodeBlockProps {
  tabs?: CodeTab[];
  code?: string;
  language?: Language;
  title?: string;
}

const SYNTAX: Record<string, string> = {
  keyword: '#bc13fe',
  string: '#39ff14',
  number: '#ea9e2b',
  comment: '#555',
  property: '#14a3a8',
  method: '#ff6b35',
  punctuation: '#f5f5f0',
  operator: '#ff2d55',
};

function highlightLine(line: string, language: Language): ReactElement[] {
  const elements: ReactElement[] = [];
  let key = 0;

  if (language === 'json') {
    // JSON highlighting
    const parts = line.split(/("(?:[^"\\]|\\.)*")/g);
    for (const part of parts) {
      if (part.startsWith('"') && part.endsWith('"')) {
        // Check if it's a key (followed by colon after trimming)
        const afterQuote = line.substring(line.indexOf(part) + part.length).trimStart();
        if (afterQuote.startsWith(':')) {
          elements.push(<span key={key++} style={{ color: SYNTAX.property }}>{part}</span>);
        } else {
          elements.push(<span key={key++} style={{ color: SYNTAX.string }}>{part}</span>);
        }
      } else if (/\b(true|false|null)\b/.test(part)) {
        const sub = part.split(/\b(true|false|null)\b/g);
        for (const s of sub) {
          if (['true', 'false', 'null'].includes(s)) {
            elements.push(<span key={key++} style={{ color: SYNTAX.keyword }}>{s}</span>);
          } else if (/\d+/.test(s)) {
            const numParts = s.split(/(\d+)/g);
            for (const np of numParts) {
              if (/^\d+$/.test(np)) {
                elements.push(<span key={key++} style={{ color: SYNTAX.number }}>{np}</span>);
              } else {
                elements.push(<span key={key++} style={{ color: SYNTAX.punctuation }}>{np}</span>);
              }
            }
          } else {
            elements.push(<span key={key++} style={{ color: SYNTAX.punctuation }}>{s}</span>);
          }
        }
      } else {
        // Numbers and punctuation
        const sub = part.split(/(\d+\.?\d*)/g);
        for (const s of sub) {
          if (/^\d+\.?\d*$/.test(s)) {
            elements.push(<span key={key++} style={{ color: SYNTAX.number }}>{s}</span>);
          } else {
            elements.push(<span key={key++} style={{ color: SYNTAX.punctuation }}>{s}</span>);
          }
        }
      }
    }
    return elements;
  }

  if (language === 'python') {
    // Comment
    if (line.trimStart().startsWith('#')) {
      return [<span key={0} style={{ color: SYNTAX.comment }}>{line}</span>];
    }
    let remaining = line;
    // Simple token-based highlighting
    const pyTokens = remaining.split(/(""".*?"""|'''.*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:import|from|as|def|class|return|if|elif|else|for|while|in|not|and|or|True|False|None|print|with|try|except|raise|assert|pass|break|continue|lambda|yield|async|await)\b|#.*$|\b\d+\.?\d*\b|[{}()\[\]:,=+\-*/])/gm);
    const pyKeywords = new Set(['import', 'from', 'as', 'def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'not', 'and', 'or', 'True', 'False', 'None', 'print', 'with', 'try', 'except', 'raise', 'assert', 'pass', 'break', 'continue', 'lambda', 'yield', 'async', 'await']);
    for (const token of pyTokens) {
      if (!token) continue;
      if (token.startsWith('#')) {
        elements.push(<span key={key++} style={{ color: SYNTAX.comment }}>{token}</span>);
      } else if (pyKeywords.has(token)) {
        elements.push(<span key={key++} style={{ color: SYNTAX.keyword }}>{token}</span>);
      } else if (token.startsWith('"') || token.startsWith("'")) {
        elements.push(<span key={key++} style={{ color: SYNTAX.string }}>{token}</span>);
      } else if (/^\d+\.?\d*$/.test(token)) {
        elements.push(<span key={key++} style={{ color: SYNTAX.number }}>{token}</span>);
      } else if (/^[{}()\[\]:,=+\-*/]$/.test(token)) {
        elements.push(<span key={key++} style={{ color: SYNTAX.punctuation }}>{token}</span>);
      } else {
        // Check for method calls like .get( , .post(
        const methodParts = token.split(/(\.\w+\()/g);
        for (const mp of methodParts) {
          if (/^\.\w+\($/.test(mp)) {
            elements.push(<span key={key++} style={{ color: SYNTAX.method }}>{mp}</span>);
          } else {
            elements.push(<span key={key++} style={{ color: '#f5f5f0' }}>{mp}</span>);
          }
        }
      }
    }
    return elements;
  }

  if (language === 'javascript') {
    if (line.trimStart().startsWith('//')) {
      return [<span key={0} style={{ color: SYNTAX.comment }}>{line}</span>];
    }
    const jsKeywords = new Set(['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'async', 'await', 'new', 'class', 'export', 'import', 'from', 'try', 'catch', 'throw', 'typeof', 'instanceof', 'true', 'false', 'null', 'undefined', 'console']);
    const jsTokens = line.split(/(`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:const|let|var|function|return|if|else|for|while|async|await|new|class|export|import|from|try|catch|throw|typeof|instanceof|true|false|null|undefined|console)\b|\/\/.*$|\b\d+\.?\d*\b|[{}()\[\]:;,=+\-*/.!?<>&|])/gm);
    for (const token of jsTokens) {
      if (!token) continue;
      if (token.startsWith('//')) {
        elements.push(<span key={key++} style={{ color: SYNTAX.comment }}>{token}</span>);
      } else if (jsKeywords.has(token)) {
        elements.push(<span key={key++} style={{ color: SYNTAX.keyword }}>{token}</span>);
      } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
        elements.push(<span key={key++} style={{ color: SYNTAX.string }}>{token}</span>);
      } else if (/^\d+\.?\d*$/.test(token)) {
        elements.push(<span key={key++} style={{ color: SYNTAX.number }}>{token}</span>);
      } else {
        elements.push(<span key={key++} style={{ color: '#f5f5f0' }}>{token}</span>);
      }
    }
    return elements;
  }

  // curl / default
  if (line.trimStart().startsWith('#')) {
    return [<span key={0} style={{ color: SYNTAX.comment }}>{line}</span>];
  }
  const curlTokens = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\bcurl\b|-[A-Za-z]+|https?:\/\/\S+|\\|\{[^}]*\})/g);
  for (const token of curlTokens) {
    if (!token) continue;
    if (token === 'curl') {
      elements.push(<span key={key++} style={{ color: SYNTAX.string }}>{token}</span>);
    } else if (token.startsWith('-')) {
      elements.push(<span key={key++} style={{ color: SYNTAX.keyword }}>{token}</span>);
    } else if (token.startsWith('http')) {
      elements.push(<span key={key++} style={{ color: SYNTAX.method }}>{token}</span>);
    } else if (token.startsWith('"') || token.startsWith("'")) {
      elements.push(<span key={key++} style={{ color: SYNTAX.string }}>{token}</span>);
    } else if (token === '\\') {
      elements.push(<span key={key++} style={{ color: SYNTAX.punctuation }}>{token}</span>);
    } else {
      elements.push(<span key={key++} style={{ color: '#f5f5f0' }}>{token}</span>);
    }
  }
  return elements;
}

export default function CodeBlock({ tabs, code, language = 'curl', title }: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const isTabs = tabs && tabs.length > 0;
  const activeCode = isTabs ? tabs[activeTab].code : (code || '');
  const activeLanguage = isTabs ? tabs[activeTab].language : language;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = activeCode.split('\n');

  return (
    <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1rem' }}>
      {/* Header bar with tabs or title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0d1b2a',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 0.5rem',
        minHeight: '36px',
      }}>
        <div style={{ display: 'flex', gap: '0' }}>
          {isTabs ? tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              style={{
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontFamily: 'Bangers, cursive',
                letterSpacing: '0.05em',
                background: i === activeTab ? '#16213e' : 'transparent',
                color: i === activeTab ? '#39ff14' : 'rgba(245,245,240,0.4)',
                border: 'none',
                borderBottom: i === activeTab ? '2px solid #39ff14' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          )) : title ? (
            <span style={{
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontFamily: 'Bangers, cursive',
              letterSpacing: '0.05em',
              color: 'rgba(245,245,240,0.5)',
            }}>
              {title}
            </span>
          ) : null}
        </div>
        <button
          onClick={handleCopy}
          style={{
            padding: '4px 10px',
            fontSize: '0.7rem',
            fontFamily: 'Space Grotesk, sans-serif',
            background: copied ? 'rgba(57,255,20,0.15)' : 'rgba(255,255,255,0.05)',
            color: copied ? '#39ff14' : 'rgba(245,245,240,0.4)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '3px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code content */}
      <div style={{
        backgroundColor: '#16213e',
        padding: '1rem 1.25rem',
        overflowX: 'auto',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.8rem',
        lineHeight: '1.7',
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'pre' }}>
            {line === '' ? '\u00A0' : highlightLine(line, activeLanguage)}
          </div>
        ))}
      </div>
    </div>
  );
}
