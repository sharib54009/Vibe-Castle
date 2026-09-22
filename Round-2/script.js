const songs = [
  {
    title: 'Fearless Pt. II',
    artist: 'TULE, Chris Linton',
    audio: 'audio/TULE, Chris Linton - Fearless pt. II (feat. Chris Linton) [NCS Release] (1).mp3',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=85',
    alt: 'Singer performing under purple lights',
    duration: '3:14',
  },
  {
    title: 'Invisible',
    artist: 'Zeus X Crona',
    audio: 'audio/Zeus X Crona - Invisible [NCS Release].mp3',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=85',
    alt: 'Musician with a microphone in warm light',
    duration: '3:21',
  },
  {
    title: 'After Dark',
    artist: 'Night Drive',
    audio: 'audio/song3.mp3',
    image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=900&q=85',
    alt: 'Concert crowd with stage lights',
    duration: '3:58',
  },
  {
    title: 'Ocean Lights',
    artist: 'Blue Waves',
    audio: 'audio/song4.mp3',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85',
    alt: 'Blue ocean horizon at dusk',
    duration: '4:21',
  },
  {
    title: 'Endless Roads',
    artist: 'The Travelers',
    audio: 'audio/song5.mp3',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85',
    alt: 'Open road through distant mountains',
    duration: '3:36',
  },
]

const audio = document.querySelector('#audio-player')
const albumArt = document.querySelector('#album-art')
const songTitle = document.querySelector('#song-title')
const artistName = document.querySelector('#artist-name')
const playButton = document.querySelector('#play-button')
const playIcon = document.querySelector('#play-icon')
const previousButton = document.querySelector('#previous-button')
const nextButton = document.querySelector('#next-button')
const progressBar = document.querySelector('#progress-bar')
const currentTime = document.querySelector('#current-time')
const duration = document.querySelector('#duration')
const playerStatus = document.querySelector('#player-status')
const playlist = document.querySelector('#playlist')
const playlistCount = document.querySelector('#playlist-count')
const volumeButton = document.querySelector('#volume-button')
const volumeIcon = document.querySelector('#volume-icon')
const volumeSlider = document.querySelector('#volume-slider')
const shuffleButton = document.querySelector('#shuffle-button')
const repeatButton = document.querySelector('#repeat-button')
const repeatIcon = document.querySelector('#repeat-icon')
const repeatLabel = document.querySelector('#repeat-label')

let currentSong = 0
let shuffleEnabled = false
let shuffledSongs = []
let shufflePosition = -1
let repeatMode = 'off'

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${remainingSeconds}`
}

function updatePlayIcon(isPlaying) {
  playIcon.innerHTML = isPlaying
    ? '<path d="M8 6v12M16 6v12" />'
    : '<path d="m9 6 9 6-9 6V6Z" />'
  playButton.setAttribute('aria-label', isPlaying ? 'Pause song' : 'Play song')
}

function createShuffleOrder() {
  shuffledSongs = [...Array(songs.length).keys()]
  for (let index = shuffledSongs.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffledSongs[index], shuffledSongs[randomIndex]] = [shuffledSongs[randomIndex], shuffledSongs[index]]
  }
  shufflePosition = shuffledSongs.indexOf(currentSong)
  if (shuffledSongs.length > 1 && shufflePosition === -1) shufflePosition = 0
}

function updateVolumeIcon() {
  const volume = audio.volume
  volumeSlider.style.setProperty('--volume', `${volume * 100}%`)
  const iconPath = volume === 0
    ? '<path d="M4 10v4h4l5 4V6l-5 4H4Z" /><path d="m18 9-4 6M14 9l4 6" />'
    : volume <= 0.5
      ? '<path d="M4 10v4h4l5 4V6l-5 4H4Z" /><path d="M16 10a3 3 0 0 1 0 4" />'
      : '<path d="M4 10v4h4l5 4V6l-5 4H4Z" /><path d="M16 9.5a4 4 0 0 1 0 5M19 7a8 8 0 0 1 0 10" />'
  volumeIcon.innerHTML = iconPath
  volumeButton.setAttribute('aria-label', `Volume ${Math.round(volume * 100)} percent`)
}

function updateModeButtons() {
  shuffleButton.classList.toggle('active', shuffleEnabled)
  shuffleButton.setAttribute('aria-pressed', String(shuffleEnabled))
  shuffleButton.title = shuffleEnabled ? 'Shuffle on' : 'Shuffle off'
  shuffleButton.querySelector('span').textContent = shuffleEnabled ? 'Shuffle on' : 'Shuffle'

  const repeatText = repeatMode === 'all' ? 'Repeat all' : repeatMode === 'one' ? 'Repeat one' : 'Repeat off'
  repeatButton.classList.toggle('active', repeatMode !== 'off')
  repeatButton.dataset.mode = repeatMode
  repeatButton.setAttribute('aria-pressed', String(repeatMode !== 'off'))
  repeatButton.title = repeatText
  repeatLabel.textContent = repeatText
  repeatIcon.innerHTML = repeatMode === 'one'
    ? '<path d="M17 3l4 4-4 4" /><path d="M3 11V9a2 2 0 0 1 2-2h16M7 21l-4-4 4-4" /><path d="M21 13v2a2 2 0 0 1-2 2H3" /><path d="M12 10v4M10.5 10H12" />'
    : '<path d="M17 3l4 4-4 4" /><path d="M3 11V9a2 2 0 0 1 2-2h16M7 21l-4-4 4-4" /><path d="M21 13v2a2 2 0 0 1-2 2H3" />'
}

function loadSong(index) {
  const song = songs[index]
  currentSong = index
  if (shuffleEnabled) shufflePosition = shuffledSongs.indexOf(currentSong)
  audio.src = song.audio
  audio.load()
  albumArt.src = song.image
  albumArt.alt = song.alt
  songTitle.textContent = song.title
  artistName.textContent = song.artist
  progressBar.value = 0
  progressBar.style.setProperty('--progress', '0%')
  currentTime.textContent = '0:00'
  duration.textContent = '0:00'
  updatePlayIcon(false)
  playerStatus.textContent = 'Add MP3 files to the audio folder to start listening.'
  playerStatus.classList.remove('error')
  updateActiveSong()
}

function updateActiveSong() {
  playlist.querySelectorAll('.playlist-item').forEach((item, index) => {
    const isActive = index === currentSong
    item.classList.toggle('active', isActive)
    item.setAttribute('aria-current', isActive ? 'true' : 'false')
  })
}

function renderPlaylist() {
  playlistCount.textContent = `${songs.length} tracks`
  playlist.innerHTML = songs.map((song, index) => `
    <button class="playlist-item" type="button" role="listitem" data-index="${index}" aria-label="Play ${song.title} by ${song.artist}">
      <span class="song-number">${String(index + 1).padStart(2, '0')}</span>
      <span class="song-copy"><strong>${song.title}</strong><small>${song.artist}</small></span>
      <span class="song-duration">${song.duration}</span>
    </button>
  `).join('')

  playlist.addEventListener('click', (event) => {
    const item = event.target.closest('.playlist-item')
    if (!item) return
    loadSong(Number(item.dataset.index))
    playSong()
  })
}

async function playSong() {
  try {
    await audio.play()
    updatePlayIcon(true)
    playerStatus.textContent = 'Playing now'
    playerStatus.classList.remove('error')
  } catch (error) {
    updatePlayIcon(false)
    playerStatus.textContent = `Could not play ${songs[currentSong].audio}. Add the MP3 file and try again.`
    playerStatus.classList.add('error')
  }
}

function pauseSong() {
  audio.pause()
  updatePlayIcon(false)
  playerStatus.textContent = 'Paused'
}

function nextSong() {
  if (shuffleEnabled) {
    if (shufflePosition >= shuffledSongs.length - 1) {
      createShuffleOrder()
      if (shuffledSongs.length > 1 && shuffledSongs[0] === currentSong) {
        ;[shuffledSongs[0], shuffledSongs[1]] = [shuffledSongs[1], shuffledSongs[0]]
      }
      shufflePosition = 0
    } else shufflePosition += 1
    loadSong(shuffledSongs[shufflePosition])
  } else {
    loadSong((currentSong + 1) % songs.length)
  }
  playSong()
}

function previousSong() {
  if (shuffleEnabled) {
    if (shufflePosition <= 0) shufflePosition = shuffledSongs.length - 1
    else shufflePosition -= 1
    loadSong(shuffledSongs[shufflePosition])
  } else {
    loadSong((currentSong - 1 + songs.length) % songs.length)
  }
  playSong()
}

function updateProgress() {
  if (!audio.duration) return
  const progress = (audio.currentTime / audio.duration) * 100
  progressBar.value = progress
  progressBar.style.setProperty('--progress', `${progress}%`)
  currentTime.textContent = formatTime(audio.currentTime)
}

playButton.addEventListener('click', () => {
  if (audio.paused) playSong()
  else pauseSong()
})
previousButton.addEventListener('click', previousSong)
nextButton.addEventListener('click', nextSong)
audio.addEventListener('timeupdate', updateProgress)
audio.addEventListener('loadedmetadata', () => {
  duration.textContent = formatTime(audio.duration)
})
audio.addEventListener('ended', () => {
  if (repeatMode === 'one') {
    audio.currentTime = 0
    playSong()
    return
  }
  nextSong()
})
audio.addEventListener('error', () => {
  updatePlayIcon(false)
  playerStatus.textContent = `Missing audio file: ${songs[currentSong].audio}`
  playerStatus.classList.add('error')
})
progressBar.addEventListener('input', () => {
  if (!audio.duration) return
  audio.currentTime = (progressBar.value / 100) * audio.duration
  progressBar.style.setProperty('--progress', `${progressBar.value}%`)
  currentTime.textContent = formatTime(audio.currentTime)
})

audio.addEventListener('pause', () => updatePlayIcon(false))
audio.addEventListener('play', () => updatePlayIcon(true))
volumeSlider.addEventListener('input', () => {
  audio.volume = Number(volumeSlider.value)
  updateVolumeIcon()
})
volumeButton.addEventListener('click', () => {
  volumeSlider.value = audio.volume === 0 ? 1 : 0
  audio.volume = Number(volumeSlider.value)
  updateVolumeIcon()
})
shuffleButton.addEventListener('click', () => {
  shuffleEnabled = !shuffleEnabled
  if (shuffleEnabled) createShuffleOrder()
  updateModeButtons()
})
repeatButton.addEventListener('click', () => {
  repeatMode = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off'
  updateModeButtons()
})
audio.volume = Number(volumeSlider.value)
updateVolumeIcon()
updateModeButtons()
renderPlaylist()
loadSong(0)
