import { useCurrentFrame, interpolate } from 'remotion';

const MEDIAN = '#00d4ff';
const ULNAR  = '#00ffcc';
const RADIAL = '#ffdd00';

const fade = (frame, start, end) =>
  interpolate(frame, [start, end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const prog = (frame, start, end) =>
  interpolate(frame, [start, end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

// Nerve path: wide glow layer + sharp core
const Nerve = ({ d, p, stroke, sw = 2, glowSw = 14, glowOp = 0.12, blur = 7 }) => {
  const PL = 1000;
  const off = interpolate(p, [0, 1], [PL, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const shared = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', pathLength: PL, strokeDasharray: PL, strokeDashoffset: off };
  return (
    <g>
      <path d={d} stroke={stroke} strokeWidth={glowSw} opacity={glowOp} style={{ filter: `blur(${blur}px)` }} {...shared}/>
      <path d={d} stroke={stroke} strokeWidth={sw} {...shared}/>
    </g>
  );
};

const Node = ({ cx, cy, c, op }) => (
  <g opacity={op}>
    <circle cx={cx} cy={cy} r={7} fill={c} opacity={0.25} style={{ filter: 'blur(4px)' }}/>
    <circle cx={cx} cy={cy} r={3.5} fill={c}/>
  </g>
);

export const NerveMap = () => {
  const frame = useCurrentFrame();
  const f = (s, e) => fade(frame, s, e);
  const p = (s, e) => prog(frame, s, e);

  const skelOp   = f(5, 60);
  const medTrunk = p(60, 105);
  const ulnTrunk = p(75, 118);
  const radSens  = p(90, 135);
  const cdnThumb = p(108, 148);
  const cdn1     = p(112, 152);
  const cdn2     = p(116, 156);
  const cdn3     = p(120, 160);
  const pdnIdxR  = p(152, 208);
  const pdnIdxU  = p(156, 212);
  const pdnMidR  = p(160, 216);
  const pdnMidU  = p(164, 220);
  const pdnRngR  = p(168, 224);
  const pdnRngU  = p(172, 228);
  const pdnPkyR  = p(176, 230);
  const pdnPkyU  = p(180, 234);
  const pdnThmR  = p(148, 204);
  const pdnThmU  = p(152, 208);
  const radIdx   = p(130, 174);
  const radMid   = p(136, 178);
  const medTerrOp = f(228, 268);
  const ulnTerrOp = f(238, 278);
  const radTerrOp = f(248, 288);
  const labelOp   = f(272, 305);
  const insetOp   = f(255, 292);
  const nodeOp    = f(145, 168);
  const pulseOp   = f(310, 338);

  // Signal pulses loop from frame 310
  const pf = Math.max(0, frame - 310);
  const mk = (offset, period) => (pf + offset) % period / period;
  const lp = (t, x1, y1, x2, y2) => ({ x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) });
  const pulses = [
    { t: mk(0,  90), x1: 464, y1: 924, x2: 437, y2: 170, c: MEDIAN, r: 5.5 },
    { t: mk(22, 90), x1: 464, y1: 924, x2: 340, y2: 222, c: MEDIAN, r: 4.5 },
    { t: mk(45, 90), x1: 464, y1: 924, x2: 453, y2: 170, c: MEDIAN, r: 3.5 },
    { t: mk(62, 90), x1: 464, y1: 924, x2: 285, y2: 554, c: MEDIAN, r: 3.5 },
    { t: mk(0,  80), x1: 524, y1: 924, x2: 607, y2: 374, c: ULNAR,  r: 5.5 },
    { t: mk(40, 80), x1: 524, y1: 924, x2: 537, y2: 214, c: ULNAR,  r: 4   },
    { t: mk(20, 80), x1: 524, y1: 924, x2: 592, y2: 374, c: ULNAR,  r: 3.5 },
    { t: mk(0,  70), x1: 358, y1: 880, x2: 230, y2: 642, c: RADIAL, r: 5   },
    { t: mk(35, 70), x1: 308, y1: 778, x2: 340, y2: 222, c: RADIAL, r: 3.5 },
  ];

  return (
    <svg width={960} height={1080} viewBox="0 0 960 1080" style={{ background: '#02080f' }}>
      <defs>
        <filter id="gB" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="gS" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="bgH" cx="50%" cy="44%" r="52%">
          <stop offset="0%" stopColor="rgba(0,100,200,.09)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>

      <ellipse cx={480} cy={520} rx={400} ry={490} fill="url(#bgH)"/>
      <g opacity={0.025} stroke="rgba(0,180,255,1)" strokeWidth={0.5}>
        {[1,2,3,4,5,6,7].map(i => <line key={`h${i}`} x1={0} y1={i*135} x2={960} y2={i*135}/>)}
        {[1,2,3,4,5].map(i => <line key={`v${i}`} x1={i*160} y1={0} x2={i*160} y2={1080}/>)}
      </g>

      <text x={480} y={50} textAnchor="middle"
            fill="rgba(0,212,255,.30)" fontFamily="ui-sans-serif,system-ui,sans-serif"
            fontSize={12} fontWeight={700} letterSpacing="0.26em">
        NERVE DISTRIBUTION · DORSAL HAND · TRIANGLE HAND &amp; SHOULDER
      </text>

      {/* ── HAND SKELETON ──────────────────────── */}
      <g opacity={skelOp}>
        <path d="M 295,975 Q 278,952 280,926 L 284,902 L 680,902 L 684,926 Q 686,952 669,975 Z"
              fill="rgba(0,70,180,.05)" stroke="rgba(0,140,255,.26)" strokeWidth={1.4}/>
        <ellipse cx={464} cy={902} rx={90} ry={20} fill="none"
                 stroke={`${MEDIAN}50`} strokeWidth={1} strokeDasharray="5 3"/>
        <ellipse cx={528} cy={902} rx={32} ry={12} fill="none"
                 stroke={`${ULNAR}40`} strokeWidth={0.8} strokeDasharray="3 3"/>
        <path d="M 295,902 L 295,738 Q 295,726 308,726 L 660,726 Q 672,726 672,738 L 672,902 Z"
              fill="rgba(0,70,180,.04)" stroke="rgba(0,140,255,.20)" strokeWidth={1.2}/>
        <line x1={295} y1={726} x2={672} y2={726} stroke="rgba(0,140,255,.10)" strokeWidth={0.8} strokeDasharray="5 4"/>

        {/* Thumb */}
        <path d="M 302,862 Q 276,840 246,800 Q 216,754 214,718 Q 212,684 232,670 Q 254,656 272,676 Q 288,698 290,730 L 298,822"
              fill="rgba(0,70,180,.04)" stroke="rgba(0,140,255,.24)" strokeWidth={1.2} strokeLinejoin="round"/>
        <line x1={232} y1={692} x2={280} y2={696} stroke="rgba(0,140,255,.17)" strokeWidth={0.9}/>
        <path d="M 236,670 Q 225,642 222,614 Q 220,594 226,578 Q 232,562 242,558 Q 253,554 260,566 Q 266,582 262,604 L 258,628"
              fill="rgba(0,70,180,.05)" stroke="rgba(0,140,255,.22)" strokeWidth={1.1}/>

        {/* Index */}
        <path d="M 340,726 L 337,222 Q 337,210 358,210 Q 377,210 377,222 L 374,726 Z"
              fill="rgba(0,70,180,.04)" stroke="rgba(0,140,255,.22)" strokeWidth={1.1}/>
        <line x1={337} y1={418} x2={377} y2={418} stroke="rgba(0,140,255,.16)" strokeWidth={0.9}/>
        <line x1={337} y1={308} x2={377} y2={308} stroke="rgba(0,140,255,.13)" strokeWidth={0.8}/>

        {/* Middle */}
        <path d="M 418,726 L 416,170 Q 416,158 438,158 Q 460,158 460,170 L 458,726 Z"
              fill="rgba(0,70,180,.04)" stroke="rgba(0,140,255,.24)" strokeWidth={1.2}/>
        <line x1={416} y1={390} x2={460} y2={390} stroke="rgba(0,140,255,.18)" strokeWidth={0.9}/>
        <line x1={416} y1={275} x2={460} y2={275} stroke="rgba(0,140,255,.14)" strokeWidth={0.8}/>

        {/* Ring */}
        <path d="M 506,726 L 504,214 Q 504,202 524,202 Q 544,202 544,214 L 542,726 Z"
              fill="rgba(0,70,180,.04)" stroke="rgba(0,140,255,.22)" strokeWidth={1.1}/>
        <line x1={504} y1={404} x2={544} y2={404} stroke="rgba(0,140,255,.16)" strokeWidth={0.9}/>
        <line x1={504} y1={298} x2={544} y2={298} stroke="rgba(0,140,255,.13)" strokeWidth={0.8}/>

        {/* Pinky */}
        <path d="M 593,726 L 591,374 Q 591,362 608,362 Q 626,362 626,374 L 624,726 Z"
              fill="rgba(0,70,180,.03)" stroke="rgba(0,140,255,.18)" strokeWidth={1}/>
        <line x1={591} y1={508} x2={625} y2={508} stroke="rgba(0,140,255,.14)" strokeWidth={0.8}/>
        <line x1={591} y1={428} x2={625} y2={428} stroke="rgba(0,140,255,.11)" strokeWidth={0.7}/>

        {/* Web space curves */}
        {[[376,726,400,726],[458,726,482,726],[542,726,566,726]].map(([x1,y1,x2,y2],i) => (
          <path key={i} d={`M ${x1},${y1} Q ${(x1+x2)/2},${y1-14} ${x2},${y2}`}
                fill="none" stroke="rgba(0,140,255,.12)" strokeWidth={0.8}/>
        ))}
        {/* Extensor tendon guides */}
        {[[358,726,358,222],[438,726,438,170],[524,726,524,214],[608,726,608,374]].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(0,180,255,.04)" strokeWidth={0.5} strokeDasharray="6 5"/>
        ))}
      </g>

      {/* ── TERRITORIES ────────────────────────── */}
      <g opacity={medTerrOp}>
        <path d="M 232,670 Q 254,656 298,726 L 302,860 Q 276,840 246,800 Q 212,754 212,718 Q 210,684 230,670 Z" fill="rgba(0,212,255,.065)"/>
        <path d="M 335,210 L 379,210 L 377,726 L 337,726 Z" fill="rgba(0,212,255,.065)"/>
        <path d="M 414,158 L 462,158 L 460,726 L 416,726 Z" fill="rgba(0,212,255,.07)"/>
        <path d="M 502,202 L 524,202 L 524,726 L 504,726 Z" fill="rgba(0,212,255,.045)"/>
      </g>
      <g opacity={ulnTerrOp}>
        <path d="M 524,202 L 546,202 L 544,726 L 524,726 Z" fill="rgba(0,255,200,.055)"/>
        <path d="M 589,362 L 627,362 L 625,726 L 591,726 Z" fill="rgba(0,255,200,.07)"/>
      </g>
      <g opacity={radTerrOp}>
        <path d="M 337,308 L 379,308 L 378,726 L 338,726 Z" fill="rgba(255,220,0,.04)"/>
        <path d="M 416,390 L 460,390 L 459,726 L 417,726 Z" fill="rgba(255,220,0,.035)"/>
      </g>

      {/* ── NERVE TRUNKS ───────────────────────── */}
      <Nerve d="M 464,924 L 464,750" p={medTrunk} stroke={MEDIAN} sw={3.5} glowSw={20} glowOp={0.15} blur={10}/>
      <Nerve d="M 524,924 L 524,750" p={ulnTrunk} stroke={ULNAR}  sw={3.5} glowSw={20} glowOp={0.13} blur={10}/>
      <Nerve d="M 358,880 Q 320,852 288,812 Q 258,766 244,722 Q 232,682 230,642"
             p={radSens} stroke={RADIAL} sw={3} glowSw={18} glowOp={0.12} blur={9}/>
      <Node cx={464} cy={748} c={MEDIAN} op={nodeOp}/>
      <Node cx={524} cy={748} c={ULNAR}  op={nodeOp}/>

      {/* ── COMMON DIGITAL NERVES ──────────────── */}
      <Nerve d="M 464,750 Q 420,744 370,737 Q 330,732 300,726" p={cdnThumb} stroke={MEDIAN} sw={2.2} glowSw={11} glowOp={0.1} blur={6}/>
      <Nerve d="M 464,750 Q 450,742 399,730 L 358,726"         p={cdn1}     stroke={MEDIAN} sw={2.2} glowSw={11} glowOp={0.1} blur={6}/>
      <Nerve d="M 464,750 L 482,726"                           p={cdn2}     stroke={MEDIAN} sw={2.2} glowSw={11} glowOp={0.1} blur={6}/>
      <Nerve d="M 524,750 L 566,726"                           p={cdn3}     stroke={ULNAR}  sw={2.2} glowSw={11} glowOp={0.1} blur={6}/>
      {[{cx:300,cy:724,c:MEDIAN},{cx:358,cy:724,c:MEDIAN},{cx:482,cy:724,c:MEDIAN},{cx:566,cy:724,c:ULNAR}].map((n,i) => (
        <Node key={i} {...n} op={f(158, 175)}/>
      ))}

      {/* ── PROPER DIGITAL NERVES ──────────────── */}
      {/* Thumb */}
      <Nerve d="M 230,644 Q 222,618 219,590 Q 217,570 223,554 Q 229,540 240,536" p={pdnThmR} stroke={RADIAL} sw={1.8} glowSw={9} glowOp={0.12} blur={5}/>
      <Nerve d="M 272,678 Q 263,655 260,628 Q 257,606 263,588 Q 269,572 280,562 Q 287,554 296,552" p={pdnThmU} stroke={MEDIAN} sw={1.8} glowSw={9} glowOp={0.10} blur={5}/>
      {/* Index */}
      <Nerve d="M 340,726 L 338,222" p={pdnIdxR} stroke={MEDIAN} sw={1.8} glowSw={9} glowOp={0.12} blur={5}/>
      <Nerve d="M 376,726 L 374,222" p={pdnIdxU} stroke={MEDIAN} sw={1.8} glowSw={9} glowOp={0.12} blur={5}/>
      {/* Middle */}
      <Nerve d="M 420,726 L 418,170" p={pdnMidR} stroke={MEDIAN} sw={1.8} glowSw={9} glowOp={0.12} blur={5}/>
      <Nerve d="M 456,726 L 454,170" p={pdnMidU} stroke={MEDIAN} sw={1.8} glowSw={9} glowOp={0.12} blur={5}/>
      {/* Ring — radial = median, ulnar = ulnar */}
      <Nerve d="M 508,726 L 506,214" p={pdnRngR} stroke={MEDIAN} sw={1.8} glowSw={9} glowOp={0.10} blur={5}/>
      <Nerve d="M 540,726 L 538,214" p={pdnRngU} stroke={ULNAR}  sw={1.8} glowSw={9} glowOp={0.10} blur={5}/>
      {/* Pinky */}
      <Nerve d="M 593,726 L 591,374" p={pdnPkyR} stroke={ULNAR}  sw={1.8} glowSw={8} glowOp={0.10} blur={5}/>
      <Nerve d="M 623,726 L 621,374" p={pdnPkyU} stroke={ULNAR}  sw={1.8} glowSw={8} glowOp={0.10} blur={5}/>
      {/* Radial dorsal branches */}
      <Nerve d="M 308,778 L 308,726 L 340,222"   p={radIdx} stroke={RADIAL} sw={1.5} glowSw={7} glowOp={0.09} blur={4}/>
      <Nerve d="M 295,762 Q 340,740 418,390"     p={radMid} stroke={RADIAL} sw={1.3} glowSw={6} glowOp={0.08} blur={4}/>

      {/* Fingertip anastomotic arcs */}
      <g opacity={f(220, 242)}>
        {[[338,222,374,222,MEDIAN],[418,170,454,170,MEDIAN],[506,214,538,214,RADIAL],[591,374,621,374,ULNAR]].map(([x1,y1,x2,y2,c],i) => (
          <path key={i} d={`M ${x1},${y1} Q ${(x1+x2)/2},${y1-14} ${x2},${y2}`}
                fill="none" stroke={c} strokeWidth={1.2} strokeLinecap="round" style={{ filter: 'blur(1px)' }} opacity={0.6}/>
        ))}
      </g>

      {/* Ring finger median/ulnar boundary */}
      <g opacity={f(230, 252)}>
        <line x1={524} y1={460} x2={524} y2={726} stroke="rgba(180,210,255,.15)" strokeWidth={0.6} strokeDasharray="3 2"/>
        <circle cx={524} cy={460} r={3} fill="none" stroke="rgba(180,210,255,.30)" strokeWidth={0.8}/>
      </g>

      {/* ── SIGNAL PULSES ──────────────────────── */}
      <g opacity={pulseOp}>
        {pulses.map((u, i) => {
          const pos = lp(u.t, u.x1, u.y1, u.x2, u.y2);
          return (
            <g key={i}>
              <circle cx={pos.x} cy={pos.y} r={u.r * 2.4} fill={u.c} opacity={0.14} style={{ filter: 'blur(7px)' }}/>
              <circle cx={pos.x} cy={pos.y} r={u.r} fill={u.c} opacity={0.92}/>
              <circle cx={pos.x} cy={pos.y} r={u.r * 0.42} fill="#fff" opacity={0.72}/>
            </g>
          );
        })}
      </g>

      {/* ── LABELS ─────────────────────────────── */}
      <g opacity={labelOp}>
        <line x1={464} y1={900} x2={620} y2={862} stroke={`${MEDIAN}44`} strokeWidth={0.8}/>
        <rect x={622} y={846} width={120} height={36} rx={5} fill="rgba(0,6,18,.88)" stroke={`${MEDIAN}38`} strokeWidth={0.8}/>
        <text x={632} y={860} fill={MEDIAN} fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={9} fontWeight={700} letterSpacing="0.08em">CARPAL TUNNEL</text>
        <text x={632} y={874} fill={`${MEDIAN}80`} fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={7.5}>Median N. · CTS site</text>

        <line x1={528} y1={900} x2={644} y2={930} stroke={`${ULNAR}44`} strokeWidth={0.8}/>
        <text x={648} y={935} fill={ULNAR} fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={8.5} fontWeight={700} letterSpacing="0.07em">GUYON'S CANAL</text>

        <line x1={335} y1={872} x2={240} y2={900} stroke={`${RADIAL}44`} strokeWidth={0.8}/>
        <text x={236} y={905} textAnchor="end" fill={RADIAL} fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={8.5} fontWeight={700} letterSpacing="0.07em">RADIAL SENSORY N.</text>

        <line x1={340} y1={362} x2={268} y2={342} stroke="rgba(180,210,255,.2)" strokeWidth={0.7}/>
        <text x={264} y={340} textAnchor="end" fill="rgba(180,210,255,.52)" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={8} fontWeight={600}>Proper Digital N.</text>

        <line x1={524} y1={462} x2={582} y2={442} stroke="rgba(180,210,255,.2)" strokeWidth={0.7}/>
        <text x={586} y={440} fill="rgba(180,210,255,.45)" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={7.5}>Median | Ulnar</text>

        <text x={268} y={420} fill="rgba(180,210,255,.36)" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={8} fontWeight={600} letterSpacing="0.06em">PIP</text>
        <text x={268} y={310} fill="rgba(180,210,255,.30)" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={8} fontWeight={600} letterSpacing="0.06em">DIP</text>

        {/* Legend */}
        <rect x={28} y={1026} width={380} height={44} rx={7} fill="rgba(0,6,18,.78)" stroke="rgba(100,150,255,.10)" strokeWidth={0.8}/>
        {[{x:44,c:MEDIAN,label:'Median N.'},{x:170,c:ULNAR,label:'Ulnar N.'},{x:288,c:RADIAL,label:'Radial Sensory'}].map((l,i) => (
          <g key={i}>
            <line x1={l.x} y1={1044} x2={l.x+26} y2={1044} stroke={l.c} strokeWidth={2.5} strokeLinecap="round" style={{ filter: 'blur(1px)' }}/>
            <line x1={l.x} y1={1044} x2={l.x+26} y2={1044} stroke={l.c} strokeWidth={1.5} strokeLinecap="round"/>
            <text x={l.x+32} y={1048} fill={`${l.c}cc`} fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={9.5} fontWeight={600}>{l.label}</text>
          </g>
        ))}
        <text x={44} y={1062} fill="rgba(180,210,255,.28)" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={7.5} letterSpacing="0.08em">
          PROPER DIGITAL NERVES · COMMON DIGITAL NERVES · DORSAL BRANCHES
        </text>
      </g>

      {/* ── CARPAL TUNNEL CROSS-SECTION ─────────── */}
      <g opacity={insetOp} transform="translate(720, 672)">
        <rect width={220} height={182} rx={9} fill="rgba(1,5,18,.93)" stroke="rgba(100,150,255,.17)" strokeWidth={0.8}/>
        <text x={110} y={19} textAnchor="middle" fill="rgba(180,210,255,.44)" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={8} fontWeight={700} letterSpacing="0.16em">CARPAL TUNNEL</text>
        <text x={110} y={31} textAnchor="middle" fill="rgba(180,210,255,.28)" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={6.5} letterSpacing="0.10em">Axial Cross-Section</text>
        <path d="M 28,115 Q 40,58 110,50 Q 180,58 192,115 Z" fill="rgba(26,95,168,.1)" stroke="rgba(100,150,255,.28)" strokeWidth={1.2}/>
        <path d="M 24,120 Q 110,102 196,120" fill="none" stroke="rgba(220,235,255,.44)" strokeWidth={2.2} strokeLinecap="round"/>
        <text x={110} y={100} textAnchor="middle" fill="rgba(200,220,255,.34)" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={6.5}>Flex. Retinaculum</text>
        <circle cx={85} cy={128} r={10} fill={`${MEDIAN}28`} stroke={MEDIAN} strokeWidth={1.5}/>
        <circle cx={85} cy={128} r={16} fill="none" stroke={MEDIAN} strokeWidth={0.6} opacity={0.25}/>
        <text x={85} y={132} textAnchor="middle" fill={MEDIAN} fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={7} fontWeight={700}>MN</text>
        {[107,126,145,164].map((cx,i) => (
          <g key={`fds${i}`}>
            <circle cx={cx} cy={122} r={6} fill="rgba(200,220,255,.07)" stroke="rgba(200,220,255,.27)" strokeWidth={0.8}/>
            <text x={cx} y={125} textAnchor="middle" fill="rgba(200,220,255,.38)" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={4.5} fontWeight={600}>FDS</text>
          </g>
        ))}
        {[107,126,145,164].map((cx,i) => (
          <g key={`fdp${i}`}>
            <circle cx={cx} cy={140} r={6} fill="rgba(200,220,255,.06)" stroke="rgba(200,220,255,.22)" strokeWidth={0.8}/>
            <text x={cx} y={143} textAnchor="middle" fill="rgba(200,220,255,.33)" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={4.5} fontWeight={600}>FDP</text>
          </g>
        ))}
        <circle cx={68} cy={140} r={5.5} fill="rgba(200,220,255,.06)" stroke="rgba(200,220,255,.22)" strokeWidth={0.8}/>
        <text x={68} y={143} textAnchor="middle" fill="rgba(200,220,255,.33)" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={4}>FPL</text>
        <ellipse cx={30} cy={128} rx={16} ry={12} fill="rgba(0,10,24,.7)" stroke={`${ULNAR}44`} strokeWidth={0.9}/>
        <text x={30} y={126} textAnchor="middle" fill={`${ULNAR}cc`} fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={6} fontWeight={700}>UN</text>
        <text x={30} y={136} textAnchor="middle" fill="rgba(0,255,200,.38)" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={5}>Guyon</text>
        <circle cx={30}  cy={164} r={4.5} fill={`${MEDIAN}28`} stroke={MEDIAN} strokeWidth={0.8}/>
        <text x={38}  y={168} fill="rgba(0,212,255,.55)" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={6.5}>Median N.</text>
        <circle cx={100} cy={164} r={4.5} fill="rgba(200,220,255,.10)" stroke="rgba(200,220,255,.28)" strokeWidth={0.8}/>
        <text x={108} y={168} fill="rgba(180,210,255,.45)" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={6.5}>9 Tendons</text>
        <circle cx={168} cy={164} r={4.5} fill="rgba(0,10,24,.70)" stroke={`${ULNAR}44`} strokeWidth={0.8}/>
        <text x={176} y={168} fill="rgba(0,255,200,.45)" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={6.5}>Ulnar N.</text>
      </g>

    </svg>
  );
};
