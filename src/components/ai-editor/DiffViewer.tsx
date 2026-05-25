import type { DiffHunk } from '@/lib/ai-editor/types';
import { joinClasses } from '@/lib/studio-utils';

const lineClass: Record<string, string> = {
  add: 'bg-amtme-lemon/20 text-amtme-black',
  remove: 'bg-amtme-red/10 text-amtme-red',
  context: 'text-semantic-muted',
};

const linePrefix: Record<string, string> = {
  add: '+',
  remove: '-',
  context: ' ',
};

export function DiffViewer({ diff }: { diff: DiffHunk[] }) {
  if (diff.length === 0) {
    return (
      <p className="text-sm text-semantic-muted">
        El diff aparecerá aquí una vez analizada la instrucción.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {diff.map((hunk, hunkIndex) => (
        <div
          key={hunkIndex}
          className="overflow-hidden rounded-2xl border border-semantic-border bg-amtme-navy/5"
        >
          <div className="border-b border-semantic-border bg-amtme-navy px-4 py-2">
            <span className="font-mono text-xs text-amtme-white/80">{hunk.file}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <tbody>
                {hunk.lines.map((line, lineIndex) => (
                  <tr
                    key={lineIndex}
                    className={joinClasses(
                      'font-mono',
                      lineClass[line.type] ?? 'text-semantic-text'
                    )}
                  >
                    <td className="w-6 select-none px-2 py-0.5 text-center opacity-50">
                      {linePrefix[line.type] ?? ' '}
                    </td>
                    <td className="whitespace-pre px-2 py-0.5">{line.content}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
