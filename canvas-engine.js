// Canvas Cinematic Engine - 60 FPS Procedural Daylight Music Video Visualizer
// Stable Camera, Scenic Assam Daylight Landscapes, Bamboo, Country Boat, Flowing Brahmaputra

class CinematicEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.width = canvas.width;
    this.height = canvas.height;
    this.aspectRatio = '16:9'; // '16:9' or '9:16'
    
    // Engine State
    this.currentTime = 0;
    this.activeScene = null;
    this.activeLyric = null;
    this.styleMode = 'cinematic'; // 'cinematic' | 'watercolor' | 'neon' | 'minimal'
    this.lyricMode = 'romanized'; // 'romanized' | 'assamese' | 'english' | 'dual'
    this.lyricFont = 'cinzel'; // 'cinzel' | 'playfair' | 'caveat' | 'syne' | 'outfit'
    this.lyricPresentation = 'floating'; // 'floating' | 'karaoke' | 'ribbon' | 'kinetic' | 'subtitle'
    this.lightingMode = 'daylight'; // 'daylight' | 'golden' | 'twilight'
    this.filmGrainEnabled = false; // default clean & crisp
    this.letterboxEnabled = true;
    this.fogDensity = 0.5;
    this.particleSpeed = 1.0;
    
    // Audio Reactivity (Smooth, non-jittery)
    this.audioData = {
      bass: 0,
      mid: 0,
      treble: 0,
      energy: 0,
      spectrum: new Uint8Array(64)
    };
    
    // Camera System (COMPLETELY STABLE)
    this.camera = {
      x: 0,
      y: 0,
      zoom: 1,
      targetZoom: 1,
      shake: 0 // Kept 0 for complete stability
    };
    
    // Daylight Clouds & Particles
    this.clouds = [];
    this.petals = [];
    this.birds = [];
    this.sparkles = [];
    
    this.initDaylightElements();
  }

  setDimensions(width, height, aspectRatio = '16:9') {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.aspectRatio = aspectRatio;
    this.initDaylightElements();
  }

  initDaylightElements() {
    const isPortrait = this.aspectRatio === '9:16';
    const countMultiplier = isPortrait ? 0.7 : 1.0;

    // Fluffy Daylight Clouds
    this.clouds = [];
    const cloudCount = 6;
    for (let i = 0; i < cloudCount; i++) {
      this.clouds.push({
        x: (i / cloudCount) * this.width * 1.4 - this.width * 0.2,
        y: this.height * (0.08 + (i % 3) * 0.1),
        scale: 0.8 + Math.random() * 0.6,
        speed: 0.18 + Math.random() * 0.15,
        alpha: 0.55 + Math.random() * 0.35
      });
    }

    // Drifting Champa Petals
    this.petals = [];
    const petalCount = Math.floor(40 * countMultiplier);
    for (let i = 0; i < petalCount; i++) {
      this.petals.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        z: Math.random() * 1.5 + 0.6,
        vx: -(Math.random() * 1.2 + 0.5),
        vy: Math.random() * 0.8 + 0.4,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        size: Math.random() * 12 + 10,
        flip: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.02 + 0.01
      });
    }

    // Water sunlight glints / sparkles
    this.sparkles = [];
    const sparkleCount = Math.floor(45 * countMultiplier);
    for (let i = 0; i < sparkleCount; i++) {
      this.sparkles.push({
        x: Math.random() * this.width,
        y: this.height * 0.58 + Math.random() * (this.height * 0.4),
        size: Math.random() * 2.5 + 1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 3 + 2
      });
    }

    // Flying Birds (Kuli / Cuckoos)
    this.birds = [
      { x: -50, y: this.height * 0.22, speed: 1.8, flapSpeed: 8, scale: 0.9 },
      { x: -180, y: this.height * 0.18, speed: 1.5, flapSpeed: 7, scale: 0.7 },
      { x: -320, y: this.height * 0.26, speed: 2.1, flapSpeed: 9, scale: 0.8 }
    ];

    // Drifting Kash Grass (Kohua) Feathery Seed Fluff
    this.kashSeeds = [];
    const seedCount = Math.floor(32 * countMultiplier);
    for (let i = 0; i < seedCount; i++) {
      this.kashSeeds.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: -(Math.random() * 0.8 + 0.4),
        vy: (Math.random() - 0.45) * 0.35,
        size: Math.random() * 7 + 5,
        alpha: Math.random() * 0.5 + 0.45,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  updateAudioData(analyser) {
    if (!analyser) return;
    analyser.getByteFrequencyData(this.audioData.spectrum);
    
    // Smooth Bass
    let bassSum = 0;
    for (let i = 0; i < 8; i++) bassSum += this.audioData.spectrum[i];
    const newBass = bassSum / (8 * 255);
    this.audioData.bass = this.audioData.bass * 0.85 + newBass * 0.15; // Smooth interpolation
    
    // Smooth Mid
    let midSum = 0;
    for (let i = 8; i < 32; i++) midSum += this.audioData.spectrum[i];
    const newMid = midSum / (24 * 255);
    this.audioData.mid = this.audioData.mid * 0.85 + newMid * 0.15;
    
    // Treble
    let trebleSum = 0;
    for (let i = 32; i < 64; i++) trebleSum += this.audioData.spectrum[i];
    const newTreble = trebleSum / (32 * 255);
    this.audioData.treble = this.audioData.treble * 0.85 + newTreble * 0.15;
    
    this.audioData.energy = (this.audioData.bass * 0.5) + (this.audioData.mid * 0.3) + (this.audioData.treble * 0.2);
    
    // CAMERA IS COMPLETELY STABLE (No shake)
    this.camera.shake = 0;
  }

  render(currentTime, activeScene, activeLyric) {
    this.currentTime = currentTime;
    this.activeScene = activeScene || BOHONA_DATA.scenes[0];
    this.activeLyric = activeLyric;

    // COMPLETELY STABLE CAMERA: No random shake, no violent vibration
    this.ctx.save();

    // RENDER SCENIC DAYLIGHT LAYERS
    this.drawDaylightSky();
    this.drawSunAndSunbeams();
    this.drawDaylightClouds();
    this.drawDistantMountains();
    this.drawLushGreenHills();
    this.drawCenterFloatingRiver();
    this.drawBothSideRiverbanks();
    this.drawBambooPalingsBothSides();
    this.drawKashGrassBothSides();
    this.drawAssameseCountryBoat();
    this.drawVillagePoduliGate();
    this.drawFlyingBirds();
    this.drawDriftingChampaPetals();
    this.drawFloatingKashFluff();
    this.drawGentleAudioReflections();
    this.drawLyricsOverlay();
    this.drawCinematicHUD();

    if (this.letterboxEnabled && this.aspectRatio === '16:9') {
      this.drawAnamorphicLetterbox();
    }

    this.ctx.restore();
  }

  // LAYER 1: VIBRANT DAYLIGHT SKY
  drawDaylightSky() {
    const pal = this.activeScene.colorPalette;
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.height * 0.6);

    if (this.styleMode === 'watercolor') {
      grad.addColorStop(0, '#70a1ff');
      grad.addColorStop(0.6, '#a4b0be');
      grad.addColorStop(1, '#dfe4ea');
    } else if (this.styleMode === 'neon') {
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.6, '#1e293b');
      grad.addColorStop(1, '#334155');
    } else {
      // Natural Radiant Assam Daylight Sky
      grad.addColorStop(0, pal.skyTop || '#1e60c6');
      grad.addColorStop(0.6, pal.skyBottom || '#8ec5fc');
      grad.addColorStop(1, '#e0f2fe'); // Soft radiant horizon
    }

    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // LAYER 2: GLOWING SUN & WARM SUNBEAMS (GOD RAYS)
  drawSunAndSunbeams() {
    const sunX = this.width * 0.78;
    const sunY = this.height * 0.24;
    const time = this.currentTime;
    const bass = this.audioData.bass;

    this.ctx.save();

    // Warm Volumetric Sunrays streaming down
    const rayCount = 8;
    for (let i = 0; i < rayCount; i++) {
      const angle = 0.55 + (i / rayCount) * 0.95;
      const rayLen = this.height * 0.9;
      const raySpread = 0.08 + Math.sin(time * 0.5 + i) * 0.02;

      const grad = this.ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, rayLen);
      grad.addColorStop(0, 'rgba(255, 255, 240, 0.22)');
      grad.addColorStop(0.5, 'rgba(255, 245, 210, 0.08)');
      grad.addColorStop(1, 'rgba(255, 245, 210, 0)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.moveTo(sunX, sunY);
      this.ctx.lineTo(sunX + Math.cos(angle - raySpread) * rayLen, sunY + Math.sin(angle - raySpread) * rayLen);
      this.ctx.lineTo(sunX + Math.cos(angle + raySpread) * rayLen, sunY + Math.sin(angle + raySpread) * rayLen);
      this.ctx.closePath();
      this.ctx.fill();
    }

    // Outer Sun Glow Corona
    const sunGlow = this.ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 240);
    sunGlow.addColorStop(0, 'rgba(255, 255, 220, 0.95)');
    sunGlow.addColorStop(0.2, 'rgba(255, 235, 150, 0.6)');
    sunGlow.addColorStop(0.6, 'rgba(255, 220, 100, 0.15)');
    sunGlow.addColorStop(1, 'rgba(255, 220, 100, 0)');
    this.ctx.fillStyle = sunGlow;
    this.ctx.beginPath();
    this.ctx.arc(sunX, sunY, 240, 0, Math.PI * 2);
    this.ctx.fill();

    // Brilliant Sun Core
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(sunX, sunY, 36, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  // LAYER 3: FLUFFY DAYLIGHT CUMULUS CLOUDS
  drawDaylightClouds() {
    this.ctx.save();
    const speed = this.particleSpeed;

    for (let c of this.clouds) {
      c.x += c.speed * speed;
      if (c.x > this.width + 250) {
        c.x = -250;
      }

      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.scale(c.scale, c.scale * 0.7);

      this.ctx.fillStyle = `rgba(255, 255, 255, ${c.alpha})`;
      this.ctx.beginPath();
      // Fluffy rounded cloud puffs
      this.ctx.arc(0, 0, 45, 0, Math.PI * 2);
      this.ctx.arc(38, -12, 38, 0, Math.PI * 2);
      this.ctx.arc(80, 0, 42, 0, Math.PI * 2);
      this.ctx.arc(120, 10, 30, 0, Math.PI * 2);
      this.ctx.arc(-35, 10, 32, 0, Math.PI * 2);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.restore();
    }

    this.ctx.restore();
  }

  // LAYER 4: DISTANT MISTY MOUNTAINS (Himalayan Foothills of Assam)
  drawDistantMountains() {
    const horizon = this.height * 0.56;
    this.ctx.save();

    // Far misty ridge (Light atmospheric blue-green)
    const farGrad = this.ctx.createLinearGradient(0, horizon - 90, 0, horizon);
    farGrad.addColorStop(0, '#60a5fa');
    farGrad.addColorStop(1, '#93c5fd');
    this.ctx.fillStyle = farGrad;

    this.ctx.beginPath();
    this.ctx.moveTo(0, horizon);
    for (let x = 0; x <= this.width; x += 50) {
      const y = horizon - 70 - Math.sin(x * 0.0025 + 0.8) * 45 - Math.cos(x * 0.006) * 18;
      this.ctx.lineTo(x, y);
    }
    this.ctx.lineTo(this.width, this.height);
    this.ctx.lineTo(0, this.height);
    this.ctx.fill();

    this.ctx.restore();
  }

  // LAYER 5: LUSH EMERALD GREEN HILLS & PADDY FIELDS ("Potharoloi...")
  drawLushGreenHills() {
    const horizon = this.height * 0.54;
    this.ctx.save();

    // Mid-ground green hills (Tea gardens & lush evergreen forests)
    const midGrad = this.ctx.createLinearGradient(0, horizon - 50, 0, horizon);
    midGrad.addColorStop(0, '#15803d'); // Deep vibrant green
    midGrad.addColorStop(1, '#16a34a'); // Fresh tea leaf green
    this.ctx.fillStyle = midGrad;

    this.ctx.beginPath();
    this.ctx.moveTo(0, horizon);
    for (let x = 0; x <= this.width; x += 35) {
      const y = horizon - 35 - Math.sin(x * 0.005 + 2.2) * 25 - Math.sin(x * 0.012) * 10;
      this.ctx.lineTo(x, y);
    }
    this.ctx.lineTo(this.width, horizon + 4);
    this.ctx.lineTo(0, horizon + 4);
    this.ctx.fill();

    // Shoreline golden-green paddy field fringe ("Potharoloi kak more bohona")
    const paddyGrad = this.ctx.createLinearGradient(0, horizon - 12, 0, horizon + 6);
    paddyGrad.addColorStop(0, '#65a30d'); // Golden-green young paddy
    paddyGrad.addColorStop(1, '#84cc16'); // Sunlit chartreuse
    this.ctx.fillStyle = paddyGrad;

    this.ctx.beginPath();
    this.ctx.moveTo(0, horizon);
    for (let x = 0; x <= this.width; x += 25) {
      const y = horizon - 12 - Math.sin(x * 0.008 + 1.4) * 8;
      this.ctx.lineTo(x, y);
    }
    this.ctx.lineTo(this.width, horizon + 4);
    this.ctx.lineTo(0, horizon + 4);
    this.ctx.fill();

    this.ctx.restore();
  }

  // HELPER: Riverbank boundary curves at vertical coordinate y
  getRiverBankBounds(y) {
    const horizon = this.height * 0.54;
    const t = Math.max(0, Math.min(1, (y - horizon) / (this.height - horizon)));

    // Perspective river channel:
    // Near horizon (t=0): starts in middle between ~0.36*width and 0.64*width
    // At foreground (t=1): widens to ~0.18*width and 0.82*width
    const leftBase = this.width * (0.36 - t * 0.18);
    const rightBase = this.width * (0.64 + t * 0.18);

    // Natural gentle Assamese river meander
    const meander = Math.sin(t * Math.PI * 1.5) * (this.width * 0.022);

    return {
      left: leftBase + meander,
      right: rightBase + meander,
      width: rightBase - leftBase,
      t: t
    };
  }

  // LAYER 6: MIDDLE FLOATING RIVER (BRAHMAPUTRA FLOWING DOWN THE CENTER)
  drawCenterFloatingRiver() {
    const horizon = this.height * 0.54;
    const time = this.currentTime;
    const steps = 30;

    this.ctx.save();

    // 1. Build Central River Path
    this.ctx.beginPath();
    const topBounds = this.getRiverBankBounds(horizon);
    this.ctx.moveTo(topBounds.left, horizon);

    // Down left riverbank edge
    for (let i = 0; i <= steps; i++) {
      const y = horizon + (i / steps) * (this.height - horizon);
      const b = this.getRiverBankBounds(y);
      this.ctx.lineTo(b.left, y);
    }

    // Along bottom foreground
    const botBounds = this.getRiverBankBounds(this.height);
    this.ctx.lineTo(botBounds.right, this.height);

    // Up right riverbank edge
    for (let i = steps; i >= 0; i--) {
      const y = horizon + (i / steps) * (this.height - horizon);
      const b = this.getRiverBankBounds(y);
      this.ctx.lineTo(b.right, y);
    }
    this.ctx.closePath();

    // Fill with rich daylight Brahmaputra river blue
    const riverGrad = this.ctx.createLinearGradient(0, horizon, 0, this.height);
    riverGrad.addColorStop(0, '#2563eb'); // Brilliant azure blue at horizon
    riverGrad.addColorStop(0.35, '#1d4ed8');
    riverGrad.addColorStop(0.7, '#0284c7'); // Sunlit cyan-blue
    riverGrad.addColorStop(1, '#0f317b'); // Deep foreground blue
    this.ctx.fillStyle = riverGrad;
    this.ctx.fill();

    // Clip to river channel for surface effects & waves
    this.ctx.save();
    this.ctx.clip();

    // Daylight Sunbeam Reflection Path flowing down the middle-right of the river
    const sunReflX = this.width * 0.56;
    const reflGrad = this.ctx.createLinearGradient(sunReflX - 90, horizon, sunReflX + 90, horizon);
    reflGrad.addColorStop(0, 'rgba(254, 240, 138, 0)');
    reflGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.38)');
    reflGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    this.ctx.fillStyle = reflGrad;
    this.ctx.fillRect(sunReflX - 100, horizon, 200, this.height - horizon);

    // Flowing River Current & Wave Ripples
    const waveCount = 28;
    for (let i = 0; i < waveCount; i++) {
      const p = i / waveCount;
      const y = horizon + Math.pow(p, 1.4) * (this.height - horizon);
      const b = this.getRiverBankBounds(y);
      const waveSpeed = time * (1.3 + p * 1.6);
      const amp = (p * 4.2 + 0.9);

      this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.14 + p * 0.22})`;
      this.ctx.lineWidth = 1.4 + p * 1.8;

      this.ctx.beginPath();
      this.ctx.moveTo(b.left, y + Math.sin(waveSpeed) * amp);
      const segs = 20;
      for (let s = 0; s <= segs; s++) {
        const x = b.left + (s / segs) * (b.right - b.left);
        const wave = Math.sin(x * 0.015 + waveSpeed) * amp;
        this.ctx.lineTo(x, y + wave);
      }
      this.ctx.stroke();
    }

    // Sparkling Sun Glints in Middle River
    for (let sp of this.sparkles) {
      const b = this.getRiverBankBounds(sp.y);
      const riverW = b.right - b.left;
      const sx = b.left + (Math.abs(Math.sin(sp.x)) * riverW * 0.9 + riverW * 0.05);
      const twinkle = Math.sin(time * sp.speed + sp.phase) * 0.5 + 0.5;
      if (twinkle > 0.35) {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.9})`;
        this.ctx.beginPath();
        this.ctx.arc(sx, sp.y, sp.size * twinkle, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.ctx.restore(); // remove clip
    this.ctx.restore();
  }

  // LAYER 7: RIVERBANKS ON BOTH SIDES OF THE FLOATING RIVER
  drawBothSideRiverbanks() {
    const horizon = this.height * 0.54;
    const steps = 30;
    this.ctx.save();

    // --- LEFT RIVERBANK ---
    this.ctx.beginPath();
    this.ctx.moveTo(0, horizon);
    for (let i = 0; i <= steps; i++) {
      const y = horizon + (i / steps) * (this.height - horizon);
      const b = this.getRiverBankBounds(y);
      this.ctx.lineTo(b.left, y);
    }
    this.ctx.lineTo(0, this.height);
    this.ctx.closePath();

    const leftGrad = this.ctx.createLinearGradient(0, horizon, this.width * 0.35, this.height);
    leftGrad.addColorStop(0, '#15803d'); // Deep vibrant grassy green
    leftGrad.addColorStop(0.6, '#16a34a'); // Lush daylight pasture
    leftGrad.addColorStop(1, '#166534');
    this.ctx.fillStyle = leftGrad;
    this.ctx.fill();

    // Sandy Shoreline Trim on Left Bank Water's Edge
    this.ctx.strokeStyle = '#ca8a04'; // Warm golden-ochre river sand
    this.ctx.lineWidth = 3.5;
    this.ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const y = horizon + (i / steps) * (this.height - horizon);
      const b = this.getRiverBankBounds(y);
      if (i === 0) this.ctx.moveTo(b.left, y);
      else this.ctx.lineTo(b.left, y);
    }
    this.ctx.stroke();

    // --- RIGHT RIVERBANK ---
    this.ctx.beginPath();
    this.ctx.moveTo(this.width, horizon);
    for (let i = 0; i <= steps; i++) {
      const y = horizon + (i / steps) * (this.height - horizon);
      const b = this.getRiverBankBounds(y);
      this.ctx.lineTo(b.right, y);
    }
    this.ctx.lineTo(this.width, this.height);
    this.ctx.closePath();

    const rightGrad = this.ctx.createLinearGradient(this.width, horizon, this.width * 0.65, this.height);
    rightGrad.addColorStop(0, '#15803d');
    rightGrad.addColorStop(0.6, '#16a34a');
    rightGrad.addColorStop(1, '#166534');
    this.ctx.fillStyle = rightGrad;
    this.ctx.fill();

    // Sandy Shoreline Trim on Right Bank Water's Edge
    this.ctx.strokeStyle = '#ca8a04';
    this.ctx.lineWidth = 3.5;
    this.ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const y = horizon + (i / steps) * (this.height - horizon);
      const b = this.getRiverBankBounds(y);
      if (i === 0) this.ctx.moveTo(b.right, y);
      else this.ctx.lineTo(b.right, y);
    }
    this.ctx.stroke();

    this.ctx.restore();
  }

  // LAYER 8: BAMBOO PALING & BAMBOO HEDGE ON BOTH SIDES OF THE RIVER
  drawBambooPalingsBothSides() {
    const horizon = this.height * 0.54;
    const time = this.currentTime;
    const postCount = 22; // Posts distributed along the riverbank curve

    this.ctx.save();

    // --- LEFT SIDE BAMBOO PALING / HEDGE ---
    this.drawSideBambooPaling(true, postCount, horizon, time);

    // --- RIGHT SIDE BAMBOO PALING / HEDGE ---
    this.drawSideBambooPaling(false, postCount, horizon, time);

    this.ctx.restore();
  }

  drawSideBambooPaling(isLeft, count, horizon, time) {
    const postCoords = [];

    // Calculate perspective positions along the riverbank curve
    for (let i = 0; i < count; i++) {
      const p = i / (count - 1);
      const t = Math.pow(p, 1.25);
      const y = horizon + 12 + t * (this.height - horizon - 20);
      const bounds = this.getRiverBankBounds(y);
      // Offset slightly on the riverbank edge
      const offset = isLeft ? - (12 + t * 20) : (12 + t * 20);
      const x = (isLeft ? bounds.left : bounds.right) + offset;
      const scale = 0.32 + t * 0.95; // Perspective scaling
      const height = (52 + Math.sin(i * 1.9) * 10) * scale;
      postCoords.push({ x, y, scale, height, t, i });
    }

    // 1. Horizontal Bamboo Split Rails connecting the posts
    for (let railLevel of [0.35, 0.72]) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = '#a16207'; // Sunlit dried bamboo pole rail
      this.ctx.lineWidth = 3.0;

      for (let idx = 0; idx < postCoords.length; idx++) {
        const pt = postCoords[idx];
        const ry = pt.y - pt.height * railLevel;
        if (idx === 0) this.ctx.moveTo(pt.x, ry);
        else this.ctx.lineTo(pt.x, ry);
      }
      this.ctx.stroke();

      // Top rail highlight
      this.ctx.strokeStyle = '#ca8a04';
      this.ctx.lineWidth = 1.4;
      this.ctx.stroke();
    }

    // 2. Cross-diagonal Bamboo Ties (Paling lattice / hedge diagonal braces)
    this.ctx.strokeStyle = 'rgba(161, 98, 7, 0.75)';
    this.ctx.lineWidth = 1.8;
    for (let idx = 0; idx < postCoords.length - 1; idx++) {
      const p1 = postCoords[idx];
      const p2 = postCoords[idx + 1];
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y - p1.height * 0.2);
      this.ctx.lineTo(p2.x, p2.y - p2.height * 0.85);
      this.ctx.stroke();
    }

    // 3. Vertical Bamboo Posts (Paling stakes)
    for (let pt of postCoords) {
      const pw = Math.max(3.5, 7.5 * pt.scale);
      const sway = Math.sin(time * 1.5 + pt.i * 0.3) * (0.8 * pt.scale);

      this.ctx.save();
      this.ctx.translate(pt.x, pt.y);

      // Shadow on bank
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      this.ctx.beginPath();
      this.ctx.ellipse(0, 2, pw * 1.8, pw * 0.7, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Bamboo Post Body (Green-gold sunlit bamboo stalk)
      const postGrad = this.ctx.createLinearGradient(-pw/2, 0, pw/2, 0);
      postGrad.addColorStop(0, '#4d7c0f'); // Green bamboo skin
      postGrad.addColorStop(0.35, '#84cc16'); // Sunlit golden green highlight
      postGrad.addColorStop(0.7, '#65a30d');
      postGrad.addColorStop(1, '#365314'); // Shaded edge

      this.ctx.fillStyle = postGrad;
      this.ctx.beginPath();
      this.ctx.moveTo(-pw/2, 0);
      this.ctx.lineTo(-pw/2 + sway, -pt.height);
      // Angled sharp bamboo cut at the top
      this.ctx.lineTo(pw/2 + sway, -pt.height + (isLeft ? -4 : 4) * pt.scale);
      this.ctx.lineTo(pw/2, 0);
      this.ctx.closePath();
      this.ctx.fill();

      // Bamboo Nodes / Rings along the post
      const nodeCount = 3;
      for (let n = 1; n <= nodeCount; n++) {
        const ny = -pt.height * (n / (nodeCount + 1));
        const nx = sway * (n / (nodeCount + 1));
        this.ctx.strokeStyle = '#14532d';
        this.ctx.lineWidth = Math.max(1.5, 2.5 * pt.scale);
        this.ctx.beginPath();
        this.ctx.moveTo(nx - pw * 0.65, ny);
        this.ctx.lineTo(nx + pw * 0.65, ny);
        this.ctx.stroke();

        // Cane cord binding knot at node intersection with rail
        this.ctx.fillStyle = '#78350f';
        this.ctx.beginPath();
        this.ctx.arc(nx, ny, Math.max(1.8, 3.2 * pt.scale), 0, Math.PI * 2);
        this.ctx.fill();
      }

      // 4. Fresh Leafy Bamboo Hedge Shoots sprouting along the paling
      if (pt.i % 2 === 0) {
        this.drawBambooHedgeLeaves(sway, -pt.height * 0.75, pt.scale, isLeft ? 1 : -1, time + pt.i);
      }

      this.ctx.restore();
    }
  }

  // Fresh green bamboo hedge leaves sprouting from paling posts
  drawBambooHedgeLeaves(x, y, scale, dir, time) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.scale(scale, scale);

    const leafCount = 4;
    for (let l = 0; l < leafCount; l++) {
      const angle = (dir * 0.45) + (l * 0.35 * dir) + Math.sin(time * 2.2 + l) * 0.12;
      const leafLen = 22 + (l % 2) * 8;

      this.ctx.fillStyle = '#22c55e'; // Fresh vibrant bamboo leaf
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.quadraticCurveTo(
        Math.cos(angle) * leafLen * 0.5 + 4 * dir,
        Math.sin(angle) * leafLen * 0.5 - 3,
        Math.cos(angle) * leafLen,
        Math.sin(angle) * leafLen
      );
      this.ctx.quadraticCurveTo(
        Math.cos(angle) * leafLen * 0.5 - 3 * dir,
        Math.sin(angle) * leafLen * 0.5 + 2,
        0,
        0
      );
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  // LAYER 9: DENSE FIELDS OF WILD SUGARCANE / KASH GRASS (KOHUA BON) ON BOTH SIDES
  drawKashGrassBothSides() {
    const time = this.currentTime;
    const horizon = this.height * 0.54;
    this.ctx.save();

    // 1. LEFT SIDE KASH GRASS FIELD
    const leftCount = 28;
    for (let i = 0; i < leftCount; i++) {
      const p = i / (leftCount - 1);
      const rowY = horizon + Math.pow(p, 1.2) * (this.height - horizon + 20);
      const bounds = this.getRiverBankBounds(rowY);
      
      // Spread across the left land mass
      const minX = -15;
      const maxX = bounds.left - 24;
      const x = minX + ((i * 37) % 100) / 100 * (maxX - minX);

      const scale = 0.45 + bounds.t * 0.85; // Natural perspective scale
      const height = (140 + (i % 5) * 28) * scale;
      const sway = Math.sin(time * 1.8 + i * 0.42) * 0.16 + 0.15; // Leaning inwards towards the river
      
      this.drawSingleKashStalk(x, rowY, height, sway, scale, time + i * 0.35);
    }

    // 2. RIGHT SIDE KASH GRASS FIELD
    const rightCount = 28;
    for (let i = 0; i < rightCount; i++) {
      const p = i / (rightCount - 1);
      const rowY = horizon + Math.pow(p, 1.2) * (this.height - horizon + 20);
      const bounds = this.getRiverBankBounds(rowY);

      // Spread across the right land mass
      const minX = bounds.right + 24;
      const maxX = this.width + 15;
      const x = minX + ((i * 43) % 100) / 100 * (maxX - minX);

      const scale = 0.45 + bounds.t * 0.85;
      const height = (140 + (i % 5) * 28) * scale;
      const sway = Math.sin(time * 1.8 + i * 0.42) * 0.16 - 0.15; // Leaning inwards towards the river

      this.drawSingleKashStalk(x, rowY, height, sway, scale, time + i * 0.35);
    }

    this.ctx.restore();
  }

  // Draw an individual Kash Grass / Wild Sugarcane stalk with its feathery white plume
  drawSingleKashStalk(x, y, length, swayAngle, scale, time) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.scale(scale, scale);

    const segments = 6;
    const segLen = length / segments;
    let curX = 0;
    let curY = 0;
    let curAngle = swayAngle;

    // Slender golden-green cane stalk
    this.ctx.strokeStyle = '#4d7c0f';
    this.ctx.lineWidth = 2.4;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);

    for (let s = 0; s < segments; s++) {
      curX += Math.sin(curAngle) * segLen;
      curY -= Math.cos(curAngle) * segLen;
      this.ctx.lineTo(curX, curY);
      curAngle += swayAngle * 0.08;
    }
    this.ctx.stroke();

    // Silky Feathery White Plume (Kohua Phool) on top of the cane
    this.drawKashFeatherPlume(curX, curY, curAngle, length * 0.44, time);

    this.ctx.restore();
  }

  // Draw the feathery, silky white plume of Kash grass (Kohua)
  drawKashFeatherPlume(apexX, apexY, angle, plumeLength, time) {
    this.ctx.save();
    this.ctx.translate(apexX, apexY);
    this.ctx.rotate(angle);

    const plumeSegments = 14;
    for (let i = 0; i < plumeSegments; i++) {
      const p = i / plumeSegments;
      const yPos = -p * plumeLength;
      const tuftWidth = (1 - p * 0.6) * (26 + Math.sin(i * 1.4) * 8);
      const tuftFlutter = Math.sin(time * 2.8 + i) * 3.5;

      // Soft silky white hairs radiating from the stem
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 - p * 0.35})`;
      this.ctx.lineWidth = 1.3;

      // Left feathery tuft
      this.ctx.beginPath();
      this.ctx.moveTo(0, yPos);
      this.ctx.quadraticCurveTo(-tuftWidth * 0.5, yPos - 5 + tuftFlutter, -tuftWidth, yPos - 12 + tuftFlutter);
      this.ctx.stroke();

      // Right feathery tuft
      this.ctx.beginPath();
      this.ctx.moveTo(0, yPos);
      this.ctx.quadraticCurveTo(tuftWidth * 0.5, yPos - 5 + tuftFlutter, tuftWidth, yPos - 12 + tuftFlutter);
      this.ctx.stroke();

      // Soft white central plume core
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      this.ctx.beginPath();
      this.ctx.ellipse(0, yPos, 4, 7, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  // Drifting Kash grass seed fluff (Kohua tula) floating across the scene
  drawFloatingKashFluff() {
    this.ctx.save();
    const speed = this.particleSpeed;

    for (let k of this.kashSeeds) {
      k.x += k.vx * speed;
      k.y += k.vy * speed + Math.sin(this.currentTime * 1.5 + k.phase) * 0.3;

      if (k.x < -40) k.x = this.width + 40;
      if (k.y > this.height + 40) k.y = -40;
      if (k.y < -40) k.y = this.height + 40;

      this.ctx.save();
      this.ctx.translate(k.x, k.y);

      // Silky white filaments
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${k.alpha})`;
      this.ctx.lineWidth = 1.0;
      for (let a = 0; a < 6; a++) {
        const rad = (a / 6) * Math.PI * 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(Math.cos(rad) * k.size, Math.sin(rad) * k.size);
        this.ctx.stroke();
      }
      // Seed core
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }

    this.ctx.restore();
  }

  // LAYER 10: TRADITIONAL COUNTRY BOAT (NAAO) FLOATING IN THE MIDDLE RIVER
  drawAssameseCountryBoat() {
    const time = this.currentTime;
    const boatY = this.height * 0.74 + Math.sin(time * 1.5) * 3.5;
    const bounds = this.getRiverBankBounds(boatY);

    // Centered exactly in the middle of the river channel!
    const channelCenter = (bounds.left + bounds.right) / 2;
    const boatX = channelCenter + Math.sin(time * 0.22) * (bounds.width * 0.08);

    this.ctx.save();
    this.ctx.translate(boatX, boatY);
    this.ctx.scale(0.95, 0.95);

    // Soft daylight water shadow/reflection beneath boat
    this.ctx.fillStyle = 'rgba(15, 35, 75, 0.38)';
    this.ctx.beginPath();
    this.ctx.ellipse(0, 16, 92, 11, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Curved Wooden Hull (Rich Sal / Teak timber)
    this.ctx.fillStyle = '#3e2723';
    this.ctx.beginPath();
    this.ctx.moveTo(-82, -8);
    this.ctx.quadraticCurveTo(0, 26, 82, -8);
    this.ctx.quadraticCurveTo(62, -2, 0, 5);
    this.ctx.quadraticCurveTo(-62, -2, -82, -8);
    this.ctx.fill();

    // Wooden Rim Highlight (Daylight golden-brown sheen)
    this.ctx.strokeStyle = '#8d6e63';
    this.ctx.lineWidth = 2.6;
    this.ctx.beginPath();
    this.ctx.moveTo(-82, -8);
    this.ctx.quadraticCurveTo(0, 3, 82, -8);
    this.ctx.stroke();

    // Boitha (Boatman's Oar) resting on the hull
    this.ctx.strokeStyle = '#5d4037';
    this.ctx.lineWidth = 3.8;
    this.ctx.beginPath();
    this.ctx.moveTo(12, -4);
    this.ctx.lineTo(52, 24);
    this.ctx.stroke();

    // Oar paddle blade
    this.ctx.fillStyle = '#4e342e';
    this.ctx.fillRect(48, 20, 14, 8);

    // Gentle daylight wake ripples expanding on the river
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.48)';
    this.ctx.lineWidth = 1.6;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 15, 96 + Math.sin(time * 3) * 6, 8, 0, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.restore();
  }

  // LAYER 9: VILLAGE COURTYARD GATE & FENCE (PODULI AT SUNNY DAYLIGHT)
  drawVillagePoduliGate() {
    const sceneId = this.activeScene.id;
    // Show in Scene 2 & 3 ("Abeli godhuli thakogoi podulit roi")
    if (sceneId !== 'scene-2' && sceneId !== 'scene-3') return;

    const time = this.currentTime;
    const gateX = this.width * 0.08;
    const gateY = this.height * 0.58;

    this.ctx.save();
    this.ctx.scale(0.85, 0.85);

    // Wooden Fence Posts (Rural bamboo / betel wood fence)
    this.ctx.fillStyle = '#451a03';
    for (let i = -3; i <= 3; i++) {
      const px = gateX + i * 36;
      const ph = 85 + Math.sin(i * 1.5) * 12;
      this.ctx.fillRect(px - 5, gateY - ph, 10, ph + 35);

      // Sunlit wooden edge
      this.ctx.fillStyle = '#78350f';
      this.ctx.fillRect(px - 5, gateY - ph, 3, ph + 35);
      this.ctx.fillStyle = '#451a03';
    }

    // Horizontal rails
    this.ctx.fillStyle = '#592205';
    this.ctx.fillRect(gateX - 120, gateY - 55, 240, 8);
    this.ctx.fillRect(gateX - 120, gateY - 22, 240, 8);

    // Blooming Jasmine / Champa climbing vine on the fence
    this.ctx.fillStyle = '#16a34a';
    for (let i = -3; i <= 3; i++) {
      const vx = gateX + i * 36;
      const vy = gateY - 40 + Math.sin(i * 2) * 15;
      this.ctx.beginPath();
      this.ctx.arc(vx, vy, 8, 0, Math.PI * 2);
      this.ctx.fill();

      // Small white flowers
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(vx + 3, vy - 2, 4, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#16a34a';
    }

    this.ctx.restore();
  }

  // LAYER 10: FLYING CUCKOO (KULI BIRD) SOARING ACROSS THE SKY
  drawFlyingBirds() {
    this.ctx.save();
    const time = this.currentTime;

    for (let b of this.birds) {
      b.x += b.speed * this.particleSpeed;
      if (b.x > this.width + 120) {
        b.x = -80;
        b.y = this.height * (0.15 + Math.random() * 0.2);
      }

      const flap = Math.sin(time * b.flapSpeed);
      const by = b.y + Math.sin(time * 1.5 + b.x * 0.01) * 12;

      this.ctx.save();
      this.ctx.translate(b.x, by);
      this.ctx.scale(b.scale, b.scale);

      this.ctx.fillStyle = '#0f172a'; // Sharp silhouette in daylight
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      // Left Wing
      this.ctx.quadraticCurveTo(-15, flap * 18, -32, flap * 8);
      this.ctx.quadraticCurveTo(-12, flap * 5, 0, 0);
      // Right Wing
      this.ctx.quadraticCurveTo(15, flap * 18, 32, flap * 8);
      this.ctx.quadraticCurveTo(12, flap * 5, 0, 0);
      this.ctx.fill();

      this.ctx.restore();
    }

    this.ctx.restore();
  }

  // LAYER 11: DRIFTING CHAMPA FLOWER PETALS IN DAYLIGHT BREEZE
  drawDriftingChampaPetals() {
    this.ctx.save();
    const speed = this.particleSpeed;

    for (let p of this.petals) {
      p.x += p.vx * speed * p.z;
      p.y += p.vy * speed * p.z;
      p.rot += p.rotSpeed * speed;
      p.flip += p.flipSpeed * speed;

      if (p.x < -30) p.x = this.width + 30;
      if (p.y > this.height + 30) p.y = -30;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rot);
      this.ctx.scale(p.z * Math.cos(p.flip), p.z);

      // Champa Petal (White outer petal with radiant golden yellow center)
      const grad = this.ctx.createRadialGradient(0, 0, 2, 0, 0, p.size);
      grad.addColorStop(0, '#facc15'); // Radiant golden core
      grad.addColorStop(0.35, '#fef08a');
      grad.addColorStop(0.8, '#ffffff'); // Crisp pure white
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.9)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.moveTo(0, -p.size);
      this.ctx.quadraticCurveTo(p.size * 0.55, -p.size * 0.3, 0, p.size);
      this.ctx.quadraticCurveTo(-p.size * 0.55, -p.size * 0.3, 0, -p.size);
      this.ctx.fill();

      this.ctx.restore();
    }

    this.ctx.restore();
  }

  // LAYER 12: GENTLE AUDIO REFLECTIONS (Subtle, elegant, non-distracting)
  drawGentleAudioReflections() {
    const bass = this.audioData.bass;
    if (bass < 0.2) return;

    this.ctx.save();
    const horizon = this.height * 0.54;
    const b = this.getRiverBankBounds(horizon + 40);
    const waveGrad = this.ctx.createLinearGradient(0, horizon, 0, horizon + 60);
    waveGrad.addColorStop(0, `rgba(254, 240, 138, ${bass * 0.22})`);
    waveGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');

    this.ctx.fillStyle = waveGrad;
    this.ctx.fillRect(b.left, horizon, b.right - b.left, 60);

    this.ctx.restore();
  }

  // HELPER: Resolve active font family for lyrics
  getLyricFontFamily() {
    switch (this.lyricFont) {
      case 'cinzel':
        return "'Cinzel', 'Noto Serif Bengali', serif";
      case 'playfair':
        return "'Playfair Display', 'Noto Serif Bengali', Georgia, serif";
      case 'caveat':
        return "'Caveat', cursive, 'Noto Sans Bengali', sans-serif";
      case 'syne':
        return "'Syne', 'Noto Sans Bengali', sans-serif";
      case 'outfit':
      default:
        return "'Outfit', 'Noto Sans Bengali', sans-serif";
    }
  }

  // LAYER 13: SYNCHRONIZED CINEMATIC LYRICS (MULTI-FONT & MULTI-STYLE)
  drawLyricsOverlay() {
    if (!this.activeLyric) return;

    const lyric = this.activeLyric;
    const progress = Math.max(0, Math.min(1, (this.currentTime - lyric.start) / (lyric.end - lyric.start)));

    this.ctx.save();
    const isPortrait = this.aspectRatio === '9:16';
    const boxY = isPortrait ? this.height * 0.73 : this.height * 0.79;

    let alpha = 1;
    if (progress < 0.1) {
      alpha = progress / 0.1;
    } else if (progress > 0.9) {
      alpha = (1 - progress) / 0.1;
    }

    let primaryText = "";
    let secondaryText = "";

    if (this.lyricMode === 'romanized') {
      primaryText = lyric.romanized;
      secondaryText = lyric.assamese + " • " + lyric.english;
    } else if (this.lyricMode === 'assamese') {
      primaryText = lyric.assamese;
      secondaryText = lyric.romanized + " • " + lyric.english;
    } else if (this.lyricMode === 'english') {
      primaryText = lyric.english;
      secondaryText = lyric.assamese + " • " + lyric.romanized;
    } else { // 'dual'
      primaryText = lyric.assamese;
      secondaryText = lyric.romanized + " — " + lyric.english;
    }

    // Dynamic Sizing based on font choice
    let fontScale = 1.0;
    if (this.lyricFont === 'caveat') fontScale = 1.25; // Script fonts need larger size
    if (this.lyricFont === 'cinzel') fontScale = 0.95;

    const primarySize = isPortrait 
      ? Math.min(48, Math.max(28, Math.floor(this.width / 15 * fontScale))) 
      : Math.min(52, Math.max(32, Math.floor(this.width / 25 * fontScale)));
    
    const secondarySize = Math.max(16, Math.floor(primarySize * 0.48));
    const fontFam = this.getLyricFontFamily();
    const fontWeight = this.lyricFont === 'caveat' ? '700' : (this.lyricFont === 'syne' ? '800' : '700');

    // ==========================================
    // 100% BOX-FREE PURE FLOATING CINEMATIC LYRICS
    // ==========================================
    this.ctx.save();
    
    // Dynamic Scale for kinetic style
    let scale = 1.0;
    if (this.lyricStyle === 'kinetic') {
      scale = 1 + Math.sin(progress * Math.PI) * 0.08;
    }
    
    this.ctx.translate(this.width / 2, boxY);
    this.ctx.scale(scale, scale);

    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.font = `${fontWeight} ${primarySize}px ${fontFam}`;

    // Deep Cinematic Multi-Layered Drop Shadow for 100% Contrast & Legibility Without Any Box
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
    this.ctx.shadowBlur = 24;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 4;

    // Base Floating Text (Crisp Bright White)
    this.ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * alpha})`;
    this.ctx.fillText(primaryText, 0, 0);

    // Karaoke Golden Sweep Wipe
    const textMetrics = this.ctx.measureText(primaryText);
    const textW = textMetrics.width;
    const startX = -textW / 2;
    const highlightWidth = textW * progress;

    if (highlightWidth > 0) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(startX, -primarySize * 1.2, highlightWidth, primarySize * 2.4);
      this.ctx.clip();

      this.ctx.shadowColor = 'rgba(251, 191, 36, 0.98)';
      this.ctx.shadowBlur = 26;
      this.ctx.fillStyle = this.lyricStyle === 'subtitle' ? '#fde047' : '#ffd000'; // Radiant daylight gold
      this.ctx.fillText(primaryText, 0, 0);
      this.ctx.restore();
    }

    // Secondary Subtitle / Translation Line (Pure Floating, Zero Box)
    if (secondaryText) {
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      this.ctx.shadowOffsetY = 2;
      this.ctx.font = `italic 500 ${secondarySize}px 'Outfit', 'Noto Sans Bengali', sans-serif`;
      this.ctx.fillStyle = `rgba(248, 250, 252, ${0.88 * alpha})`;
      this.ctx.fillText(secondaryText, 0, primarySize * 0.92);
    }

    this.ctx.restore();
    this.ctx.restore();
  }

  // LAYER 14: CINEMATIC HUD
  drawCinematicHUD() {
    this.ctx.save();
    const isPortrait = this.aspectRatio === '9:16';
    const padding = isPortrait ? 24 : 36;
    const topY = padding + (this.letterboxEnabled && !isPortrait ? this.height * 0.085 : 0);

    // Title Badge
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.font = `700 ${isPortrait ? 15 : 18}px 'Outfit', sans-serif`;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    this.ctx.shadowBlur = 8;
    this.ctx.fillText(`${BOHONA_DATA.title.toUpperCase()} • ${BOHONA_DATA.artists}`, padding, topY);

    // Scene Tag
    this.ctx.textAlign = 'right';
    this.ctx.font = `600 ${isPortrait ? 13 : 15}px 'Outfit', sans-serif`;
    this.ctx.fillStyle = '#facc15';
    this.ctx.fillText(`${this.activeScene.name.toUpperCase()}`, this.width - padding, topY);

    // Timecode
    const mins = Math.floor(this.currentTime / 60);
    const secs = Math.floor(this.currentTime % 60);
    const ms = Math.floor((this.currentTime % 1) * 100);
    const tc = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
    
    const botY = this.height - padding - (this.letterboxEnabled && !isPortrait ? this.height * 0.085 : 0);
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'bottom';
    this.ctx.font = `600 13px 'Courier New', monospace`;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    this.ctx.fillText(`TC ${tc} | STABLE 60FPS`, this.width - padding, botY);

    this.ctx.restore();
  }

  // 2.39:1 Anamorphic Letterbox
  drawAnamorphicLetterbox() {
    const barHeight = this.height * 0.085;
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, barHeight);
    this.ctx.fillRect(0, this.height - barHeight, this.width, barHeight);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CinematicEngine;
}
