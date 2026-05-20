import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import React from 'react';

const FPS = 30;

// Median nerve path (thumb, index, middle, half of ring)
const MEDIAN_PATH = "M 480,560 Q 480,520 475,500 Q 468,470 460,452 L 455,420 L 368,420 L 360,390 L 352,340 Q 350,322 360,318 Q 370,314 374,330 L 378,380 L 382,338 Q 384,320 394,318 Q 404,316 406,332 L 408,372 L 412,334 Q 414,316 424,316 Q 434,316 434,334 L 432,420 L 480,420";
const ULNAR_PATH  = "M 480,560 Q 480,520 475,500 Q 468,470 460,452 L 455,420 L 368,420 L 362,398 L 340,340 Q 338,322 326,320 Q 314,318 314,336 L 316,420";
const RADIAL_PATH = "M 480,510 Q 470,480 462,460 L 450,420 L 380,420 L 370,395 L 350,320 L 360,300 Q 374,285 386,300 L 396,380";

// Cross-section nerve circles (wrist level)
const NERVES_XS = [
  { id: 'median', cx: 240, cy: 440, r: 18, color: '#00c8f0', label: 'Median N.' },
  { id: 'ulnar',  cx: 180, cy: 446, r: 12, color: '#06d6a0', label: 'Ulnar N.'  },
  { id: 'radial', cx: 298, cy: 436, r: 10, color: '#ffd700', label: 'Radial N.' },
];

// Innervation territories on the hand
const TERRITORIES = [
  // Median — thumb, index, middle, lateral half ring
  { id: 'median', color: '#00c8f0', d: 'M 360,380 L 354,320 Q 354,304 364,300 Q 374,296 378,310 L 382,356 L 386,310 Q 388,294 398,292 Q 408,290 410,306 L 412,356 L 416,328 Q 418,312 428,310 Q 438,308 440,322 L 438,380 L 430,400 Q 410,412 390,410 Z' },
  // Ulnar — ring and pinky
  { id: 'ulnar',  color: '#06d6a0', d: 'M 320,368 L 318,322 Q 318,306 328,304 Q 338,302 340,316 L 342,370 L 348,340 Q 350,324 360,322 Q 370,320 370,334 L 366,380 L 356,400 Q 336,412 320,404 Z' },
];

function useNervePulse(delay = 0) {
  const frame = useCurrentFrame();
  const total = 90;
  const adjusted = ((frame + delay) % total) / total;
  return adjusted;
}

function AnimatedPath({ d, color, progress, width = 3, glow = true }) {
  // Estimate path length for dasharray animation
  const len = 800;
  const dashOffset = len - progress * len;
  return (
    <g>
      {glow && (
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={width + 10}
          strokeDasharray={len}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          opacity={0.12}
          filter="url(#blur6)"
        />
      )}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeDasharray={len}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        opacity={0.85}
      />
    </g>
  );
}

function PulseCircle({ path, progress, color }) {
  // Animate a glowing circle along a rough linear interpolation
  const t = progress;
  const x = interpolate(t, [0, 1], [480, 340]);
  const y = interpolate(t, [0, 1], [540, 280]);
  return (
    <circle cx={x} cy={y} r={8} fill={color} opacity={0.9} filter="url(#blur4)">
      <animate attributeName="r" values="6;12;6" dur="0.6s" repeatCount="indefinite" />
    </circle>
  );
}

function Label({ x, y, text, color, frame, delay }) {
  const opacity = interpolate(frame, [delay, delay + 18], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  return (
    <g opacity={opacity}>
      <rect x={x} y={y - 14} width={text.length * 7.4 + 16} height={20} rx={4}
        fill="rgba(6,13,26,.75)" stroke={color} strokeWidth={0.8} strokeOpacity={0.5} />
      <text x={x + 8} y={y} fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={11}
        fill={color} fontWeight="700" letterSpacing="0.06em" opacity={0.95}>
        {text}
      </text>
    </g>
  );
}

export const NerveMap = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 0-60: skeleton draws in
  // Phase 60-120: nerve paths draw
  // Phase 120-180: territories illuminate
  // Phase 180+: pulses loop

  const skelOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const medianProgress = interpolate(frame, [40, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ulnarProgress  = interpolate(frame, [55, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const radialProgress = interpolate(frame, [65, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const territoryOpacity = interpolate(frame, [110, 150], [0, 0.18], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const pulse1 = useNervePulse(0);
  const pulse2 = useNervePulse(30);
  const pulse3 = useNervePulse(60);

  const pulseOpacity = interpolate(frame, [120, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(160deg,#060d1a 0%,#091525 60%,#061420 100%)' }}>
      <svg viewBox="0 0 960 1080" xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <filter id="blur4"><feGaussianBlur stdDeviation="4" /></filter>
          <filter id="blur6"><feGaussianBlur stdDeviation="6" /></filter>
          <filter id="blur2"><feGaussianBlur stdDeviation="2" /></filter>
          {/* Subtle coordinate grid */}
          <pattern id="cgrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,200,240,.05)" strokeWidth=".5"/>
          </pattern>
          {/* Radial glow behind hand */}
          <radialGradient id="handglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,200,240,.06)"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
        </defs>

        {/* Grid background */}
        <rect width="960" height="1080" fill="url(#cgrid)"/>
        {/* Glow behind anatomy */}
        <ellipse cx="480" cy="500" rx="260" ry="340" fill="url(#handglow)"/>

        {/* ═══ HAND SKELETON — dorsal view ═══ */}
        <g opacity={skelOpacity}>
          {/* Wrist / carpal block */}
          <path d="M 340,630 Q 310,610 314,588 L 318,550 L 642,550 L 646,588 Q 650,610 620,630 Z"
            fill="rgba(26,95,168,.07)" stroke="rgba(180,210,255,.35)" strokeWidth="1.8"/>
          {/* Thumb */}
          <path d="M 620,580 Q 668,554 692,516 Q 712,482 698,448 Q 682,420 660,424 Q 640,428 634,454 L 628,494 L 630,550"
            fill="rgba(26,95,168,.06)" stroke="rgba(180,210,255,.32)" strokeWidth="1.8" strokeLinejoin="round"/>
          <line x1="668" y1="468" x2="626" y2="472" stroke="rgba(180,210,255,.18)" strokeWidth="1.2"/>
          {/* Index finger */}
          <path d="M 506,550 L 498,310 Q 498,288 514,288 Q 530,288 530,310 L 522,550 Z"
            fill="rgba(26,95,168,.06)" stroke="rgba(180,210,255,.34)" strokeWidth="1.8"/>
          {/* Middle finger (longest) */}
          <path d="M 456,550 L 449,268 Q 449,246 466,246 Q 483,246 483,268 L 476,550 Z"
            fill="rgba(26,95,168,.07)" stroke="rgba(180,210,255,.38)" strokeWidth="1.8"/>
          {/* Ring finger */}
          <path d="M 406,550 L 400,280 Q 400,258 416,258 Q 432,258 432,280 L 426,550 Z"
            fill="rgba(26,95,168,.06)" stroke="rgba(180,210,255,.32)" strokeWidth="1.8"/>
          {/* Pinky */}
          <path d="M 358,550 L 356,360 Q 356,338 370,338 Q 384,338 384,360 L 382,550 Z"
            fill="rgba(26,95,168,.05)" stroke="rgba(180,210,255,.26)" strokeWidth="1.8"/>
          {/* PIP joints */}
          <line x1="498" y1="388" x2="530" y2="388" stroke="rgba(180,210,255,.22)" strokeWidth="1.2"/>
          <line x1="449" y1="368" x2="483" y2="368" stroke="rgba(180,210,255,.24)" strokeWidth="1.2"/>
          <line x1="400" y1="378" x2="432" y2="378" stroke="rgba(180,210,255,.20)" strokeWidth="1.2"/>
          <line x1="356" y1="430" x2="384" y2="430" stroke="rgba(180,210,255,.18)" strokeWidth="1.2"/>
          {/* DIP joints */}
          <line x1="499" y1="340" x2="530" y2="340" stroke="rgba(180,210,255,.14)" strokeWidth="1"/>
          <line x1="450" y1="318" x2="483" y2="318" stroke="rgba(180,210,255,.16)" strokeWidth="1"/>
          <line x1="401" y1="330" x2="432" y2="330" stroke="rgba(180,210,255,.14)" strokeWidth="1"/>
          <line x1="357" y1="392" x2="384" y2="392" stroke="rgba(180,210,255,.12)" strokeWidth="1"/>
          {/* MCP zone line */}
          <line x1="356" y1="516" x2="630" y2="516" stroke="rgba(180,210,255,.12)" strokeWidth="1" strokeDasharray="6 5"/>
        </g>

        {/* ═══ INNERVATION TERRITORIES ═══ */}
        <g opacity={territoryOpacity}>
          {/* Median territory — thumb, index, middle, lat. ring */}
          <path d="M 514,516 L 500,298 Q 500,280 514,278 Q 528,276 530,292 L 532,516 L 526,540 L 508,540 Z"
            fill="#00c8f0" />
          <path d="M 466,516 L 461,260 Q 461,240 467,238 Q 474,236 481,242 L 484,516 L 476,540 L 460,540 Z"
            fill="#00c8f0"/>
          <path d="M 414,516 L 412,294 Q 412,276 418,274 Q 424,272 430,278 L 432,516 L 424,540 L 408,540 Z"
            fill="#00c8f0" opacity={0.7}/>
          {/* Ulnar territory — ring full + pinky */}
          <path d="M 360,516 L 360,352 Q 360,332 370,330 Q 380,328 382,346 L 382,516 L 376,540 L 358,540 Z"
            fill="#06d6a0"/>
          {/* Radial territory — dorsal web spaces (simulated) */}
          <circle cx="555" cy="500" r="40" fill="#ffd700" opacity={0.6}/>
        </g>

        {/* ═══ NERVE PATHWAYS ═══ */}
        {/* Median nerve (blue) */}
        <AnimatedPath
          d="M 480,640 L 480,580 L 470,552 L 462,516 L 514,516 L 516,390 L 514,296 Q 514,278 514,278"
          color="#00c8f0" progress={medianProgress} width={3}/>
        {/* Branch to index */}
        <AnimatedPath
          d="M 480,530 L 466,516 L 467,380 L 466,270"
          color="#00c8f0" progress={medianProgress} width={2.2} glow={false}/>
        {/* Branch to middle */}
        <AnimatedPath
          d="M 480,530 L 478,516 L 466,430 L 418,516 L 416,380"
          color="#00c8f0" progress={medianProgress > 0.6 ? (medianProgress - 0.6) / 0.4 : 0} width={2.2} glow={false}/>

        {/* Ulnar nerve (teal) */}
        <AnimatedPath
          d="M 440,640 L 442,580 L 440,550 L 380,516 L 370,430 L 364,360"
          color="#06d6a0" progress={ulnarProgress} width={2.8}/>

        {/* Radial sensory (gold) */}
        <AnimatedPath
          d="M 520,640 L 518,580 L 530,550 L 560,516 L 580,480 L 590,430"
          color="#ffd700" progress={radialProgress} width={2.4}/>

        {/* ═══ SIGNAL PULSES ═══ */}
        <g opacity={pulseOpacity}>
          {/* Median pulse */}
          {Array.from({ length: 3 }).map((_, i) => {
            const t = ((frame - 120 + i * 30) % 90) / 90;
            const x = interpolate(t, [0, 1], [480, 514], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
            const y = interpolate(t, [0, 1], [635, 288], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={12} fill="#00c8f0" opacity={0.15} filter="url(#blur6)"/>
                <circle cx={x} cy={y} r={5} fill="#00c8f0" opacity={0.9}/>
              </g>
            );
          })}
          {/* Ulnar pulse */}
          {Array.from({ length: 2 }).map((_, i) => {
            const t = ((frame - 120 + i * 45) % 90) / 90;
            const x = interpolate(t, [0, 1], [440, 364]);
            const y = interpolate(t, [0, 1], [635, 358]);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={10} fill="#06d6a0" opacity={0.14} filter="url(#blur6)"/>
                <circle cx={x} cy={y} r={4} fill="#06d6a0" opacity={0.9}/>
              </g>
            );
          })}
        </g>

        {/* ═══ CROSS-SECTION CIRCLE (wrist level) ═══ */}
        <g opacity={interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <circle cx={130} cy={440} r={70} fill="rgba(6,13,26,.85)" stroke="rgba(180,210,255,.15)" strokeWidth="1"/>
          {/* Wrist tissues */}
          <ellipse cx={130} cy={440} rx={60} ry={55} fill="rgba(26,95,168,.08)" stroke="rgba(180,210,255,.12)" strokeWidth=".8"/>
          {/* Nerve cross-sections */}
          <circle cx={120} cy={435} r={16} fill="none" stroke="#00c8f0" strokeWidth="1.5" strokeDasharray="3 2"/>
          <circle cx={120} cy={435} r={10} fill="rgba(0,200,240,.12)"/>
          <text x={120} y={438} textAnchor="middle" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={9} fill="#00c8f0" fontWeight="700">MN</text>
          <circle cx={152} cy={448} r={9} fill="none" stroke="#06d6a0" strokeWidth="1.2" strokeDasharray="2 2"/>
          <circle cx={152} cy={448} r={5} fill="rgba(6,214,160,.12)"/>
          <text x={152} y={451} textAnchor="middle" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={7} fill="#06d6a0" fontWeight="700">UN</text>
          <circle cx={140} cy={418} r={7} fill="none" stroke="#ffd700" strokeWidth="1" strokeDasharray="2 2"/>
          <circle cx={140} cy={418} r={4} fill="rgba(255,215,0,.1)"/>
          {/* Flexor tendons */}
          {[108, 100, 94, 88].map((x, i) => (
            <circle key={i} cx={x} cy={450 + i * 4} r={5} fill="rgba(180,210,255,.06)" stroke="rgba(180,210,255,.2)" strokeWidth=".8"/>
          ))}
          <text x={130} y={516} textAnchor="middle" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={9.5} fill="rgba(180,210,255,.5)" fontWeight="700" letterSpacing=".1em">CARPAL TUNNEL XS</text>
          {/* Connector line to anatomy */}
          <line x1={200} y1={440} x2={318} y2={570} stroke="rgba(0,200,240,.2)" strokeWidth=".8" strokeDasharray="4 3"/>
        </g>

        {/* ═══ ANNOTATION LABELS ═══ */}
        <g fontFamily="ui-sans-serif,system-ui,sans-serif">
          <Label x={640} y={302} text="MEDIAN NERVE" color="#00c8f0" frame={frame} delay={60}/>
          <Label x={640} y={380} text="ULNAR NERVE" color="#06d6a0" frame={frame} delay={74}/>
          <Label x={640} y={456} text="RADIAL SENSORY" color="#ffd700" frame={frame} delay={88}/>

          {/* Connection lines to labels */}
          {frame > 60 && (
            <line x1={514} y1={302} x2={638} y2={295} stroke="#00c8f0" strokeWidth=".7" opacity={interpolate(frame,[60,78],[0,0.45],{extrapolateRight:'clamp'})}/>
          )}
          {frame > 74 && (
            <line x1={368} y1={396} x2={638} y2={374} stroke="#06d6a0" strokeWidth=".7" opacity={interpolate(frame,[74,92],[0,0.4],{extrapolateRight:'clamp'})}/>
          )}
          {frame > 88 && (
            <line x1={585} y1={456} x2={638} y2={450} stroke="#ffd700" strokeWidth=".7" opacity={interpolate(frame,[88,106],[0,0.4],{extrapolateRight:'clamp'})}/>
          )}

          {/* Carpal tunnel label with callout */}
          {frame > 100 && (
            <g opacity={interpolate(frame,[100,120],[0,1],{extrapolateRight:'clamp'})}>
              <ellipse cx={480} cy={560} rx={60} ry={14} fill="none" stroke="rgba(0,200,240,.45)" strokeWidth="1" strokeDasharray="4 3"/>
              <line x1={480} y1={546} x2={480} y2={520} stroke="rgba(0,200,240,.3)" strokeWidth=".8"/>
              <text x={550} y={518} fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={11} fill="rgba(0,200,240,.65)" fontWeight="700" letterSpacing=".06em">CARPAL CANAL</text>
            </g>
          )}
        </g>

        {/* ═══ TITLE OVERLAY ═══ */}
        <g opacity={interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })}>
          <text x={48} y={72} fontFamily="'Georgia',serif" fontSize={22} fill="rgba(255,255,255,.88)" fontWeight="700" letterSpacing=".04em">
            Peripheral Nerve Anatomy
          </text>
          <text x={48} y={95} fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={12} fill="rgba(0,200,240,.7)" fontWeight="600" letterSpacing=".12em">
            HAND · DORSAL VIEW · NEURAL MAPPING
          </text>
          <line x1={48} y1={108} x2={400} y2={108} stroke="rgba(0,200,240,.2)" strokeWidth=".8"/>
        </g>

        {/* Legend */}
        <g opacity={interpolate(frame, [80, 110], [0, 1], { extrapolateRight: 'clamp' })}>
          {[
            { color: '#00c8f0', label: 'Median Nerve' },
            { color: '#06d6a0', label: 'Ulnar Nerve' },
            { color: '#ffd700', label: 'Radial Sensory' },
          ].map(({ color, label }, i) => (
            <g key={i} transform={`translate(48, ${148 + i * 30})`}>
              <line x1={0} y1={0} x2={24} y2={0} stroke={color} strokeWidth={2.5} strokeLinecap="round"/>
              <circle cx={12} cy={0} r={4} fill={color} opacity={0.8}/>
              <text x={32} y={4} fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={12} fill="rgba(255,255,255,.72)" fontWeight="600">{label}</text>
            </g>
          ))}
        </g>

      </svg>
    </AbsoluteFill>
  );
};
