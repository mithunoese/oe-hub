'use client';

import { useEffect, useReducer, useRef } from 'react';
import Link from 'next/link';

// ─── Constants ────────────────────────────────────────────────────────────────

const W = 10;
const H = 20;

const SHAPES: number[][][] = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1, 0], [0, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
];

const SCORE_PER_LINES = [0, 100, 300, 500, 800];
const DROP_MS = [800, 717, 633, 550, 467, 383, 300, 217, 133, 100, 83];

// ─── Types ────────────────────────────────────────────────────────────────────

type Cell = 0 | 1 | 2 | 3; // empty | locked | ghost | active
type Board = Cell[][];

interface Piece {
  shape: number[][];
  x: number;
  y: number;
}

interface State {
  board: Board;
  current: Piece | null;
  next: Piece | null;
  score: number;
  level: number;
  lines: number;
  status: 'idle' | 'playing' | 'paused' | 'over';
}

type Action =
  | { type: 'START' }
  | { type: 'TICK' }
  | { type: 'LEFT' }
  | { type: 'RIGHT' }
  | { type: 'DOWN' }
  | { type: 'ROTATE' }
  | { type: 'DROP' }
  | { type: 'TOGGLE_PAUSE' };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const emptyBoard = (): Board =>
  Array.from({ length: H }, () => Array(W).fill(0) as Cell[]);

const newPiece = (): Piece => {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  return { shape, x: Math.floor(W / 2) - Math.floor(shape[0].length / 2), y: 0 };
};

const rotateCW = (shape: number[][]): number[][] =>
  shape[0].map((_, c) => shape.map(row => row[c]).reverse());

const fits = (board: Board, p: Piece): boolean => {
  for (let r = 0; r < p.shape.length; r++)
    for (let c = 0; c < p.shape[r].length; c++) {
      if (!p.shape[r][c]) continue;
      const br = p.y + r, bc = p.x + c;
      if (br < 0 || br >= H || bc < 0 || bc >= W || board[br][bc] === 1) return false;
    }
  return true;
};

const place = (board: Board, p: Piece): Board => {
  const b = board.map(r => [...r] as Cell[]);
  for (let r = 0; r < p.shape.length; r++)
    for (let c = 0; c < p.shape[r].length; c++)
      if (p.shape[r][c]) b[p.y + r][p.x + c] = 1;
  return b;
};

const sweep = (board: Board): { board: Board; cleared: number } => {
  const kept = board.filter(row => row.some(c => c === 0));
  const cleared = H - kept.length;
  const pad = Array.from({ length: cleared }, () => Array(W).fill(0) as Cell[]);
  return { board: [...pad, ...kept], cleared };
};

const ghost = (board: Board, p: Piece): Piece => {
  let g = { ...p };
  while (fits(board, { ...g, y: g.y + 1 })) g = { ...g, y: g.y + 1 };
  return g;
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

const INIT: State = {
  board: emptyBoard(), current: null, next: null,
  score: 0, level: 1, lines: 0, status: 'idle',
};

function spawnNext(s: State, board: Board): State {
  const current = s.next ?? newPiece();
  const next = newPiece();
  if (!fits(board, current)) return { ...s, board, current: null, next, status: 'over' };
  return { ...s, board, current, next };
}

function doLock(s: State, p: Piece): State {
  const locked = place(s.board, p);
  const { board, cleared } = sweep(locked);
  const newLines = s.lines + cleared;
  const newLevel = Math.floor(newLines / 10) + 1;
  const newScore = s.score + SCORE_PER_LINES[Math.min(cleared, 4)] * s.level;
  return spawnNext({ ...s, score: newScore, lines: newLines, level: newLevel }, board);
}

function reducer(s: State, a: Action): State {
  if (a.type === 'START') {
    return { ...INIT, board: emptyBoard(), current: newPiece(), next: newPiece(), status: 'playing' };
  }
  if (a.type === 'TOGGLE_PAUSE') {
    if (s.status === 'playing') return { ...s, status: 'paused' };
    if (s.status === 'paused') return { ...s, status: 'playing' };
    return s;
  }
  if (s.status !== 'playing' || !s.current) return s;

  const { board, current } = s;

  switch (a.type) {
    case 'TICK': {
      const moved = { ...current, y: current.y + 1 };
      return fits(board, moved) ? { ...s, current: moved } : doLock(s, current);
    }
    case 'LEFT': {
      const moved = { ...current, x: current.x - 1 };
      return fits(board, moved) ? { ...s, current: moved } : s;
    }
    case 'RIGHT': {
      const moved = { ...current, x: current.x + 1 };
      return fits(board, moved) ? { ...s, current: moved } : s;
    }
    case 'DOWN': {
      const moved = { ...current, y: current.y + 1 };
      if (fits(board, moved)) return { ...s, current: moved, score: s.score + 1 };
      return doLock(s, current);
    }
    case 'ROTATE': {
      const rot = { ...current, shape: rotateCW(current.shape) };
      if (fits(board, rot)) return { ...s, current: rot };
      for (const dx of [1, -1, 2, -2]) {
        const kicked = { ...rot, x: rot.x + dx };
        if (fits(board, kicked)) return { ...s, current: kicked };
      }
      return s;
    }
    case 'DROP': {
      const g = ghost(board, current);
      return doLock({ ...s, score: s.score + (g.y - current.y) * 2 }, g);
    }
    default:
      return s;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TetrisPage() {
  const [state, dispatch] = useReducer(reducer, INIT);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Gravity
  useEffect(() => {
    if (state.status !== 'playing') return;
    const ms = DROP_MS[Math.min(state.level - 1, DROP_MS.length - 1)];
    const id = setInterval(() => {
      if (stateRef.current.status === 'playing') dispatch({ type: 'TICK' });
    }, ms);
    return () => clearInterval(id);
  }, [state.status, state.level]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { status } = stateRef.current;
      if (e.key === 'p' || e.key === 'P') { dispatch({ type: 'TOGGLE_PAUSE' }); return; }
      if (status !== 'playing') return;
      const map: Record<string, Action['type']> = {
        ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        ArrowDown: 'DOWN', ArrowUp: 'ROTATE', ' ': 'DROP',
      };
      const t = map[e.key];
      if (!t) return;
      e.preventDefault();
      dispatch({ type: t } as Action);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Build render board
  const display: Cell[][] = state.board.map(r => [...r] as Cell[]);
  if (state.current) {
    const g = ghost(state.board, state.current);
    for (let r = 0; r < g.shape.length; r++)
      for (let c = 0; c < g.shape[r].length; c++)
        if (g.shape[r][c]) {
          const br = g.y + r, bc = g.x + c;
          if (br >= 0 && br < H && bc >= 0 && bc < W && !display[br][bc]) display[br][bc] = 2;
        }
    for (let r = 0; r < state.current.shape.length; r++)
      for (let c = 0; c < state.current.shape[r].length; c++)
        if (state.current.shape[r][c]) {
          const br = state.current.y + r, bc = state.current.x + c;
          if (br >= 0 && br < H && bc >= 0 && bc < W) display[br][bc] = 3;
        }
  }

  // Next piece in 4×4 grid
  const nextGrid: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0));
  if (state.next) {
    const s = state.next.shape;
    const or = Math.floor((4 - s.length) / 2);
    const oc = Math.floor((4 - s[0].length) / 2);
    for (let r = 0; r < s.length; r++)
      for (let c = 0; c < s[r].length; c++)
        if (s[r][c]) nextGrid[or + r][oc + c] = 1;
  }

  const cellCls = (v: Cell) =>
    v === 1 ? 'bg-white' :
    v === 3 ? 'bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]' :
    v === 2 ? 'bg-white/[0.09]' :
    '';

  const stats = [
    { label: 'Score', value: state.score.toString().padStart(7, '0') },
    { label: 'Level', value: String(state.level) },
    { label: 'Lines', value: String(state.lines) },
  ];

  const isOverlay = state.status !== 'playing';

  return (
    <main className="bg-black flex flex-col items-center justify-center py-8 select-none min-h-[calc(100vh-52px)]">
      {/* Header */}
      <div className="text-center mb-7">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-700 mb-1.5">
          Open Exchange
        </p>
        <h1 className="font-mono text-lg font-bold text-white tracking-[0.3em]">TETRIS</h1>
      </div>

      <div className="flex items-start gap-7">
        {/* Board */}
        <div className="relative border border-neutral-800">
          <div className="grid grid-cols-10">
            {display.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`w-7 h-7 border-b border-r border-neutral-900 ${cellCls(cell)}`}
                />
              ))
            )}
          </div>

          {/* Overlay */}
          {isOverlay && (
            <div className="absolute inset-0 bg-black/92 flex flex-col items-center justify-center gap-5">
              {state.status === 'over' && (
                <div className="text-center space-y-1">
                  <p className="font-mono text-sm text-white tracking-[0.2em] uppercase">Game Over</p>
                  <p className="font-mono text-xs text-neutral-600">{state.score.toString().padStart(7, '0')}</p>
                </div>
              )}
              {state.status === 'paused' && (
                <p className="font-mono text-sm text-white tracking-[0.2em] uppercase">Paused</p>
              )}

              <button
                onClick={() => dispatch({ type: state.status === 'paused' ? 'TOGGLE_PAUSE' : 'START' })}
                className="font-mono text-[11px] tracking-[0.15em] uppercase bg-white text-black px-8 py-2.5 hover:bg-neutral-200 active:bg-neutral-300 transition-colors cursor-pointer"
              >
                {state.status === 'paused' ? 'Resume' : state.status === 'over' ? 'Play Again' : 'Start Game'}
              </button>

              {state.status === 'idle' && (
                <p className="font-mono text-[10px] text-neutral-700 text-center leading-loose tracking-wider">
                  ← → Move &nbsp; ↑ Rotate<br />
                  ↓ Soft drop &nbsp; Space Drop<br />
                  P Pause
                </p>
              )}
            </div>
          )}
        </div>

        {/* Panel */}
        <div className="flex flex-col gap-6 w-[88px] pt-0.5">
          {/* Next */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-neutral-700 mb-2">Next</p>
            <div className="grid grid-cols-4">
              {nextGrid.map((row, r) =>
                row.map((cell, c) => (
                  <div key={`n-${r}-${c}`} className={`w-5 h-5 ${cell ? 'bg-white' : ''}`} />
                ))
              )}
            </div>
          </div>

          {/* Stats */}
          {stats.map(({ label, value }) => (
            <div key={label}>
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-neutral-700 mb-1">{label}</p>
              <p className="font-mono text-sm font-bold text-white tabular-nums">{value}</p>
            </div>
          ))}

          {/* Keys */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-neutral-700 mb-2">Keys</p>
            <div className="space-y-1.5">
              {[['↑', 'Rotate'], ['← →', 'Move'], ['↓', 'Drop+1'], ['Space', 'Drop'], ['P', 'Pause']].map(([k, v]) => (
                <div key={k} className="flex gap-1.5 items-baseline">
                  <span className="font-mono text-[10px] text-neutral-500 shrink-0">{k}</span>
                  <span className="font-mono text-[10px] text-neutral-700">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back */}
      <div className="mt-8">
        <Link
          href="/"
          className="font-mono text-[10px] tracking-[0.18em] uppercase text-neutral-700 hover:text-neutral-400 transition-colors"
        >
          ← Back to Hub
        </Link>
      </div>
    </main>
  );
}
