import React, { useRef, useEffect, useState } from 'react';
import './ProjectDemos.css';
import { 
  FaTimes, FaMicrophone, FaPaperPlane, FaPlay, FaSync, 
  FaArrowRight, FaTerminal, FaCompass, FaCheckCircle, 
  FaUtensils, FaFilePdf, FaPercentage, FaChartLine, FaExclamationTriangle,
  FaPalette, FaTachometerAlt, FaSignal, FaSlidersH, FaUserCheck,
  FaSkullCrossbones, FaCogs, FaDatabase, FaVideo, FaGamepad
} from 'react-icons/fa';

const ProjectDemoModal = ({ project, onClose }) => {
  const dialogRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (project) {
      setIsOpen(true);
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
    }
  }, [project]);

  const handleClose = () => {
    setIsOpen(false);
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    onClose();
  };

  // Backdrop light-dismiss fallback
  const handleBackdropClick = (event) => {
    if (event.target !== dialogRef.current) return;
    const rect = dialogRef.current.getBoundingClientRect();
    const isInside = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isInside) {
      handleClose();
    }
  };

  if (!project) return null;

  return (
    <dialog
      ref={dialogRef}
      className="demo-dialog"
      onClick={handleBackdropClick}
      onClose={handleClose}
    >
      <div className="dialog-container">
        <div className="demo-header">
          <h3>
            {project.name}
            <span className="demo-header-tagline">| {project.tagline}</span>
          </h3>
          <button className="close-btn" onClick={handleClose} aria-label="Close dialog">
            <FaTimes />
          </button>
        </div>
        <div className="demo-body">
          {renderDemo(project.demoType)}
        </div>
      </div>
    </dialog>
  );
};

// ============================================================
// Simulator Router
// ============================================================
const renderDemo = (demoType) => {
  switch (demoType) {
    case 'interview-simulation':
      return <MonicaAiDemo />;
    case 'zork-hud':
      return <ZorkV2Demo />;
    case 'chef-assistant':
      return <FridgeJamDemo />;
    case 'financial-ledger':
      return <FinTrackerDemo />;
    case 'portfolio-dashboard':
      return <PortfolioDemo />;
    default:
      return <p>No demo simulator configured.</p>;
  }
};

// ============================================================
// 1. MoNiCa.AI - Live WebRTC Interview Simulator
// ============================================================
const MonicaAiDemo = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState([
    { role: 'AI', text: "Hello Stephen! Let's start with a technical question. Can you walk me through the advantages of using WebRTC over WebSockets for bi-directional media streaming?" }
  ]);
  const [status, setStatus] = useState('Session Connected (Secure)');
  const [wpm, setWpm] = useState(135);
  const [fillers, setFillers] = useState(0);
  const [confidence, setConfidence] = useState(94);
  const [sentiment, setSentiment] = useState('Positive / Engaged');
  
  const handleMicrophoneClick = () => {
    if (isRecording) {
      setIsRecording(false);
      setStatus('AI Processing audio chunks (FastAPI)...');
      setTimeout(() => {
        setTranscript(prev => [
          ...prev,
          { role: 'User', text: "Um, so WebRTC operates over UDP which is generally, like, way faster than WebSockets because it cuts out socket handshake loops..." },
          { role: 'AI', text: "Excellent point! You correctly highlighted UDP transport and direct peer-to-peer data flows. Your talking rate was 142 WPM (Optimal), but I detected 2 filler words ('Um', 'Like'). Try keeping pauses silent to maintain a high professional tone!" }
        ]);
        setFillers(prev => prev + 2);
        setWpm(142);
        setConfidence(96);
        setSentiment('Highly Assertive');
        setStatus('WebRTC Pipeline Sync');
      }, 1500);
    } else {
      setIsRecording(true);
      setStatus('Recording user voice stream...');
    }
  };

  return (
    <div className="monica-webrtc-container">
      {/* Left Column: Interactor screen */}
      <div className="webrtc-video-feed">
        <div className="avatar-screen">
          {/* Animated robotic head */}
          <div className={`avatar-svg-holder ${isRecording || status.includes('Processing') ? 'talking' : ''}`}>
            <div className="avatar-head">
              <div className="avatar-eyes">
                <div className="avatar-eye blinking"></div>
                <div className="avatar-eye blinking"></div>
              </div>
              <div className="avatar-mouth"></div>
            </div>
          </div>
          
          <div style={{ marginTop: '16px', color: '#c9ec9e', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {status.includes('Processing') ? '🎤 Monica is speaking...' : '🤖 Monica.AI (Active Room)'}
          </div>

          {/* User webcam overlay panel */}
          <div className="user-webcam-overlay">
            <div className="webcam-detection-box"></div>
            <div style={{ position: 'absolute', bottom: '6px', left: '6px', fontSize: '0.55rem', color: '#c9ec9e', background: 'rgba(0,0,0,0.6)', padding: '2px 4px', borderRadius: '2px' }}>
              👤 STEPHEN (WPM: {wpm})
            </div>
            <FaVideo style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.15)' }} />
          </div>
        </div>

        {/* Real-time speech wave lines */}
        <div style={{ background: '#050810', height: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <div className="avatar-wave">
            <div className="avatar-wave-bar"></div>
            <div className="avatar-wave-bar"></div>
            <div className="avatar-wave-bar"></div>
            <div className="avatar-wave-bar"></div>
            <div className="avatar-wave-bar"></div>
          </div>
        </div>
      </div>

      {/* Right Column: Coaching Telemetry Panel */}
      <div className="coaching-pane" style={{ border: 'none', background: 'rgba(255, 255, 255, 0.02)' }}>
        <h4 style={{ margin: '0 0 10px', color: '#c9ec9e', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.9rem' }}>Vocal Coach Bounding Diagnostics</h4>
        
        <div className="monica-transcript" style={{ flex: 1, maxHeight: '200px' }}>
          {transcript.map((line, idx) => (
            <div key={idx} style={{ marginBottom: '12px', borderLeft: line.role === 'AI' ? '2.5px solid #6c9a57' : '2.5px solid #0899e7', paddingLeft: '8px' }}>
              <span style={{ color: line.role === 'AI' ? '#c9ec9e' : '#0899e7', fontSize: '0.7rem', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>
                {line.role === 'AI' ? '🤖 MoNiCa.AI INTERVIEWER' : '👤 CANDIDATE (STEPHEN)'}:
              </span>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', lineHeight: '1.45' }}>{line.text}</p>
            </div>
          ))}
        </div>

        <div className="monica-stats" style={{ margin: '16px 0', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
          <div className="stat-circle">
            <span className="stat-circle-val">{wpm}</span>
            <span className="stat-circle-lbl">WPM Pace</span>
          </div>
          <div className="stat-circle">
            <span className="stat-circle-val" style={{ color: fillers > 2 ? '#ff5e5e' : '#c9ec9e' }}>{fillers}</span>
            <span className="stat-circle-lbl">Filler Words</span>
          </div>
          <div className="stat-circle">
            <span className="stat-circle-val">{confidence}%</span>
            <span className="stat-circle-lbl">Confidence</span>
          </div>
          <div className="stat-circle">
            <span className="stat-circle-val" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{sentiment}</span>
            <span className="stat-circle-lbl">Sentiment</span>
          </div>
        </div>

        <div className="coaching-controls">
          <button 
            className={`mic-active-btn ${isRecording ? 'recording' : ''}`}
            onClick={handleMicrophoneClick}
          >
            <FaMicrophone /> {isRecording ? 'MUTE AND RUN DIALOG ENGINE' : 'ACTIVATE VOICE COCH STREAM'}
          </button>
          <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', fontFamily: 'monospace' }}>
            PIPELINE SIGNAL: <strong style={{ color: '#c9ec9e' }}>{status}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 2. Zork Tactical OS Cockpit (Exact 1:1 Visual Clone)
// ============================================================
const ZorkV2Demo = () => {
  const [consoleLogs, setConsoleLogs] = useState([
    "10:04:00 TACTICAL TERMINAL CORE INITIALIZED.",
    "10:04:04 You stand in the Great Hall. The air is cold, smelling of ancient stone and fresh ink.",
    "10:04:08 Type \"examine help\" to view operational manual commands."
  ]);
  const [inputVal, setInputVal] = useState('');
  const [thirst, setThirst] = useState(0);
  const [sanity, setSanity] = useState(95);
  const [cogLoad, setCogLoad] = useState(17);
  const [interceptor, setInterceptor] = useState(false);
  const [typedChallenge, setTypedChallenge] = useState('');
  const challengeTarget = "FASTAPI SECURE ROUTE SYNC";

  const handleCommand = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const cmd = inputVal.trim().toLowerCase();
    setInputVal('');

    let reply = `Type "examine help" to view operational manual commands.`;
    let thirstIncrease = 5;
    let sanityDecrease = 2;

    if (cmd === 'examine help' || cmd === 'help') {
      reply = "AVAILABLE COMMAND SEQUENCES: [LOOK], [MOVE NORTH], [TAKE ALL], [INV_SCR], [MAP_BIOS].";
      thirstIncrease = 1;
      sanityDecrease = 0;
    } else if (cmd === 'look') {
      reply = "Scanning immediate sector... Grand wood-framed arches extend along towering stone structures of DePauw University. A heavy locked iron gate is visible north.";
    } else if (cmd === 'move north' || cmd === 'go north') {
      reply = "⚠️ ROUTING SECTOR BLOCKED: FastAPI dynamic route interceptor has locked parser pipelines! Complete security challenge to unseal iron gate.";
      setInterceptor(true);
      setTypedChallenge('');
      return;
    } else if (cmd === 'take all') {
      reply = "Harvesting items... Checked 2 objects: Cargo Manifest updated.";
    } else if (cmd === 'inv_scr' || cmd === 'inventory') {
      reply = "CARGO_MANIFEST ITEMS: 1x [HELP GUIDE], 1x [FOOD COUPON].";
    } else if (cmd === 'map_bios') {
      reply = "SECTOR: JULIAN // COORDS: 39.6488°N, 86.8571°W // EST_CLOCK: 00:00:15";
    }

    setThirst(prev => Math.min(100, prev + thirstIncrease));
    setSanity(prev => Math.max(0, prev - sanityDecrease));
    setCogLoad(prev => Math.min(100, prev + 8));

    setConsoleLogs(prev => [
      ...prev,
      `10:05:00 > ${cmd.toUpperCase()}`,
      `10:05:01 ${reply}`
    ]);
  };

  const handleChallengeSubmit = (e) => {
    e.preventDefault();
    if (typedChallenge === challengeTarget) {
      setInterceptor(false);
      setSanity(prev => Math.min(100, prev + 15));
      setCogLoad(prev => Math.max(0, prev - 10));
      setThirst(prev => Math.min(100, prev + 2));
      setConsoleLogs(prev => [
        ...prev,
        `10:05:12 ✓ SECURITY TYPING CHALLENGE VERIFIED successfully.`,
        `10:05:14 [PIPELINE SECTOR RESUMED] Route unsealed. Gate uncoupled. You step into the quad.`
      ]);
    } else {
      setSanity(prev => Math.max(0, prev - 12));
      setConsoleLogs(prev => [
        ...prev,
        `10:05:12 ✗ ERROR: SECURE CHALLENGE INVALID. ATTEMPT MATCH FAILED.`
      ]);
    }
  };

  return (
    <div className="zork-cockpit">
      {/* 1. Left Icon strip */}
      <div className="zork-sidebar-strip">
        <div className="zork-sidebar-icon active" title="OPERATOR PROFILE"><FaUserCheck /></div>
        <div className="zork-sidebar-icon" title="STATISTICS"><FaSignal /></div>
        <div className="zork-sidebar-icon" title="CARGO MANIFEST"><FaSlidersH /></div>
        <div className="zork-sidebar-icon" title="SATELLITE VIEW"><FaCompass /></div>
        <div style={{ flex: 1 }}></div>
        <div 
          className="zork-sidebar-icon" 
          title="REBOOT SYSTEM" 
          onClick={() => {
            setConsoleLogs(["10:00:00 REBOOTING TERMINAL...", "10:00:02 COCKPIT BOOT SEQUENCE SECURE."]);
            setThirst(0);
            setSanity(95);
            setCogLoad(17);
          }}
          style={{ color: '#ff5e5e' }}
        >
          <FaSkullCrossbones />
        </div>
      </div>

      {/* 2. Main Terminal Panel */}
      <div className="zork-screen-panel">
        <div className="zork-panel-title">
          <span>TACTICAL_LOG_SYSTEM</span>
          <span style={{ fontSize: '0.65rem', color: '#8c8c8c' }}>SECTOR: JULIAN // COORDS: 39.6488°N, 86.8571°W</span>
        </div>
        
        <div className="zork-screen-scroller">
          {consoleLogs.map((log, idx) => (
            <div key={idx} style={{ marginBottom: '8px', color: log.includes('>') ? '#ffb300' : (log.includes('⚠️') ? '#ff5e5e' : '#cbd5e1') }}>{log}</div>
          ))}
        </div>

        {interceptor ? (
          <form className="typing-interceptor-overlay" onSubmit={handleChallengeSubmit} style={{ marginBottom: '16px', background: 'rgba(255, 94, 94, 0.05)', border: '1px solid #ff5e5e' }}>
            <div style={{ color: '#ff5e5e', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '4px' }}>
              ⚠️ ROUTING INTERRUPT: CHALLENGE ACTIVE
            </div>
            <p style={{ margin: '0 0 6px', fontSize: '0.65rem', color: '#c0d1e5' }}>Verify manual overrides. Type exactly:</p>
            <div style={{ color: '#fff', fontSize: '0.8rem', padding: '6px', background: '#000', marginBottom: '8px', border: '1px dashed #ff5e5e', textAlign: 'center' }}>
              {challengeTarget}
            </div>
            <input 
              type="text"
              value={typedChallenge}
              onChange={(e) => setTypedChallenge(e.target.value)}
              placeholder="Awaiting credentials..."
              className="hud-cli-field"
              style={{ background: '#02040b', width: '100%', boxSizing: 'border-box', border: '1px solid #ff5e5e', padding: '8px', fontSize: '0.8rem', color: '#fff' }}
              autoFocus
            />
          </form>
        ) : (
          <form className={`zork-hud-prompt ${inputVal ? 'focused' : ''}`} onSubmit={handleCommand}>
            <span>&gt;</span>
            <input 
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="INITIATE COMMAND SEQUENCE..."
              className="zork-hud-input"
            />
          </form>
        )}

        {/* Quick action helper buttons from screenshot */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
          {['examine help', 'look', 'move north', 'take all', 'inv_scr', 'map_bios'].map((btnCmd) => (
            <button
              key={btnCmd}
              onClick={() => { setInputVal(btnCmd); }}
              style={{
                background: 'rgba(255, 179, 0, 0.05)',
                border: '1px solid #2c3e50',
                color: '#ffb300',
                fontSize: '0.65rem',
                fontFamily: 'inherit',
                borderRadius: '4px',
                padding: '6px 10px',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              {btnCmd}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Right Status Panel */}
      <div className="zork-hud-panel">
        <div className="zork-panel-title">HUD_VT_SYSTEMS</div>
        
        <div className="zork-gauge-box">
          <div className="zork-gauge-label">
            <span>NEURAL_LOAD</span>
            <span>{cogLoad}%</span>
          </div>
          <div className="zork-gauge-bar-bg">
            <div className="zork-gauge-bar-fill" style={{ width: `${cogLoad}%`, background: cogLoad > 60 ? '#ff5e5e' : '#ffb300' }}></div>
          </div>
        </div>

        <div className="zork-gauge-box">
          <div className="zork-gauge-label">
            <span>THIRST</span>
            <span>{thirst}%</span>
          </div>
          <div className="zork-gauge-bar-bg">
            <div className="zork-gauge-bar-fill" style={{ width: `${thirst}%`, background: thirst > 50 ? '#ffb300' : '#ffb300' }}></div>
          </div>
        </div>

        <div className="zork-gauge-box">
          <div className="zork-gauge-label">
            <span>SANITY</span>
            <span>{sanity}%</span>
          </div>
          <div className="zork-gauge-bar-bg">
            <div className="zork-gauge-bar-fill" style={{ width: `${sanity}%`, background: sanity < 40 ? '#ff5e5e' : '#ffb300' }}></div>
          </div>
        </div>

        {/* Cargo manifest */}
        <div className="zork-panel-title" style={{ marginTop: '16px' }}>CARGO_MANIFEST</div>
        <div className="zork-manifest-item">
          <span>HELP GUIDE</span>
          <span style={{ color: '#6c9a57' }}>AVAIL</span>
        </div>
        <div className="zork-manifest-item">
          <span>FOOD COUPON</span>
          <span style={{ color: '#6c9a57' }}>VALID</span>
        </div>

        {/* Active Priorities checklist */}
        <div className="zork-panel-title" style={{ marginTop: '16px' }}>ACTIVE_PRIORITIES</div>
        <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>🛡️ THE MUSIC SHOW <span style={{ color: '#ffb300', float: 'right' }}>PENDING</span></div>
          <div>🧬 DNA DELIVERY <span style={{ color: '#ffb300', float: 'right' }}>UNRESOLVED</span></div>
          <div>🐾 WILDLIFE OPS <span style={{ color: '#ff5e5e', float: 'right' }}>SEC_LOCK</span></div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 3. FridgeJam - Cozy Ingredients Leftovers Scanner
// ============================================================
const FridgeJamDemo = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [personality, setPersonality] = useState('Fitness Coach');
  const [recipeState, setRecipeState] = useState('idle'); // idle, scanning, generating, generated
  const [gameScore, setGameScore] = useState(0);
  
  // Interactive falling items inside Leftovers Jar mini game
  const [fallingEmoji, setFallingEmoji] = useState('🍅');
  const [fallingLeft, setFallingLeft] = useState(50);

  const ingredientsList = [
    '🥚 Eggs', '🥛 Milk', '🧀 Cheese', '🍗 Chicken', 
    '🍅 Tomato', '🥬 Spinach', '🧈 Butter', '🥦 Broccoli', '🍄 Mushrooms'
  ];

  const emojis = ['🍅', '🥚', '🧀', '🥦', '🍄', '🍗'];

  const toggleIngredient = (ing) => {
    if (selectedIngredients.includes(ing)) {
      setSelectedIngredients(prev => prev.filter(x => x !== ing));
    } else {
      setSelectedIngredients(prev => [...prev, ing]);
    }
  };

  const calculateMacros = () => {
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    selectedIngredients.forEach(ing => {
      if (ing.includes('Eggs')) { protein += 12; fat += 10; carbs += 1; }
      else if (ing.includes('Milk')) { protein += 8; fat += 6; carbs += 12; }
      else if (ing.includes('Cheese')) { protein += 14; fat += 18; carbs += 2; }
      else if (ing.includes('Chicken')) { protein += 30; fat += 8; carbs += 0; }
      else if (ing.includes('Tomato')) { protein += 1; fat += 0; carbs += 5; }
      else if (ing.includes('Spinach')) { protein += 2; fat += 0; carbs += 2; }
      else if (ing.includes('Butter')) { protein += 0; fat += 12; carbs += 0; }
      else if (ing.includes('Broccoli')) { protein += 3; fat += 0; carbs += 6; }
      else if (ing.includes('Mushrooms')) { protein += 2; fat += 0; carbs += 3; }
    });

    const calories = (protein * 4) + (carbs * 4) + (fat * 9);
    return { protein, carbs, fat, calories };
  };

  const handleGenerate = () => {
    if (selectedIngredients.length === 0) return;
    setRecipeState('scanning');
    
    // Scanner runs for 2s, then mini game / recipe generating runs for 4s
    setTimeout(() => {
      setRecipeState('generating');
    }, 2000);

    setTimeout(() => {
      setRecipeState('generated');
    }, 6000);
  };

  // Mini-game click interaction
  const handleEmojiClick = () => {
    setGameScore(s => s + 15);
    const randEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const randLeft = Math.floor(Math.random() * 80) + 10;
    setFallingEmoji(randEmoji);
    setFallingLeft(randLeft);
  };

  const macros = calculateMacros();

  return (
    <div className="chef-cozy-container">
      {/* 1. Left Panel: Cozy wooden fridge */}
      <div className="cozy-wooden-fridge">
        <h4 style={{ margin: '0 0 8px', color: '#5c4d3c', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaUtensils /> Fridge Leftovers
        </h4>
        <p style={{ margin: '0 0 16px', fontSize: '0.75rem', color: '#776b5d' }}>Select remnants inside your cupboard to trigger the multimodal scanner:</p>
        
        <div style={{ flex: 1, position: 'relative' }}>
          <div className="cozy-ingredient-selector">
            {ingredientsList.map((ing, idx) => (
              <span
                key={idx}
                className={`cozy-chip ${selectedIngredients.includes(ing) ? 'selected' : ''}`}
                onClick={() => toggleIngredient(ing)}
              >
                {ing}
              </span>
            ))}
          </div>

          {recipeState === 'scanning' && (
            <div className="cozy-scan-overlay">
              <div className="cozy-scan-beam"></div>
              <strong style={{ color: '#6c9a57', fontSize: '0.8rem', background: 'rgba(255,255,255,0.9)', padding: '6px 12px', border: '1.5px solid #6c9a57', borderRadius: '8px' }}>
                📸 SCANNING INGREDIENTS...
              </strong>
            </div>
          )}
        </div>

        <div style={{ marginTop: '20px', borderTop: '2px solid #f2ede4', paddingTop: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#5c4d3c', marginBottom: '6px' }}>AI Chef Personality:</label>
          <select 
            value={personality} 
            onChange={(e) => setPersonality(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ebd8c2', borderRadius: '8px', fontSize: '0.75rem', color: '#555', background: '#fff' }}
          >
            <option>Fitness Coach (Aggressive macros focus)</option>
            <option>Cozy Grandmother (Warm recipes)</option>
            <option>Michelin Star Chef (High-end culinary)</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={selectedIngredients.length === 0 || recipeState !== 'idle'}
          style={{
            marginTop: '16px',
            width: '100%',
            background: selectedIngredients.length === 0 ? '#d3c5b5' : '#6c9a57',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '12px',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: selectedIngredients.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            boxShadow: '0 4px 10px rgba(108, 154, 87, 0.15)'
          }}
        >
          {recipeState === 'idle' ? 'Scan leftovers & Cook' : (recipeState === 'scanning' ? 'Scanning Image...' : 'AI Chef Thinking...')}
        </button>
      </div>

      {/* 2. Right Panel: Output and Game */}
      <div className="chef-recipe-sheet">
        {recipeState === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#776b5d' }}>
            <FaUtensils style={{ fontSize: '3rem', color: '#ebd8c2', marginBottom: '16px' }} />
            <h4 style={{ margin: '0 0 6px', fontWeight: '800' }}>Ready to Jam!</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', textAlign: 'center', maxWidth: '360px', lineHeight: '1.4' }}>
              Select ingredients from Stephen's mock fridge left side, boot the scanner, and see macro trajectories generate live!
            </p>
          </div>
        )}

        {recipeState === 'scanning' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#776b5d' }}>
            <FaSync className="spin" style={{ fontSize: '2.5rem', color: '#6c9a57', marginBottom: '16px' }} />
            <p style={{ margin: 0, fontSize: '0.8rem' }}>Processing image frames through Gemini-2.5-Flash model API...</p>
          </div>
        )}

        {recipeState === 'generating' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h4 style={{ margin: '0 0 4px', color: '#5c4d3c', fontWeight: '800' }}>🍳 Gemini AI is compiling recipes...</h4>
            <p style={{ margin: '0 0 12px', fontSize: '0.72rem', color: '#776b5d' }}>Tap the dropping leftovers in the **Leftovers Jar** to increase score!</p>
            
            <div className="jar-mini-game">
              <span className="jar-mini-score">GAME SCORE: {gameScore} PTS</span>
              <div 
                className="jar-falling-item" 
                style={{ left: `${fallingLeft}%` }}
                onClick={handleEmojiClick}
              >
                {fallingEmoji}
              </div>
            </div>
            
            <div style={{ marginTop: '12px', fontSize: '0.75rem', fontWeight: 'bold', color: '#6c9a57', textAlign: 'center' }}>
              🏆 Tap emoji items to score +15 points!
            </div>
          </div>
        )}

        {recipeState === 'generated' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ borderBottom: '2px solid #f2ede4', paddingBottom: '12px', marginBottom: '16px' }}>
              <h4 style={{ margin: 0, color: '#6c9a57', fontSize: '1.3rem', fontWeight: '800' }}>🍳 Leftover Chef's Frittata ({personality.split(' ')[0]})</h4>
              <span style={{ fontSize: '0.72rem', color: '#888' }}>Gemini-2.5-Flash Multimodal leftovers analysis result</span>
            </div>

            <div className="macro-box">
              <div>
                <div className="macro-item-val">{macros.calories}</div>
                <div className="macro-item-lbl">Calories</div>
              </div>
              <div>
                <div className="macro-item-val">{macros.protein}g</div>
                <div className="macro-item-lbl">Protein</div>
              </div>
              <div>
                <div className="macro-item-val">{macros.carbs}g</div>
                <div className="macro-item-lbl">Carbs</div>
              </div>
              <div>
                <div className="macro-item-val">{macros.fat}g</div>
                <div className="macro-item-lbl">Fats</div>
              </div>
            </div>

            <div style={{ flex: 1, fontSize: '0.8rem', color: '#4a4947', lineHeight: '1.6' }}>
              <strong style={{ color: '#5c4d3c' }}>Custom Culinary Recommendation:</strong>
              <p style={{ margin: '4px 0 12px' }}>
                Based on your remaining ingredients (<strong>{selectedIngredients.join(', ')}</strong>), we suggest a skillet-baked frittata. Baked items require minimal preparation and maximize remaining nutrition indices.
              </p>
              <strong style={{ color: '#5c4d3c' }}>Directions:</strong>
              <ol style={{ margin: '6px 0', paddingLeft: '16px' }}>
                <li>Whisk the eggs with a splash of milk and pour over sautéed leftovers.</li>
                <li>Fold in spinach, mushrooms, and top with cheese.</li>
                <li>Bake at 350°F for 14 minutes until gold brown. Export cooks-sheet.</li>
              </ol>
            </div>

            <button 
              onClick={() => alert("Downloading PDF Cookbook template...")}
              style={{
                marginTop: '16px',
                background: '#fdfaf6',
                border: '1.5px solid #ecdac6',
                borderRadius: '8px',
                padding: '10px',
                fontWeight: 'bold',
                color: '#5c4d3c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              <FaFilePdf /> Export Print-Ready Cookbook PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// 4. FinTracker - Dual Dashboard & Advisor Simulation
// ============================================================
const FinTrackerDemo = () => {
  const [consoleLogs, setConsoleLogs] = useState([
    "FinTracker personal wealth client v1.0 [FastAPI active]",
    "Type \"help\" to display transaction logs CLI commands."
  ]);
  const [inputVal, setInputVal] = useState('');
  const [expenses, setExpenses] = useState([
    { name: 'Groceries', value: 80 },
    { name: 'Subscriptions', value: 35 },
    { name: 'Dining Out', value: 45 }
  ]);
  const [alerts, setAlerts] = useState([
    "⚠️ Warning: Duplicate monthly bills flagged: Netflix Inc. ($15.99) charged twice.",
    "💡 Tip: Safest daily spend target adjusted to $42.50 to clear subscription cycles."
  ]);

  const handleCommand = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const cmd = inputVal.trim();
    setInputVal('');
    const tokens = cmd.split(' ');
    const action = tokens[0].toLowerCase();

    let output = `Command not recognized. Type 'help'.`;

    if (action === 'help') {
      output = "FASTAPI ENDPOINT ARGUMENTS: add <amount> <category> | show | limit <value> | reset";
    } else if (action === 'show') {
      output = "LEDGER: " + expenses.map(e => `${e.name}: $${e.value}`).join(' // ');
    } else if (action === 'add') {
      const val = parseFloat(tokens[1]);
      const cat = tokens.slice(2).join(' ') || 'General';

      if (isNaN(val)) {
        output = "Usage error: add [amount] [category]";
      } else {
        setExpenses(prev => {
          const match = prev.find(e => e.name.toLowerCase() === cat.toLowerCase());
          if (match) {
            return prev.map(e => e.name.toLowerCase() === cat.toLowerCase() ? { ...e, value: e.value + val } : e);
          } else {
            return [...prev, { name: cat, value: val }];
          }
        });
        output = `FastAPI Pydantic verified. Added $${val} to '${cat}'.`;

        if (cat.toLowerCase().includes('sub') || cat.toLowerCase().includes('trial')) {
          setAlerts(prev => [
            ...prev,
            `💡 Alert: AI flagged subscription trial: '${cat}' renews on June 1. Cancel before billing.`
          ]);
        }
      }
    } else if (action === 'limit') {
      const limit = parseFloat(tokens[1]);
      if (isNaN(limit)) {
        output = "Usage error: limit [value]";
      } else {
        output = `DAILY SAFE-TO-SPEND LIMIT configured to $${limit}/day.`;
      }
    } else if (action === 'reset') {
      setExpenses([{ name: 'General', value: 0 }]);
      output = "Ledger databases purged.";
    }

    setConsoleLogs(prev => [
      ...prev,
      `$ ${cmd}`,
      output
    ]);
  };

  return (
    <div className="fintracker-dark-view">
      {/* Left: Terminal quick logger */}
      <div className="fintracker-cli-container">
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', fontSize: '0.8rem', color: '#ffb300', fontWeight: 'bold' }}>
          <FaTerminal /> Python CLI Wealth Logger
        </div>
        <div style={{ flex: 1, overflowY: 'auto', fontSize: '0.75rem', lineHeight: '1.45', marginBottom: '12px' }}>
          {consoleLogs.map((log, idx) => (
            <div key={idx} style={{ color: log.startsWith('$') ? '#38bdf8' : '#fff' }}>{log}</div>
          ))}
        </div>
        <form onSubmit={handleCommand} style={{ display: 'flex', borderTop: '1px solid #111a2e', paddingTop: '10px' }}>
          <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>$</span>
          <input 
            type="text" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="add 30 food..." 
            className="fintracker-cli-input"
          />
        </form>
      </div>

      {/* Right: Premium dashboard view */}
      <div className="fintracker-glass-card">
        <h4 style={{ margin: '0 0 10px', color: '#38bdf8', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Asset Allocations Trajectory</h4>
        
        {/* Dynamic bar charts */}
        <div className="chart-area-mock">
          {expenses.map((e, idx) => {
            const height = Math.min(100, Math.max(10, (e.value / 180) * 100));
            return (
              <div 
                key={idx} 
                className="finance-chart-bar" 
                style={{ height: `${height}%`, background: 'linear-gradient(180deg, #38bdf8, #0369a1)', width: '30px' }}
                data-label={e.name}
              ></div>
            );
          })}
        </div>

        {/* Dynamic advisor flags */}
        <div style={{ marginTop: '20px', flex: 1, overflowY: 'auto' }}>
          {alerts.map((al, idx) => (
            <div key={idx} className="ai-alert-banner" style={{ background: 'rgba(255, 179, 0, 0.05)', border: '1px solid rgba(255, 179, 0, 0.25)', color: '#ffd066' }}>
              <FaExclamationTriangle style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{al}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 5. Portfolio Website - Theme swapper & PageSpeed Simulator
// ============================================================
const PortfolioDemo = () => {
  const [activeAccent, setActiveAccent] = useState('Sage');
  const [auditState, setAuditState] = useState('idle');
  const [lcp, setLcp] = useState(0);
  const [inp, setInp] = useState(0);
  const [seo, setSeo] = useState(0);
  const [a11y, setA11y] = useState(0);

  const colors = {
    Sage: '#6c9a57',
    Cyber: '#0899e7',
    Crimson: '#e83e8c'
  };

  const handleAudit = () => {
    setAuditState('running');
    setLcp(10);
    setInp(20);
    setSeo(15);
    setA11y(25);
    
    let timer = setInterval(() => {
      setLcp(prev => {
        if (prev >= 99) {
          clearInterval(timer);
          setAuditState('audited');
          return 99;
        }
        return prev + 5;
      });
      setInp(prev => Math.min(98, prev + 6));
      setSeo(prev => Math.min(100, prev + 5));
      setA11y(prev => Math.min(100, prev + 4));
    }, 120);
  };

  return (
    <div className="portfolio-grid" style={{ padding: '24px', boxSizing: 'border-box' }}>
      <div className="swatch-card" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <FaPalette style={{ fontSize: '2.5rem', color: colors[activeAccent], transition: 'color 0.3s' }} />
        <h4 style={{ margin: '12px 0 6px', fontSize: '0.95rem', fontWeight: '800' }}>Portfolio Brand Swapper</h4>
        <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: '1.4' }}>
          Swap global CSS theme variables. Watch anchors and indicators align instantly:
        </p>
        <div className="swatch-group">
          {Object.keys(colors).map((themeName) => (
            <button
              key={themeName}
              className={`swatch-btn ${activeAccent === themeName ? 'active' : ''}`}
              style={{ backgroundColor: colors[themeName], border: 'none' }}
              onClick={() => {
                setActiveAccent(themeName);
                document.documentElement.style.setProperty('--portfolio-accent', colors[themeName]);
                const heroName = document.querySelector('.hero h1:nth-child(3)');
                if (heroName) heroName.style.color = colors[themeName];
              }}
            />
          ))}
        </div>
        <div style={{ marginTop: '20px', fontSize: '0.75rem', fontFamily: 'monospace' }}>
          THEME: <strong style={{ color: colors[activeAccent] }}>{activeAccent.toUpperCase()} ACTIVE</strong>
        </div>
      </div>

      <div className="lighthouse-card" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
          <h4 style={{ margin: 0, color: '#c9ec9e', fontSize: '0.9rem', fontWeight: '800' }}>Lighthouse PageSpeed Dials</h4>
          <button 
            onClick={handleAudit} 
            disabled={auditState === 'running'}
            style={{
              background: colors[activeAccent],
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.72rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {auditState === 'running' ? 'AUDITING...' : 'RUN METRICS'}
          </button>
        </div>
        
        {auditState === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'rgba(255,255,255,0.3)', padding: '20px 0' }}>
            <FaTachometerAlt style={{ fontSize: '2.5rem', marginBottom: '10px' }} />
            <p style={{ margin: 0, fontSize: '0.72rem', textAlign: 'center' }}>Test performance, SEO, accessibility, and loading structures natively.</p>
          </div>
        )}

        {(auditState === 'running' || auditState === 'audited') && (
          <div className="lighthouse-dial-container">
            <div className="lighthouse-dial">
              <div className="dial-circle excellent" style={{ '--percentage': lcp }}>
                {lcp}
              </div>
              <span className="dial-label" style={{ fontSize: '0.6rem' }}>Performance</span>
            </div>
            <div className="lighthouse-dial">
              <div className="dial-circle excellent" style={{ '--percentage': a11y }}>
                {a11y}
              </div>
              <span className="dial-label" style={{ fontSize: '0.6rem' }}>Accessibility</span>
            </div>
            <div className="lighthouse-dial">
              <div className="dial-circle excellent" style={{ '--percentage': inp }}>
                {inp}
              </div>
              <span className="dial-label" style={{ fontSize: '0.6rem' }}>Best Practices</span>
            </div>
            <div className="lighthouse-dial">
              <div className="dial-circle excellent" style={{ '--percentage': seo }}>
                {seo}
              </div>
              <span className="dial-label" style={{ fontSize: '0.6rem' }}>SEO</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDemoModal;
