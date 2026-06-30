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
const DAS_DELAY = 167; // ms before auto-repeat kicks in
const DAS_RATE  = 33;  // ms between repeats (~30 Hz)

// ─── Types ────────────────────────────────────────────────────────────────────

// 0=empty  1=locked  2=ghost  3=active
type Cell  = 0 | 1 | 2 | 3;
type Board = Cell[][];

interface Piece { shape: number[][]; x: number; y: number }

interface State {
  board:  Board;
  current: Piece | null;
  next:    Piece | null;
  score:   number;
  level:   number;
  lines:   number;
  status:  'idle' | 'playing' | 'paused' | 'over';
}

type Action =
  | { type: 'START' }
  | { type: 'TICK'  }
  | { type: 'LEFT'  }
  | { type: 'RIGHT' }
  | { type: 'DOWN'  }
  | { type: 'ROTATE'}
  | { type: 'DROP'  }
  | { type: 'TOGGLE_PAUSE' };

// ─── Pure helpers ─────────────────────────────────────────────────────────────

const emptyBoard = (): Board =>
  Array.from({ length: H }, () => Array(W).fill(0) as Cell[]);

const randomPiece = (): Piece => {
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

const placePiece = (board: Board, p: Piece): Board => {
  const b = board.map(r => [...r] as Cell[]);
  for (let r = 0; r < p.shape.length; r++)
    for (let c = 0; c < p.shape[r].length; c++)
      if (p.shape[r][c]) b[p.y + r][p.x + c] = 1;
  return b;
};

const sweepLines = (board: Board): { board: Board; cleared: number } => {
  const kept    = board.filter(row => row.some(c => c === 0));
  const cleared = H - kept.length;
  const pad     = Array.from({ length: cleared }, () => Array(W).fill(0) as Cell[]);
  return { board: [...pad, ...kept], cleared };
};

const ghostOf = (board: Board, p: Piece): Piece => {
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
  const current = s.next ?? randomPiece();
  const next    = randomPiece();
  if (!fits(board, current)) return { ...s, board, current: null, next, status: 'over' };
  return { ...s, board, current, next };
}

function doLock(s: State, p: Piece): State {
  const locked              = placePiece(s.board, p);
  const { board, cleared }  = sweepLines(locked);
  const newLines            = s.lines + cleared;
  const newLevel            = Math.floor(newLines / 10) + 1;
  const newScore            = s.score + SCORE_PER_LINES[Math.min(cleared, 4)] * s.level;
  return spawnNext({ ...s, score: newScore, lines: newLines, level: newLevel }, board);
}

function reducer(s: State, a: Action): State {
  if (a.type === 'START') {
    return { ...INIT, board: emptyBoard(), current: randomPiece(), next: randomPiece(), status: 'playing' };
  }
  if (a.type === 'TOGGLE_PAUSE') {
    if (s.status === 'playing') return { ...s, status: 'paused' };
    if (s.status === 'paused')  return { ...s, status: 'playing' };
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
      const g = ghostOf(board, current);
      return doLock({ ...s, score: s.score + (g.y - current.y) * 2 }, g);
    }
    default: return s;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TetrisPage() {
  const [state, dispatch] = useReducer(reducer, INIT);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Gravity interval — restarts when level changes for new speed
  useEffect(() => {
    if (state.status !== 'playing') return;
    const ms = DROP_MS[Math.min(state.level - 1, DROP_MS.length - 1)];
    const id = setInterval(() => {
      if (stateRef.current.status === 'playing') dispatch({ type: 'TICK' });
    }, ms);
    return () => clearInterval(id);
  }, [state.status, state.level]);

  // Keyboard + DAS (Delayed Auto Shift for held arrow keys)
  useEffect(() => {
    const das = { timer: null as ReturnType<typeof setTimeout> | null, interval: null as ReturnType<typeof setInterval> | null };

    const stopDAS = () => {
      if (das.timer)    clearTimeout(das.timer);
      if (das.interval) clearInterval(das.interval);
      das.timer = das.interval = null;
    };

    const startDAS = (actionType: 'LEFT' | 'RIGHT' | 'DOWN') => {
      stopDAS();
      das.timer = setTimeout(() => {
        das.interval = setInterval(() => {
          if (stateRef.current.status === 'playing')
            dispatch({ type: actionType });
        }, DAS_RATE);
      }, DAS_DELAY);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const status = stateRef.current.status;

      if (e.key === 'p' || e.key === 'P') {
        dispatch({ type: 'TOGGLE_PAUSE' });
        return;
      }

      if (status !== 'playing') return;

      if (['ArrowLeft','ArrowRight','ArrowDown','ArrowUp',' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowLeft':  dispatch({ type: 'LEFT' });   startDAS('LEFT');  break;
        case 'ArrowRight': dispatch({ type: 'RIGHT' });  startDAS('RIGHT'); break;
        case 'ArrowDown':  dispatch({ type: 'DOWN' });   startDAS('DOWN');  break;
        case 'ArrowUp':    dispatch({ type: 'ROTATE' });                    break;
        case ' ':          dispatch({ type: 'DROP' });                      break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft','ArrowRight','ArrowDown'].includes(e.key)) stopDAS();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup',   onKeyUp);
      stopDAS();
    };
  }, []); // stable — reads status via stateRef

  // ─── Build render board ──────────────────────────────────────────────────────

  const display: Cell[][] = state.board.map(r => [...r] as Cell[]);
  if (state.current) {
    const g = ghostOf(state.board, state.current);
    for (let r = 0; r < g.shape.length; r++)
      for (let c = 0; c < g.shape[r].length; c++)
        if (g.shape[r][c]) {
          const br = g.y + r, bc = g.x + c;
          if (br >= 0 && br < H && bc >= 0 && bc < W && !display[br][bc])
            display[br][bc] = 2;
        }
    for (let r = 0; r < state.current.shape.length; r++)
      for (let c = 0; c < state.current.shape[r].length; c++)
        if (state.current.shape[r][c]) {
          const br = state.current.y + r, bc = state.current.x + c;
          if (br >= 0 && br < H && bc >= 0 && bc < W)
            display[br][bc] = 3;
        }
  }

  // Next-piece preview in centred 4×4 grid
  const nextGrid: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0));
  if (state.next) {
    const sh = state.next.shape;
    const or = Math.floor((4 - sh.length)    / 2);
    const oc = Math.floor((4 - sh[0].length) / 2);
    for (let r = 0; r < sh.length; r++)
      for (let c = 0; c < sh[r].length; c++)
        if (sh[r][c]) nextGrid[or + r][oc + c] = 1;
  }

  // Cell colours — empty cells are VISIBLE dark gray, not black
  const cellCls = (v: Cell) => {
    if (v === 1 || v === 3) return 'bg-white';   // locked / active
    if (v === 2)            return 'bg-zinc-500'; // ghost — clearly visible
    return                         'bg-zinc-800'; // empty  — visible dark grid
  };

  const isOverlay = state.status !== 'playing';

  return (
    <main className="bg-zinc-950 flex flex-col items-center justify-center py-8 select-none min-h-[calc(100vh-52px)]">

      {/* Header */}
      <div className="text-center mb-7">
        <p className="font-mono text-xs tracking-[0.22em] uppercase text-zinc-600 mb-1">Open Exchange</p>
        <h1 className="font-mono text-2xl font-bold text-white tracking-[0.3em]">TETRIS</h1>
      </div>

      <div className="flex items-start gap-8">

        {/* ── Board ─────────────────────────────────────────────────────────── */}
        <div className="relative">
          {/* 1 px zinc-700 gaps between cells act as the grid lines */}
          <div className="grid grid-cols-10 gap-px bg-zinc-700 border-2 border-zinc-700">
            {display.map((row, r) =>
              row.map((cell, c) => (
                <div key={`${r}-${c}`} className={`w-8 h-8 ${cellCls(cell)}`} />
              ))
            )}
          </div>

          {/* Overlay for idle / paused / game-over */}
          {isOverlay && (
            <div className="absolute inset-0 bg-zinc-950/92 flex flex-col items-center justify-center gap-6">
              {state.status === 'over' && (
                <div className="text-center">
                  <p className="font-mono text-2xl font-bold text-white tracking-widest mb-2">GAME OVER</p>
                  <p className="font-mono text-base text-zinc-500 tabular-nums">
                    {state.score.toString().padStart(7, '0')}
                  </p>
                </div>
              )}
              {state.status === 'paused' && (
                <p className="font-mono text-2xl font-bold text-white tracking-widest">PAUSED</p>
              )}

              <button
                onClick={() => dispatch({ type: state.status === 'paused' ? 'TOGGLE_PAUSE' : 'START' })}
                className="font-mono font-bold text-sm tracking-[0.15em] uppercase bg-white text-black px-10 py-3.5 hover:bg-zinc-100 active:scale-95 transition-all cursor-pointer"
              >
                {state.status === 'paused' ? 'Resume' : state.status === 'over' ? 'Play Again' : 'Start Game'}
              </button>

              {state.status === 'idle' && (
                <div className="font-mono text-sm text-zinc-600 text-center leading-8 tracking-wide">
                  <div><span className="text-zinc-400">← →</span> Move &nbsp;&nbsp; <span className="text-zinc-400">↑</span> Rotate</div>
                  <div><span className="text-zinc-400">↓</span> Soft drop &nbsp;&nbsp; <span className="text-zinc-400">Space</span> Hard drop</div>
                  <div><span className="text-zinc-400">P</span> Pause &nbsp;&nbsp; Hold arrows for DAS</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Side panel ────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-7 w-36 pt-0.5">

          {/* Next piece */}
          <div>
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-zinc-500 mb-3">Next</p>
            <div className="grid grid-cols-4 gap-px bg-zinc-700 border border-zinc-700 p-0">
              {nextGrid.map((row, r) =>
                row.map((cell, c) => (
                  <div
                    key={`n-${r}-${c}`}
                    className={`w-6 h-6 ${cell ? 'bg-white' : 'bg-zinc-800'}`}
                  />
                ))
              )}
            </div>
          </div>

          {/* Stats */}
          {[
            { label: 'Score', value: state.score.toString().padStart(7, '0') },
            { label: 'Level', value: String(state.level) },
            { label: 'Lines', value: String(state.lines) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-mono text-xs tracking-[0.18em] uppercase text-zinc-500 mb-1.5">{label}</p>
              <p className="font-mono text-2xl font-bold text-white tabular-nums">{value}</p>
            </div>
          ))}

          {/* Controls */}
          <div>
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-zinc-500 mb-3">Keys</p>
            <div className="space-y-2.5">
              {[
                ['↑',     'Rotate'],
                ['← →',   'Move'],
                ['↓',     'Soft drop'],
                ['Space', 'Hard drop'],
                ['P',     'Pause'],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2 items-baseline">
                  <span className="font-mono text-xs text-zinc-300 shrink-0 w-10">{k}</span>
                  <span className="font-mono text-xs text-zinc-600">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="mt-9">
        <Link
          href="/"
          className="font-mono text-xs tracking-[0.18em] uppercase text-zinc-700 hover:text-zinc-400 transition-colors"
        >
          ← OE Hub
        </Link>
      </div>
    </main>
  );
}
