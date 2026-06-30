'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import Link from 'next/link';

// ─── Constants ────────────────────────────────────────────────────────────────

const W = 10;
const H = 20;
const SHAPES: number[][][] = [
  [[1,1,1,1]],
  [[1,1],[1,1]],
  [[0,1,0],[1,1,1]],
  [[0,1,1],[1,1,0]],
  [[1,1,0],[0,1,1]],
  [[1,0,0],[1,1,1]],
  [[0,0,1],[1,1,1]],
];
const SCORE_PER_LINES = [0, 100, 300, 500, 800];
const DROP_MS         = [800, 717, 633, 550, 467, 383, 300, 217, 133, 100, 83];
const DAS_DELAY       = 167;
const DAS_RATE        = 33;
const BONUS_INTERVAL  = 1000; // every 1 000 points → bonus clear
const BONUS_ROWS      = 5;    // rows removed from bottom
const BONUS_POINTS    = 300;

// ─── Types ────────────────────────────────────────────────────────────────────

type Cell  = 0 | 1 | 2 | 3;   // empty | locked | ghost | active
type Board = Cell[][];

interface Piece { shape: number[][]; x: number; y: number }

interface State {
  board:         Board;
  current:       Piece | null;
  next:          Piece | null;
  score:         number;
  level:         number;
  lines:         number;
  status:        'idle' | 'playing' | 'paused' | 'over';
  nextBonus:     number;      // score threshold for next bonus
  bonusTriggers: number;      // counter — component watches this to show flash
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

interface Score {
  initials: string;
  score:    number;
  level:    number;
  lines:    number;
  date:     string;
}

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

// Remove bottom BONUS_ROWS filled rows — the reward for reaching a milestone
const applyBonusClear = (board: Board): Board => {
  const b = board.map(r => [...r] as Cell[]);
  let cleared = 0;
  for (let r = H - 1; r >= 0 && cleared < BONUS_ROWS; r--) {
    if (b[r].some(c => c !== 0)) { b[r] = Array(W).fill(0) as Cell[]; cleared++; }
  }
  const filled = b.filter(row => row.some(c => c !== 0));
  const empty  = Array.from({ length: H - filled.length }, () => Array(W).fill(0) as Cell[]);
  return [...empty, ...filled];
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

const INIT: State = {
  board: emptyBoard(), current: null, next: null,
  score: 0, level: 1, lines: 0, status: 'idle',
  nextBonus: BONUS_INTERVAL, bonusTriggers: 0,
};

function spawnNext(s: State, board: Board): State {
  const current = s.next ?? randomPiece();
  const next    = randomPiece();
  if (!fits(board, current)) return { ...s, board, current: null, next, status: 'over' };
  return { ...s, board, current, next };
}

function doLock(s: State, p: Piece): State {
  const locked              = placePiece(s.board, p);
  const { board: swept, cleared } = sweepLines(locked);
  const newLines            = s.lines + cleared;
  const newLevel            = Math.floor(newLines / 10) + 1;
  let newScore              = s.score + SCORE_PER_LINES[Math.min(cleared, 4)] * s.level;
  let newBoard              = swept;
  let nextBonus             = s.nextBonus;
  let bonusTriggers         = s.bonusTriggers;

  // Bonus clear milestone(s)
  while (newScore >= nextBonus) {
    newBoard = applyBonusClear(newBoard);
    newScore += BONUS_POINTS;
    nextBonus += BONUS_INTERVAL;
    bonusTriggers++;
  }

  return spawnNext(
    { ...s, score: newScore, lines: newLines, level: newLevel, nextBonus, bonusTriggers },
    newBoard,
  );
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
    case 'TICK':   { const m = { ...current, y: current.y + 1 };       return fits(board, m) ? { ...s, current: m } : doLock(s, current); }
    case 'LEFT':   { const m = { ...current, x: current.x - 1 };       return fits(board, m) ? { ...s, current: m } : s; }
    case 'RIGHT':  { const m = { ...current, x: current.x + 1 };       return fits(board, m) ? { ...s, current: m } : s; }
    case 'DOWN':   { const m = { ...current, y: current.y + 1 };       if (fits(board, m)) return { ...s, current: m, score: s.score + 1 }; return doLock(s, current); }
    case 'ROTATE': {
      const rot = { ...current, shape: rotateCW(current.shape) };
      if (fits(board, rot)) return { ...s, current: rot };
      for (const dx of [1, -1, 2, -2]) { const k = { ...rot, x: rot.x + dx }; if (fits(board, k)) return { ...s, current: k }; }
      return s;
    }
    case 'DROP': { const g = ghostOf(board, current); return doLock({ ...s, score: s.score + (g.y - current.y) * 2 }, g); }
    default: return s;
  }
}

// ─── Leaderboard helpers ──────────────────────────────────────────────────────

const LS_KEY = 'oe-tetris-scores';

const loadScores = (): Score[] => {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
};

const saveScore = (scores: Score[], entry: Score): Score[] => {
  const updated = [...scores, entry].sort((a, b) => b.score - a.score).slice(0, 10);
  localStorage.setItem(LS_KEY, JSON.stringify(updated));
  return updated;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function TetrisPage() {
  const [state, dispatch]       = useReducer(reducer, INIT);
  const stateRef                = useRef(state);
  stateRef.current              = state;

  // Leaderboard state
  const [scores, setScores]     = useState<Score[]>([]);
  const [initials, setInitials] = useState('');
  const [enteringScore, setEnteringScore] = useState(false);

  // Bonus flash overlay
  const [bonusMsg, setBonusMsg] = useState('');
  const prevBonusTriggers       = useRef(0);

  // Load scores once on mount
  useEffect(() => { setScores(loadScores()); }, []);

  // Gravity
  useEffect(() => {
    if (state.status !== 'playing') return;
    const ms = DROP_MS[Math.min(state.level - 1, DROP_MS.length - 1)];
    const id = setInterval(() => {
      if (stateRef.current.status === 'playing') dispatch({ type: 'TICK' });
    }, ms);
    return () => clearInterval(id);
  }, [state.status, state.level]);

  // Bonus flash detection
  useEffect(() => {
    if (state.bonusTriggers > prevBonusTriggers.current) {
      prevBonusTriggers.current = state.bonusTriggers;
      setBonusMsg(`BONUS CLEAR  +${BONUS_POINTS}`);
      const t = setTimeout(() => setBonusMsg(''), 1800);
      return () => clearTimeout(t);
    }
  }, [state.bonusTriggers]);

  // Game over — check for high score
  useEffect(() => {
    if (state.status !== 'over' || state.score === 0) return;
    const loaded = loadScores();
    const qualifies = loaded.length < 10 || state.score > (loaded[loaded.length - 1]?.score ?? 0);
    setEnteringScore(qualifies);
    setInitials('');
  }, [state.status, state.score]);

  // Keyboard + DAS
  useEffect(() => {
    const das = { timer: null as ReturnType<typeof setTimeout>|null, interval: null as ReturnType<typeof setInterval>|null };
    const stopDAS = () => { if (das.timer) clearTimeout(das.timer); if (das.interval) clearInterval(das.interval); das.timer = das.interval = null; };
    const startDAS = (t: 'LEFT'|'RIGHT'|'DOWN') => {
      stopDAS();
      das.timer = setTimeout(() => {
        das.interval = setInterval(() => { if (stateRef.current.status === 'playing') dispatch({ type: t }); }, DAS_RATE);
      }, DAS_DELAY);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const st = stateRef.current.status;
      if (e.key === 'p' || e.key === 'P') { dispatch({ type: 'TOGGLE_PAUSE' }); return; }
      if (st !== 'playing') return;
      if (['ArrowLeft','ArrowRight','ArrowDown','ArrowUp',' '].includes(e.key)) e.preventDefault();
      switch (e.key) {
        case 'ArrowLeft':  dispatch({ type: 'LEFT'   }); startDAS('LEFT');  break;
        case 'ArrowRight': dispatch({ type: 'RIGHT'  }); startDAS('RIGHT'); break;
        case 'ArrowDown':  dispatch({ type: 'DOWN'   }); startDAS('DOWN');  break;
        case 'ArrowUp':    dispatch({ type: 'ROTATE' });                    break;
        case ' ':          dispatch({ type: 'DROP'   });                    break;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => { if (['ArrowLeft','ArrowRight','ArrowDown'].includes(e.key)) stopDAS(); };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); stopDAS(); };
  }, []);

  const submitScore = () => {
    const entry: Score = {
      initials: (initials.trim().toUpperCase() || 'AAA').slice(0, 3),
      score: state.score,
      level: state.level,
      lines: state.lines,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    setScores(prev => saveScore(prev, entry));
    setEnteringScore(false);
  };

  // Build render board
  const display: Cell[][] = state.board.map(r => [...r] as Cell[]);
  if (state.current) {
    const g = ghostOf(state.board, state.current);
    for (let r = 0; r < g.shape.length; r++)
      for (let c = 0; c < g.shape[r].length; c++)
        if (g.shape[r][c]) { const br=g.y+r, bc=g.x+c; if (br>=0&&br<H&&bc>=0&&bc<W&&!display[br][bc]) display[br][bc]=2; }
    for (let r = 0; r < state.current.shape.length; r++)
      for (let c = 0; c < state.current.shape[r].length; c++)
        if (state.current.shape[r][c]) { const br=state.current.y+r, bc=state.current.x+c; if (br>=0&&br<H&&bc>=0&&bc<W) display[br][bc]=3; }
  }

  // Next-piece preview in 4×4
  const nextGrid: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0));
  if (state.next) {
    const sh=state.next.shape, or=Math.floor((4-sh.length)/2), oc=Math.floor((4-sh[0].length)/2);
    for (let r=0;r<sh.length;r++) for (let c=0;c<sh[r].length;c++) if (sh[r][c]) nextGrid[or+r][oc+c]=1;
  }

  // HIGH-CONTRAST cell classes: empty = visible gray, active/locked = white, ghost = mid-gray
  const cellCls = (v: Cell) =>
    (v===1||v===3) ? 'bg-white' :
    v===2          ? 'bg-neutral-500' :
                     'bg-neutral-700';      // empty cells — clearly visible

  const isOverlay = state.status !== 'playing';
  const nextMilestone = state.nextBonus;

  return (
    <main className="bg-black flex flex-col items-center justify-center py-8 select-none min-h-[calc(100vh-52px)]">

      {/* Header */}
      <div className="text-center mb-6">
        <p className="font-mono text-xs tracking-[0.22em] uppercase text-neutral-600 mb-1">Open Exchange</p>
        <h1 className="font-mono text-2xl font-bold text-white tracking-[0.3em]">TETRIS</h1>
      </div>

      <div className="flex items-start gap-8">

        {/* ── Board ─────────────────────────────────────────────────────────── */}
        <div className="relative">
          {/* gap-px + bg-black = 1px black dividers between cells; border-2 border-white = clear board outline */}
          <div className="grid grid-cols-10 gap-px bg-black border-2 border-white">
            {display.map((row, r) =>
              row.map((cell, c) => (
                <div key={`${r}-${c}`} className={`w-8 h-8 ${cellCls(cell)}`} />
              ))
            )}
          </div>

          {/* Bonus flash banner */}
          {bonusMsg && (
            <div className="absolute inset-x-0 top-1/3 flex items-center justify-center pointer-events-none">
              <div className="bg-white text-black font-mono font-bold text-base tracking-widest px-6 py-3 uppercase">
                {bonusMsg}
              </div>
            </div>
          )}

          {/* Idle / paused / game-over overlay */}
          {isOverlay && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-4 overflow-y-auto py-6">

              {state.status === 'over' && (
                <>
                  <div className="text-center mb-1">
                    <p className="font-mono text-2xl font-bold text-white tracking-widest">GAME OVER</p>
                    <p className="font-mono text-sm text-neutral-400 mt-1">
                      {state.score.toString().padStart(7,'0')} &nbsp;·&nbsp; Lv {state.level} &nbsp;·&nbsp; {state.lines} lines
                    </p>
                  </div>

                  {/* High-score entry */}
                  {enteringScore && (
                    <div className="text-center">
                      <p className="font-mono text-xs tracking-widest uppercase text-yellow-400 mb-2">New High Score!</p>
                      <div className="flex gap-2 items-center justify-center">
                        <input
                          autoFocus
                          maxLength={3}
                          value={initials}
                          onChange={e => setInitials(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                          onKeyDown={e => { if (e.key === 'Enter') submitScore(); e.stopPropagation(); }}
                          placeholder="AAA"
                          className="bg-transparent border-b-2 border-white text-white font-mono text-xl font-bold w-16 text-center uppercase outline-none placeholder-neutral-700 tracking-[0.3em]"
                        />
                        <button
                          onClick={submitScore}
                          className="font-mono text-xs tracking-widest uppercase bg-white text-black px-4 py-1.5 hover:bg-neutral-200 cursor-pointer font-bold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Leaderboard */}
                  {scores.length > 0 && (
                    <div className="w-full max-w-[200px]">
                      <p className="font-mono text-[10px] tracking-widest uppercase text-neutral-600 mb-2 text-center">High Scores</p>
                      <div className="space-y-1">
                        {scores.slice(0,7).map((s, i) => (
                          <div key={i} className={`flex items-center gap-2 font-mono text-xs ${s.score === state.score && s.initials === (initials || 'AAA') ? 'text-yellow-400' : i === 0 ? 'text-white' : 'text-neutral-500'}`}>
                            <span className="w-4 text-right text-neutral-700">{i+1}</span>
                            <span className="w-8 font-bold tracking-wider">{s.initials}</span>
                            <span className="flex-1 tabular-nums">{s.score.toString().padStart(7,'0')}</span>
                            <span className="text-neutral-700">L{s.level}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {state.status === 'paused' && (
                <p className="font-mono text-2xl font-bold text-white tracking-widest">PAUSED</p>
              )}

              <button
                onClick={() => dispatch({ type: state.status==='paused' ? 'TOGGLE_PAUSE' : 'START' })}
                className="font-mono font-bold text-sm tracking-[0.15em] uppercase bg-white text-black px-10 py-3 hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer mt-1"
              >
                {state.status==='paused' ? 'Resume' : state.status==='over' ? 'Play Again' : 'Start Game'}
              </button>

              {state.status === 'idle' && (
                <div className="font-mono text-sm text-neutral-500 text-center leading-8 tracking-wide mt-1">
                  <div><span className="text-neutral-300">← →</span> Move &nbsp;&nbsp; <span className="text-neutral-300">↑</span> Rotate</div>
                  <div><span className="text-neutral-300">↓</span> Soft drop &nbsp;&nbsp; <span className="text-neutral-300">Space</span> Hard drop</div>
                  <div><span className="text-neutral-300">P</span> Pause &nbsp;&nbsp; Hold arrows to slide</div>
                  <div className="text-xs text-neutral-700 mt-2">Every {BONUS_INTERVAL.toLocaleString()} pts → Bonus: {BONUS_ROWS} rows cleared!</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Side panel ────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 w-36 pt-0.5">

          {/* Next piece */}
          <div>
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-neutral-600 mb-2">Next</p>
            <div className="grid grid-cols-4 gap-px bg-black border border-neutral-800">
              {nextGrid.map((row, r) =>
                row.map((cell, c) => (
                  <div key={`n-${r}-${c}`} className={`w-6 h-6 ${cell ? 'bg-white' : 'bg-neutral-800'}`} />
                ))
              )}
            </div>
          </div>

          {/* Stats */}
          {[
            { label: 'Score', value: state.score.toString().padStart(7,'0') },
            { label: 'Level', value: String(state.level) },
            { label: 'Lines', value: String(state.lines) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-mono text-xs tracking-[0.18em] uppercase text-neutral-600 mb-1">{label}</p>
              <p className="font-mono text-2xl font-bold text-white tabular-nums">{value}</p>
            </div>
          ))}

          {/* Next bonus progress */}
          {state.status === 'playing' && (
            <div>
              <p className="font-mono text-xs tracking-[0.18em] uppercase text-neutral-600 mb-1.5">Bonus in</p>
              <p className="font-mono text-base font-bold text-neutral-400 tabular-nums">
                {Math.max(0, nextMilestone - state.score).toLocaleString()} pts
              </p>
              <div className="mt-1.5 h-1 bg-neutral-800 w-full">
                <div
                  className="h-1 bg-white transition-all duration-300"
                  style={{ width: `${Math.min(100, ((state.score % BONUS_INTERVAL) / BONUS_INTERVAL) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Leaderboard in panel — shown when not playing */}
          {state.status !== 'playing' && scores.length > 0 && (
            <div>
              <p className="font-mono text-xs tracking-[0.18em] uppercase text-neutral-600 mb-2">Best</p>
              <div className="space-y-1.5">
                {scores.slice(0, 5).map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="text-neutral-700 w-3">{i+1}</span>
                    <span className={`font-bold w-7 tracking-wider ${i===0?'text-white':'text-neutral-400'}`}>{s.initials}</span>
                    <span className={`tabular-nums text-xs ${i===0?'text-white':'text-neutral-600'}`}>{s.score.toString().padStart(6,'0')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keys — shown while playing */}
          {(state.status === 'playing' || state.status === 'paused') && (
            <div>
              <p className="font-mono text-xs tracking-[0.18em] uppercase text-neutral-600 mb-2">Keys</p>
              <div className="space-y-2">
                {[['↑','Rotate'],['← →','Move'],['↓','Soft'],['Space','Drop'],['P','Pause']].map(([k,v])=>(
                  <div key={k} className="flex gap-2 items-baseline">
                    <span className="font-mono text-xs text-neutral-300 shrink-0 w-10">{k}</span>
                    <span className="font-mono text-xs text-neutral-600">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Back link */}
      <div className="mt-8">
        <Link href="/" className="font-mono text-xs tracking-[0.18em] uppercase text-neutral-700 hover:text-neutral-400 transition-colors">
          ← OE Hub
        </Link>
      </div>
    </main>
  );
}
