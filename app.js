// Cinematic Lyric Video Studio - Main Application Logic
// Orchestrates Audio, Canvas Engine, Timeline, Directing Console, and Video Export

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const canvas = document.getElementById('videoCanvas');
  const audioElement = document.getElementById('audioElement');
  const btnPlayPause = document.getElementById('btnPlayPause');
  const btnRewind = document.getElementById('btnRewind');
  const btnForward = document.getElementById('btnForward');
  const scrubberBar = document.getElementById('scrubberBar');
  const scrubberFill = document.getElementById('scrubberFill');
  const scrubberHandle = document.getElementById('scrubberHandle');
  const scenesBar = document.getElementById('scenesBar');
  const currTimeEl = document.getElementById('currTime');
  const totalTimeEl = document.getElementById('totalTime');
  const volSlider = document.getElementById('volSlider');
  const btnMute = document.getElementById('btnMute');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const customAudioInput = document.getElementById('customAudioInput');
  const lyricsScriptBox = document.getElementById('lyricsScriptBox');
  const recIndicator = document.getElementById('recIndicator');
  const recText = document.getElementById('recText');
  const audioMeter = document.getElementById('audioMeter');
  const meterBars = audioMeter ? audioMeter.querySelectorAll('.meter-bar') : [];

  // Director Elements
  const directorInput = document.getElementById('directorInput');
  const btnDirect = document.getElementById('btnDirect');
  const chipButtons = document.querySelectorAll('.chip-btn');
  const ratioButtons = document.querySelectorAll('[data-ratio]');
  const styleButtons = document.querySelectorAll('[data-style]');
  const langButtons = document.querySelectorAll('[data-lang]');
  const chkGrain = document.getElementById('chkGrain');
  const chkLetterbox = document.getElementById('chkLetterbox');
  const btnExportVideo = document.getElementById('btnExportVideo');
  const btnCaptureSnapshot = document.getElementById('btnCaptureSnapshot');
  const btnHeaderSnapshot = document.getElementById('btnHeaderSnapshot');
  const btnHeaderExport = document.getElementById('btnHeaderExport');

  // Export Modal Elements
  const exportModal = document.getElementById('exportModal');
  const exportProgressBar = document.getElementById('exportProgressBar');
  const exportStatusText = document.getElementById('exportStatusText');
  const btnCancelExport = document.getElementById('btnCancelExport');

  // Initialize Canvas Engine
  const engine = new CinematicEngine(canvas);

  // Web Audio API State
  let audioCtx = null;
  let audioSource = null;
  let analyser = null;
  let audioStreamDest = null;
  let isAudioInitialized = false;

  // Recording State
  let mediaRecorder = null;
  let recordedChunks = [];
  let isRecording = false;
  let recordingStartTime = 0;

  // Setup Default Audio Track
  audioElement.src = encodeURI(BOHONA_DATA.audioSrc);

  // Duration Handling
  let totalDuration = BOHONA_DATA.durationEstimate;
  audioElement.addEventListener('loadedmetadata', () => {
    if (audioElement.duration && !isNaN(audioElement.duration)) {
      totalDuration = audioElement.duration;
      totalTimeEl.textContent = formatTime(totalDuration);
    }
  });

  // Setup Web Audio on first user interaction
  function initAudioContext() {
    if (isAudioInitialized) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;

      audioSource = audioCtx.createMediaElementSource(audioElement);
      audioStreamDest = audioCtx.createMediaStreamDestination();

      audioSource.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.connect(audioStreamDest); // Piped for video recording

      isAudioInitialized = true;
    } catch (e) {
      console.warn("Web Audio context initialization error:", e);
    }
  }

  // Populate Scenes Timeline Bar
  function buildScenesBar() {
    scenesBar.innerHTML = '';
    const total = BOHONA_DATA.durationEstimate;
    BOHONA_DATA.scenes.forEach(scene => {
      const duration = scene.endTime - scene.startTime;
      const pct = (duration / total) * 100;
      const block = document.createElement('div');
      block.className = 'scene-block';
      block.style.width = `${pct}%`;
      block.style.backgroundColor = scene.colorPalette.accent || '#ffd700';
      block.title = `${scene.name} (${formatTime(scene.startTime)} - ${formatTime(scene.endTime)})`;
      block.addEventListener('click', (e) => {
        e.stopPropagation();
        seekTo(scene.startTime);
      });
      scenesBar.appendChild(block);
    });
  }

  // Populate Lyrics Script Box
  function buildLyricsScriptBox() {
    lyricsScriptBox.innerHTML = '';
    BOHONA_DATA.lyrics.forEach((lyric, index) => {
      const item = document.createElement('div');
      item.className = 'lyric-item';
      item.id = `lyric-item-${index}`;
      item.innerHTML = `
        <div class="lyric-item-time">${formatTime(lyric.start)} — ${formatTime(lyric.end)}</div>
        <div class="lyric-item-text">${lyric.romanized}</div>
        <div class="lyric-item-trans">${lyric.assamese} • ${lyric.english}</div>
      `;
      item.addEventListener('click', () => {
        seekTo(lyric.start);
      });
      lyricsScriptBox.appendChild(item);
    });
  }

  buildScenesBar();
  buildLyricsScriptBox();

  // Play / Pause Logic
  function togglePlay() {
    initAudioContext();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (audioElement.paused) {
      audioElement.play().then(() => {
        btnPlayPause.textContent = '⏸';
      }).catch(err => {
        console.warn("Audio play prevented:", err);
      });
    } else {
      audioElement.pause();
      btnPlayPause.textContent = '▶';
    }
  }

  btnPlayPause.addEventListener('click', togglePlay);

  btnRewind.addEventListener('click', () => {
    seekTo(Math.max(0, audioElement.currentTime - 5));
  });

  btnForward.addEventListener('click', () => {
    seekTo(Math.min(totalDuration, audioElement.currentTime + 5));
  });

  function seekTo(time) {
    audioElement.currentTime = time;
    currTimeEl.textContent = formatTime(time);
    const pct = (time / totalDuration) * 100;
    scrubberFill.style.width = `${pct}%`;
    scrubberHandle.style.left = `${pct}%`;
  }

  // Scrubber Click & Drag
  let isScrubbing = false;
  scrubberBar.addEventListener('mousedown', (e) => {
    isScrubbing = true;
    handleScrub(e);
  });
  window.addEventListener('mousemove', (e) => {
    if (isScrubbing) handleScrub(e);
  });
  window.addEventListener('mouseup', () => {
    isScrubbing = false;
  });

  function handleScrub(e) {
    const rect = scrubberBar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(pos * totalDuration);
  }

  // Volume & Mute
  volSlider.addEventListener('input', (e) => {
    audioElement.volume = parseFloat(e.target.value);
    btnMute.textContent = audioElement.volume === 0 ? '🔇' : '🔊';
  });

  btnMute.addEventListener('click', () => {
    if (audioElement.volume > 0) {
      audioElement.volume = 0;
      volSlider.value = 0;
      btnMute.textContent = '🔇';
    } else {
      audioElement.volume = 1;
      volSlider.value = 1;
      btnMute.textContent = '🔊';
    }
  });

  // Fullscreen
  btnFullscreen.addEventListener('click', () => {
    const wrapper = document.getElementById('canvasWrapper');
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  });

  // Custom Audio Upload Handler
  customAudioInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      initAudioContext();
      const objectUrl = URL.createObjectURL(file);
      audioElement.src = objectUrl;
      document.getElementById('songHeaderPill').innerHTML = `
        <span>🎵</span>
        <strong>${file.name.replace(/\.[^/.]+$/, "")}</strong>
        <span>(Custom Track)</span>
      `;
      audioElement.load();
      audioElement.play();
      btnPlayPause.textContent = '⏸';
    }
  });

  // Format Seconds to MM:SS
  function formatTime(sec) {
    if (isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // ASPECT RATIO SWITCHER
  function setAspectRatio(ratio) {
    ratioButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.ratio === ratio);
    });

    if (ratio === '9:16') {
      canvas.width = 1080;
      canvas.height = 1920;
      canvas.style.aspectRatio = '9 / 16';
      engine.setDimensions(1080, 1920, '9:16');
    } else {
      canvas.width = 1920;
      canvas.height = 1080;
      canvas.style.aspectRatio = '16 / 9';
      engine.setDimensions(1920, 1080, '16:9');
    }
  }

  ratioButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setAspectRatio(btn.dataset.ratio);
    });
  });

  // LIGHTING ATMOSPHERE SWITCHER
  const lightingButtons = document.querySelectorAll('[data-lighting]');
  lightingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      lightingButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      engine.lightingMode = btn.dataset.lighting;
    });
  });

  // VISUAL STYLE SWITCHER
  styleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      styleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      engine.styleMode = btn.dataset.style;
    });
  });

  // LYRICS FONT SWITCHER
  const fontButtons = document.querySelectorAll('[data-font]');
  fontButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      fontButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      engine.lyricFont = btn.dataset.font;
    });
  });

  // LYRICS PRESENTATION STYLE SWITCHER
  const lyricStyleButtons = document.querySelectorAll('[data-lyricstyle]');
  lyricStyleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      lyricStyleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      engine.lyricStyle = btn.dataset.lyricstyle;
    });
  });

  // LYRICS LANGUAGE SWITCHER
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      engine.lyricMode = btn.dataset.lang;
    });
  });

  // OPTICS TOGGLES
  chkGrain.addEventListener('change', (e) => {
    engine.filmGrainEnabled = e.target.checked;
  });
  chkLetterbox.addEventListener('change', (e) => {
    engine.letterboxEnabled = e.target.checked;
  });

  // DIRECTOR'S PROMPT NLP INTERPRETER
  function executeDirectorCommand(cmd) {
    if (!cmd) return;
    const clean = cmd.trim().toLowerCase();

    // Aspect ratio
    if (clean.includes('9:16') || clean.includes('reels') || clean.includes('shorts') || clean.includes('vertical')) {
      setAspectRatio('9:16');
    } else if (clean.includes('16:9') || clean.includes('cinema') || clean.includes('youtube') || clean.includes('landscape')) {
      setAspectRatio('16:9');
    }

    // Styles
    if (clean.includes('watercolor') || clean.includes('watercolour')) {
      engine.styleMode = 'watercolor';
      updateActiveStyleButton('watercolor');
    } else if (clean.includes('neon') || clean.includes('cyber') || clean.includes('bihu')) {
      engine.styleMode = 'neon';
      updateActiveStyleButton('neon');
    } else if (clean.includes('minimal')) {
      engine.styleMode = 'minimal';
      updateActiveStyleButton('minimal');
    } else if (clean.includes('cinematic') || clean.includes('film')) {
      engine.styleMode = 'cinematic';
      updateActiveStyleButton('cinematic');
    }

    // Atmosphere
    if (clean.includes('more fog') || clean.includes('fog')) {
      engine.fogDensity = Math.min(2.5, engine.fogDensity + 0.5);
    } else if (clean.includes('less fog') || clean.includes('clear')) {
      engine.fogDensity = Math.max(0.2, engine.fogDensity - 0.4);
    }

    if (clean.includes('speed petals') || clean.includes('blossom') || clean.includes('faster')) {
      engine.particleSpeed = 2.2;
    } else if (clean.includes('slower') || clean.includes('calm')) {
      engine.particleSpeed = 0.6;
    }

    // Lyrics
    if (clean.includes('assamese') || clean.includes('lipi')) {
      engine.lyricMode = 'assamese';
      updateActiveLangButton('assamese');
    } else if (clean.includes('romanized')) {
      engine.lyricMode = 'romanized';
      updateActiveLangButton('romanized');
    } else if (clean.includes('dual')) {
      engine.lyricMode = 'dual';
      updateActiveLangButton('dual');
    }

    // Lyric Fonts
    if (clean.includes('font:cinzel') || clean.includes('cinzel')) {
      engine.lyricFont = 'cinzel';
      updateActiveFontButton('cinzel');
    } else if (clean.includes('font:playfair') || clean.includes('playfair')) {
      engine.lyricFont = 'playfair';
      updateActiveFontButton('playfair');
    } else if (clean.includes('font:caveat') || clean.includes('caveat') || clean.includes('handwrit') || clean.includes('script')) {
      engine.lyricFont = 'caveat';
      updateActiveFontButton('caveat');
    } else if (clean.includes('font:syne') || clean.includes('syne')) {
      engine.lyricFont = 'syne';
      updateActiveFontButton('syne');
    } else if (clean.includes('font:outfit') || clean.includes('outfit')) {
      engine.lyricFont = 'outfit';
      updateActiveFontButton('outfit');
    }

    // Lyric Presentation Style
    if (clean.includes('lyricstyle:floating') || clean.includes('floating')) {
      engine.lyricStyle = 'floating';
      updateActiveLyricStyleButton('floating');
    } else if (clean.includes('lyricstyle:karaoke') || clean.includes('karaoke')) {
      engine.lyricStyle = 'karaoke';
      updateActiveLyricStyleButton('karaoke');
    } else if (clean.includes('lyricstyle:ribbon') || clean.includes('ribbon') || clean.includes('glass')) {
      engine.lyricStyle = 'ribbon';
      updateActiveLyricStyleButton('ribbon');
    } else if (clean.includes('lyricstyle:kinetic') || clean.includes('kinetic') || clean.includes('pop')) {
      engine.lyricStyle = 'kinetic';
      updateActiveLyricStyleButton('kinetic');
    } else if (clean.includes('lyricstyle:subtitle') || clean.includes('subtitle')) {
      engine.lyricStyle = 'subtitle';
      updateActiveLyricStyleButton('subtitle');
    }

    // Lighting
    if (clean.includes('daylight') || clean.includes('sunny') || clean.includes('bright') || clean.includes('morning')) {
      engine.lightingMode = 'daylight';
      updateActiveLightingButton('daylight');
    } else if (clean.includes('golden') || clean.includes('sunset') || clean.includes('dusk')) {
      engine.lightingMode = 'golden';
      updateActiveLightingButton('golden');
    }

    // Kash Grass & Sugarcane Fields
    if (clean.includes('kash') || clean.includes('sugarcane') || clean.includes('kohua')) {
      engine.particleSpeed = 1.5;
    }

    // Box-free lyrics command
    if (clean.includes('no box') || clean.includes('remove box') || clean.includes('without box')) {
      engine.lyricStyle = 'floating';
      updateActiveLyricStyleButton('floating');
    }

    // Letterbox & grain
    if (clean.includes('letterbox')) {
      engine.letterboxEnabled = !clean.includes('no');
      chkLetterbox.checked = engine.letterboxEnabled;
    }
    if (clean.includes('grain')) {
      engine.filmGrainEnabled = !clean.includes('no');
      chkGrain.checked = engine.filmGrainEnabled;
    }
  }

  function updateActiveFontButton(font) {
    const btns = document.querySelectorAll('[data-font]');
    btns.forEach(b => b.classList.toggle('active', b.dataset.font === font));
  }
  function updateActiveLyricStyleButton(style) {
    const btns = document.querySelectorAll('[data-lyricstyle]');
    btns.forEach(b => b.classList.toggle('active', b.dataset.lyricstyle === style));
  }
  function updateActiveLightingButton(lighting) {
    const btns = document.querySelectorAll('[data-lighting]');
    btns.forEach(b => b.classList.toggle('active', b.dataset.lighting === lighting));
  }

  function updateActiveStyleButton(style) {
    styleButtons.forEach(b => b.classList.toggle('active', b.dataset.style === style));
  }
  function updateActiveLangButton(lang) {
    langButtons.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  }

  btnDirect.addEventListener('click', () => {
    executeDirectorCommand(directorInput.value);
    directorInput.value = '';
  });

  directorInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeDirectorCommand(directorInput.value);
      directorInput.value = '';
    }
  });

  chipButtons.forEach(chip => {
    chip.addEventListener('click', () => {
      executeDirectorCommand(chip.dataset.cmd);
    });
  });

  // SNAPSHOT FRAME CAPTURE
  function captureSnapshot() {
    const timestampStr = formatTime(audioElement.currentTime).replace(':', '_');
    const filename = `Bohona_Snapshot_${timestampStr}_${engine.aspectRatio.replace(':', 'x')}.png`;
    
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  btnCaptureSnapshot.addEventListener('click', captureSnapshot);
  btnHeaderSnapshot.addEventListener('click', captureSnapshot);

  // VIDEO RENDER & EXPORT ENGINE (Canvas + Web Audio -> MP4 / WebM)
  function startVideoRecording() {
    if (isRecording) {
      stopVideoRecording();
      return;
    }

    initAudioContext();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

    // Prepare MediaStream
    const canvasStream = canvas.captureStream(30); // 30 FPS for reliable encoding
    let combinedStream = canvasStream;

    if (audioStreamDest && audioStreamDest.stream) {
      const audioTracks = audioStreamDest.stream.getAudioTracks();
      if (audioTracks.length > 0) {
        combinedStream = new MediaStream([
          ...canvasStream.getVideoTracks(),
          ...audioTracks
        ]);
      }
    }

    // Select supported mimeType
    const mimeTypes = [
      'video/mp4;codecs=avc1,mp4a.40.2',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm'
    ];
    let selectedMime = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || '';

    try {
      mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: selectedMime,
        videoBitsPerSecond: 6000000 // 6 Mbps high quality
      });
    } catch (e) {
      console.warn("Fallback to default MediaRecorder options:", e);
      mediaRecorder = new MediaRecorder(combinedStream);
    }

    recordedChunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      finishVideoExport();
    };

    // UI Updates
    isRecording = true;
    recIndicator.style.display = 'flex';
    btnExportVideo.innerHTML = '<span>⏹️</span><span>Stop & Download Video</span>';
    btnHeaderExport.innerHTML = '<span>⏹️</span><span>Stop Export</span>';
    btnHeaderExport.style.background = 'rgba(239, 68, 68, 0.9)';
    btnHeaderExport.style.color = '#fff';

    // Start playback from current or 0
    if (audioElement.currentTime >= totalDuration - 2) {
      seekTo(0);
    }
    audioElement.play();
    btnPlayPause.textContent = '⏸';

    mediaRecorder.start(1000); // chunk every 1s
  }

  function stopVideoRecording() {
    if (!isRecording) return;
    isRecording = false;
    audioElement.pause();
    btnPlayPause.textContent = '▶';
    recIndicator.style.display = 'none';
    btnExportVideo.innerHTML = '<span>🔴</span><span>Record & Render MP4</span>';
    btnHeaderExport.innerHTML = '<span>🔴</span><span>Export MP4/WebM</span>';
    btnHeaderExport.style.background = 'rgba(239, 68, 68, 0.2)';
    btnHeaderExport.style.color = '#fca5a5';

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  }

  function finishVideoExport() {
    exportModal.style.display = 'flex';
    exportModalTitle.textContent = "Packaging Video File...";
    exportProgressBar.style.width = "100%";
    exportStatusText.textContent = "Generating download bundle...";

    setTimeout(() => {
      const isMp4 = mediaRecorder.mimeType && mediaRecorder.mimeType.includes('mp4');
      const ext = isMp4 ? 'mp4' : 'webm';
      const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType || 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Bohona_Lyric_Video_${engine.aspectRatio.replace(':', 'x')}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      exportModalTitle.textContent = "Video Download Ready!";
      exportStatusText.textContent = `Saved ${Math.round(blob.size / 1024 / 1024 * 10) / 10} MB video file!`;

      setTimeout(() => {
        exportModal.style.display = 'none';
        URL.revokeObjectURL(url);
      }, 2500);
    }, 600);
  }

  btnExportVideo.addEventListener('click', () => {
    if (!isRecording) {
      startVideoRecording();
    } else {
      stopVideoRecording();
    }
  });

  btnHeaderExport.addEventListener('click', () => {
    if (!isRecording) {
      startVideoRecording();
    } else {
      stopVideoRecording();
    }
  });

  btnCancelExport.addEventListener('click', () => {
    exportModal.style.display = 'none';
    stopVideoRecording();
  });

  // KEYBOARD SHORTCUTS
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return; // Don't trigger when typing in prompt
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    } else if (e.code === 'ArrowLeft') {
      seekTo(Math.max(0, audioElement.currentTime - 5));
    } else if (e.code === 'ArrowRight') {
      seekTo(Math.min(totalDuration, audioElement.currentTime + 5));
    } else if (e.code === 'KeyF') {
      btnFullscreen.click();
    }
  });

  // MAIN ANIMATION & RENDER LOOP (60 FPS)
  let activeLyricIdx = -1;

  function mainRenderLoop() {
    const curTime = audioElement.currentTime;

    // Update Web Audio FFT
    if (analyser) {
      engine.updateAudioData(analyser);

      // Update Mini-Meter in transport bar
      if (meterBars.length > 0) {
        const spec = engine.audioData.spectrum;
        for (let i = 0; i < meterBars.length; i++) {
          const val = spec[i * 4] || 0;
          meterBars[i].style.height = `${Math.max(4, (val / 255) * 18)}px`;
        }
      }
    }

    // Determine Active Scene
    let activeScene = BOHONA_DATA.scenes[0];
    for (let s of BOHONA_DATA.scenes) {
      if (curTime >= s.startTime && curTime < s.endTime) {
        activeScene = s;
        break;
      }
    }

    // Determine Active Lyric Line
    let activeLyric = null;
    let newLyricIdx = -1;
    for (let i = 0; i < BOHONA_DATA.lyrics.length; i++) {
      const l = BOHONA_DATA.lyrics[i];
      if (curTime >= l.start && curTime <= l.end) {
        activeLyric = l;
        newLyricIdx = i;
        break;
      }
    }

    // Update active lyric item styling in sidebar script
    if (newLyricIdx !== activeLyricIdx) {
      if (activeLyricIdx >= 0) {
        const prev = document.getElementById(`lyric-item-${activeLyricIdx}`);
        if (prev) prev.classList.remove('active');
      }
      if (newLyricIdx >= 0) {
        const curr = document.getElementById(`lyric-item-${newLyricIdx}`);
        if (curr) {
          curr.classList.add('active');
          curr.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
      activeLyricIdx = newLyricIdx;
    }

    // Render Canvas Frame
    engine.render(curTime, activeScene, activeLyric);

    // Update Transport UI (when not scrubbing)
    if (!isScrubbing && !audioElement.paused) {
      currTimeEl.textContent = formatTime(curTime);
      const pct = (curTime / totalDuration) * 100;
      scrubberFill.style.width = `${pct}%`;
      scrubberHandle.style.left = `${pct}%`;
    }

    // Update Recording Timer
    if (isRecording) {
      recText.textContent = `REC • ${formatTime(curTime)}`;
    }

    requestAnimationFrame(mainRenderLoop);
  }

  // Trigger First Render Frame
  requestAnimationFrame(mainRenderLoop);
});
