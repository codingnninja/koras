"use strict";

import {
  $render,
  $register,
  stringify,
  $select,
  $purify,
} from "../../dist/esm/koras.min.js";
let playingInterval;

/**All music information */
const songs = [
  {
    id: 1,
    backgroundImage: "./images/background.jpg",
    posterUrl: "./images/calm-down.png",
    title: "Calm Down",
    album: "Audio",
    year: 2023,
    artist: "Rema ft Gomez",
    musicPath: "./music/local-music-2.mp3",
  },
  {
    id: 2,
    backgroundImage: "./images/background.jpg",
    posterUrl: "./images/lonely-at-the-top.jpg",
    title: "Lonely at the top ",
    album: "Audio",
    year: 2023,
    artist: "Asake",
    musicPath: "./music/local-music-1.mp3",
  },
  {
    id: 3,
    backgroundImage: "./images/local-poster-3.jpg",
    posterUrl: "./images/unavailable.jpg",
    title: "Unavailable",
    album: "Audio",
    year: 2023,
    artist: "Davido ft Musa",
    musicPath: "./music/local-music-3.mp3",
  },
];

const getSong = async (index) => {
  let song;
  let completed;
  if (appState.shuffle && appState.selected === false) {
    const getRandomSong = () =>
      appState.songs[Math.floor(Math.random() * appState.songs.length)];
    song = getRandomSong();
    song.isShuffled = true;
    $render(Shuffle);
    completed = await $render(CurrentSong, { song });
  } else if (!appState.songs[index]) {
    song = appState.songs[0];
    completed = await $render(CurrentSong, { song });
  } else {
    song = appState.songs[index];
    completed = await $render(CurrentSong, { song });
  }
  if (completed) {
    $render(Play, { song });
  }
};
const getSelectedSongsForDownload = () => {
  const selectedSongsIDs = $select(".selected-songs");
  const selectedSongs = appState.songs.map((song, index) => {
    if (selectedSongsIDs[index].checked === true) {
      song.isChecked = true;
      return song;
    }
    song.isChecked = false;
    return song;
  });
  return selectedSongs;
};

const setPlayingState = (song) => {
  getSelectedSongsForDownload();
  return songs.map((mySong, index) => {
    if (mySong.id === song.id) {
      mySong.isPlaying = true;
    } else {
      mySong.isPlaying = false;
    }
    return mySong;
  });
};

const getTimecode = function (duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.ceil(duration - minutes * 60);
  const timecode = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  return timecode;
};
const updateRunningTime = (song) => {
  const [playingAudio, playerSeekRange, playerRunningTime, rangeFill] = $select(
    `#audio-${song.id}, #seek-${song.id}, #running-time, #range-fill`
  );

  if (Math.floor(playingAudio.currentTime) >= appState.range.end) {
    if (!appState.repeat) {
      appState.range.end = playingAudio.duration;
    }
    appState.autopilotMode(playingAudio, song);
  }

  playerSeekRange.value = playingAudio.currentTime;
  playerRunningTime.textContent = appState.getTimecode(
    playingAudio.currentTime
  );
  const rangeValue = (playerSeekRange.value / playerSeekRange.max) * 100;
  rangeFill.style.width = `${rangeValue}%`;
};

const resolveVolume = (audio, song) => {
  if (appState.volume === null) {
    return;
  }
  audio.volume = appState.volume;
  song.volume = appState.volume;
  $render(Volume, { song });
};

const autopilotMode = (audio, song) => {
  const currentSong = typeof song === "string" ? $purify(song) : song;
  if (appState.repeat) {
    audio.currentTime = appState.range.start;
    audio.play();
    return true;
  }
  appState.getSong(currentSong.id);
};

const appState = {
  deviceSongs: [],
  songs,
  getSong,
  autopilotMode,
  resolveVolume,
  setPlayingState,
  playingInterval,
  updateRunningTime,

  getTimecode,
  getSelectedSongsForDownload,
  repeat: false,
  shuffle: null,
  selected: false,
  volume: null,
  range: {
    start: 0,
    end: 300,
  },
};

const Player = ({ songs }) => {
  return `
      <div class="player" id="player">
        <CurrentSong song={songs[0]} />
      </div>
  `;
};

const Playlist = ({ songs }) => {
  const props = { songs };
  return `
      <div class="playlist" id="playlist" >
        <div style="display:flex; flex-direction: row; gap:5px; justify-content:center">
          <button class="btn-icon playing ${
            !songs[0].isFromMyDevice ? "play-active" : "active"
          }"
          onclick="$render(Playlist, {props})"
          style="width: 50px; height: 50px;"
          >
            Latest
          </button> 
          <button 
          class="btn-icon playing ${
            !songs[0].isFromMyDevice ? "active" : "play-active"
          }"
          onclick="$render(Playlist, {props})"
          style="width: 50px; height: 50px;"
          >
            Mine
          </button>
        </div><br>
        <small>
        ${
          !songs ? "Note: Choose /storage or /disk to load from all files." : ""
        }
        </small>
        ${
          songs
            ? `<Songs songs=${stringify(songs)}/>`
            : `<button onclick="$render(UploadSongsFromDevice)"> Load songs</button>`
        }
      </div>
  `;
};

const Overlay = ({ toggle }) => {
  return `
      <div class="overlay" onclick="${toggle()}">
        <span class="close">x</span>
      </div>
  `;
};

const CurrentSong = ({ song }) => {
  return `
    <div class="container" id="playing-song">
      <CurrentSongInformation 
        song="{song}" 
      />
    </div>
  `;
};

const CurrentSongInformation = ({ song }) => {
  const updateDuration = (params) => {
    const elements = $select(params.selectors);
    const [audio, playerSeekRange, endRange, playerDuration] = elements;
    playerSeekRange.max = Math.ceil(audio.duration);
    endRange.max = playerSeekRange.max;
    endRange.value = playerSeekRange.max;
    appState.range.end = playerSeekRange.max;
    playerDuration.textContent = appState.getTimecode(
      Number(playerSeekRange.max)
    );
  };

  return `
    <audio 
      src=${song.musicPath} 
      id="audio-${song.id}" 
      data-id="${song.id}" 
      onEnded="appState.autopilotMode(this, '${song}')" 
      onloadeddata="${updateDuration({selectors: `#audio-${song.id},#seek-${song.id}, #seek-right-${song.id}, #duration` })}" class="playing-audio"></audio>
    <figure class="music-banner">
    <img
      src="${song.posterUrl}"
      width="800"
      height="800"
      alt="Wotakoi: Love is Hard for an Otaku Album Poster"
      class="img-cover"
    />
  </figure>

  <div class="music-content">
    <h2 class="headline-sm">
      ${song.title}
    </h2>

    <p class="label-lg label-wrapper wrapper">
      <span>${song.album}</span>
      <span>${song.year}</span>
    </p>

    <p class="label-md artist">${song.artist}</p>
    <SeekControl song={song} />
    <Controller song={song} />
  </div>
  `;
};

const SeekControl = ({ song }) => {
  return `
    <div class="seek-control">
      <ProgressIndicator song=${song} />
      <Volume song=${song}/>
    </div>
  `;
};

const Volume = ({ song }) => {
  const a = { a: 1 };
  const changeVolume = function (params) {
    const elements = $select(params.selectors);
    const audio = elements[0];
    audio.volume = elements[1].value;
    audio.muted = false;
    appState.volume = elements[1].value;

    if (audio.volume <= 0.1) {
      elements[2].textContent = "volume_mute";
    } else if (audio.volume <= 0.5) {
      elements[2].textContent = "volume_down";
    } else {
      elements[2].textContent = "volume_up";
    }
  };

  const volume = song.volume ? song.volume : 1;
  return `
    <div class="volume" id="volume">
      <button class="btn-icon volume-btn">
        <span class="material-symbols-rounded" id="volume-icon">volume_up</span>
      </button>

      <div class="range-wrapper">
        <input
          type="range"
          step="0.05"
          max="1"
          value="${volume}"
          class="range"
          id="volume-${song.id}"
          onchange="${changeVolume({
            selectors: `#audio-${song.id}, #volume-${song.id}, #volume-icon`,
          })}"
        />

        <div class="range-fill"></div>
      </div>
    </div>
  `;
};

const ProgressIndicator = ({ song }) => {
  const seek = (params) => {
    const elements = $select(params.selectors);
    const [audio, runningTime, seekRange, rangeFill] = elements;
    audio.currentTime = seekRange.value;

    appState.range.start = Number(seekRange.value);
    runningTime.textContent = appState.getTimecode(appState.range.start);

    const rangeValue = (seekRange.value / seekRange.max) * 100;
    rangeFill.style.width = `${rangeValue}%`;
  };

  const seekRight = (params) => {
    const elements = $select(params.selectors);
    const [duration, seekRangeRight, fillRight] = elements;
    const rangeValue = (seekRangeRight.value / seekRangeRight.max) * 100;

    appState.range.end = Number(seekRangeRight.value);
    appState.range.elements = elements;
    duration.textContent = appState.getTimecode(appState.range.end);

    const rangeRightValue = 100 - rangeValue;
    fillRight.style.width = `${rangeRightValue}%`;
  };

  return `
    <div class="progress-indicator" id="progress-indicator">
      <div class="range-wrapper">
        <input
          type="range"
          class="duel-range right-range"
          min="0"
          max="60"
          value="60"
          step="1"
          id="seek-right-${song.id}"
          onchange="${seekRight({
            selectors: `#duration, #seek-right-${song.id}, #fill-right`,
          })}"
        />
        <input
          type="range"
          step="1"
          max="60"
          value="0"
          class="range"
          id="seek-${song.id}"
          onchange="${seek({
            selectors: `#audio-${song.id},#running-time, #seek-${song.id}, #range-fill`,
          })}"
        />
        <div class="range-fill" id="range-fill"></div>
        <div class="fill-right" id="fill-right"></div>
      </div>

      <div class="duration-label wrapper">
        <span class="label-md" id="running-time">0:00</span>
        <span class="label-md" id="duration">1:00</span>
      </div>
    </div>
  `;
};

const Previous = ({ song }) => {
  const index = song.id - 1;
  return `
    <div id="previous">
      <button class="btn-icon">
        <span class="material-symbols-rounded"
          onclick="appState.getSong(${index - 1})"
        >skip_previous</span>
      </button>
    </div>
  `;
};
const Play = ({ song }) => {
  const audio = $select(`#audio-${song.id}`);
  const props = { song };
  clearInterval(appState.playingInterval);

  if (audio) {
    song.isPlaying = audio.paused ? true : false;
    appState.resolveVolume(audio, song);
    audio.paused ? audio.play() : audio.pause();
    $render(Songs, { songs: appState.setPlayingState(song) });
    if (song.isPlaying) {
      appState.playingInterval = setInterval(function () {
        appState.updateRunningTime(song);
      }, 500);
    }
  }

  return `
    <div id="play">
      <button class="btn-icon play ${
        song.isPlaying ? 'play-active' : ''
      }" onclick="$render(Play, {props})" id="play-test">
        <span class="material-symbols-rounded default-icon">
            ${song.isPlaying ? "pause" : "play_arrow"}
        </span>
      </button>
    </div>
  `;
};

const Next = ({ song }) => {
  return `
    <div id="next">
      <button class="btn-icon">
        <span 
          class="material-symbols-rounded"
          onclick="appState.getSong(${song.id})"
        >skip_next</span>
      </button>
    </div>
  `;
};

const Shuffle = () => {
  const shuffle = () => {
    appState.shuffle = appState.shuffle ? false : true;
    $render(Shuffle);
  };

  return `
    <div id="shuffle">
      <button class="btn-icon toggle">
        <span 
          class="material-symbols-rounded ${appState.shuffle ? 'active' : ''}"
          onclick="${shuffle()}"
        >shuffle</span>
      </button>
    </div>
  `;
};

const Repeat = () => {
  const repeat = () => {
    appState.repeat = appState.repeat ? false : true;
    $render(Repeat);
  };

  return `
    <div id="repeat">
      <button class="btn-icon toggle">
        <span 
          class="material-symbols-rounded ${appState.repeat ? 'active' : ''}"
          onclick=${repeat()}
        >
        ${appState.repeat ? "repeat_one" : "repeat"}
        </span>
      </button>
    </div>
  `;
};

const Controller = ({ song }) => {
  return `
      <div class="player-control wrapper">
        <Repeat />
        <Previous song=${song} />
        <Play song=${song} />
        <Next song=${song} />
        <Shuffle />                 
      </div>
    `;
};

const unCheckSong = (song) => {
  if (song.checked === false) {
    song.checked = false;
    return;
  }
};
const Audio = ({ song }) => {
  const songId = song.id;

  const playSelectedSong = (params) => {
    appState.selected = true;
    const element = $select(params.selector);
    const selectedSong = appState.getSong(params.data, element);
    $render(Repeat);
  };

  return `
    <div id="${song.id}">
      <input type="checkbox" name="select-song" id="check-${songId}"     class="selected-songs ${
    song.isFromMyDevice ? 'hidden' : ''
  }" ${song.isChecked ? "checked" : ""}>
      <button 
        class="music-item ${song.isPlaying ? 'playing' : ''}"
        id='playing-${song.id}' 
        onclick="${playSelectedSong({
          selector: `#audio-${song.id}`,
          data: song.id - 1,
        })}">
          <img src="${song.posterUrl}" width="800" height="800" alt="${
    song.title
  } Album Poster"
          class="img-cover">
          <div class="item-icon">
            <span class="material-symbols-rounded">equalizer</span>
          </div>
          <div class="song-details">
          <span id="title">${song.title}</span>
            <span id="date">${song.artist} (${song.year})</span>
          </div>
      </button>
    </div>
  `;
};
const Songs = ({ songs }) => {
  const downloadAll = () => {
    const selectedSongs = getSelectedSongsForDownload();
    const errorMsg = $select("#selection-error");

    if (selectedSongs.length === 0) {
      errorMsg.classList.add("show");
      return;
    } else {
      errorMsg.classList.remove("show");
    }

    let depth = 0;
    while (selectedSongs.length > depth) {
      const selectedSong = selectedSongs[depth];
      if (!selectedSong.isChecked) {
        continue;
      }
      const link = document.createElement("a");
      link.href = selectedSong.musicPath;
      link.download = `${selectedSong.musicPath}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      depth++;
    }
  };

  const songList = songs.map((song) => {
    return `<Audio song=${song} />`;
  });

  return `
    <div 
      id="songs">
      ${
        !songs[0].isFromMyDevice
          ? `
          <div 
            style="border: 1px solid silver; 
            text-align:center; 
            border-radius: 8px"
            onclick="${downloadAll()}"
          >
            <span class="material-symbols-rounded active">download</span> all
          </div>
        <span id="selection-error">No song selected</span><br>`
          : ""
      }
      <div id="music-list" class="music-list">
        ${songList}
      </div>
    </div>`;
};

const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timeout);
    const deferred = () => {
      timer = null;
      func(...args);
    };
    timer && clearTimeout(timer);
    timer = setTimeout(deferred, timeout);
  };
};

const toggle = (event) => {
  event && event.preventDefault()
  const [playlist, overlay] = $select("#playlist, .overlay");
  if (playlist.classList.contains("active")) {
    playlist.classList.remove("active");
    overlay.classList.remove("active");
  } else {
    playlist.classList.add("active");
    overlay.classList.add("active");
  }
};

const Header = ({ toggle }) => {
  return `
    <div class="top-bar wrapper">
      <!--navbar-->
      <div class="logo wrapper">
        <h1 class="title-lg">LovePlay</h1>
      </div>
      <!--music list-->
      <div class="top-bar-actions">
        <button class="btn-icon" onclick="${toggle()}">
          <span class="material-symbols-rounded">filter_list</span>
        </button>
      </div>
    </div>
  `;
};

function Loading(id) {
  return `<div id="render-fallback">AB Loading...</div>`;
}

const App = ({ songs, toggle }) => {
  return `
    <div id="main">
      <Header toggle=${toggle} />
      <article>
        <Playlist songs=${songs} />
        <Player songs=${songs} />
        <Overlay toggle=${toggle} />
      </article>
    </div>
  `;
};

$register(
  App,
  Header,
  Player,
  Playlist,
  Play,
  CurrentSong,
  CurrentSongInformation,
  SeekControl,
  ProgressIndicator,
  Volume,
  Controller,
  Repeat,
  Previous,
  Next,
  Shuffle,
  Songs,
  Audio,
  Overlay,
  Loading,
  UploadSongsFromDevice
);

globalThis["appState"] = appState;
globalThis["$select"] = $select;


const start = performance.now();
  
const a = await $render(App, { songs, toggle });

const end = performance.now();
const duration = end - start;
  
console.log(`Execution time: ${duration.toFixed(4)}`);

// if(a) {
//   let [touchArea, overlay] = $select("#player, #overlay");
//   console.log(touchArea)
//   // startSwiping();
//  }

async function UploadSongsFromDevice() {
  async function scanFiles(directoryHandle) {
    let songs = [];
    let depth = 1;
    for await (const entry of directoryHandle.values()) {
      if (entry.kind === "file") {
        if (
          entry.name.endsWith(".mp3") ||
          entry.name.endsWith(".wav") ||
          entry.name.endsWith(".ogg")
        ) {
          let song = {};
          const file = await entry.getFile();
          const objectURL = URL.createObjectURL(file);
          song.musicPath = objectURL;
          song.isFromMyDevice = true;
          song.id = depth;

          jsmediatags.read(file, {
            onSuccess: function (tag) {
              song.artist = tag.tags.artist || "Unknown Artist";
              song.title = tag.tags.title || "Unknown Title";
              song.year = tag.tags.year || "Unknown Year";

              if (tag.tags.picture) {
                const picture = tag.tags.picture;
                const base64String = btoa(
                  String.fromCharCode.apply(null, picture.data)
                );
                song.posterUrl = `data:${picture.format};base64,${base64String}`;
              }
            },
            onError: function (error) {
              console.error("Error reading tags:", error);
            },
          });
          songs.push(song);
        }
      } else if (entry.kind === "directory") {
        await scanFiles(entry);
      }
      depth++;
    }
    return songs;
  }

  let selectedFolderHandle = await window.showDirectoryPicker();
  const songsFromDevice = await scanFiles(selectedFolderHandle);
  return ``;
}


function startSwiping (){
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){ 
    // Swiping implementation
    let [touchArea, overlay] = $select("#player, #overlay");
    const doNothing = () => {
    return;
    }

    const handlePrevious = debounce(() => {
      if(!appState.played) {
        alert('You must play before you swipe');
        return false
      }
      let previousComponent = $select("#previous>button>span");
      previousComponent.click();
    });

    const handleNext = debounce (() => {
      if(!appState.played) {
        alert('You must play before you swipe');
        return false
      }
      let nextComponent = $select("#next>button>span");
      nextComponent.click();
    });

    const togglePlaylistBySwipingDown = debounce((event) => {
      toggle();
    })
    //Initial mouse X and Y positions are 0

  let startX = 0;
  let startY = 0;
  let threshold = 100; // Minimum distance to swipe

  function handleTouchStart(event) {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
  }

  function handleTouchMove(event) {

      let currentX = event.touches[0].clientX;
      let currentY = event.touches[0].clientY;
      let diffX = startX - currentX;
      let diffY = startY - currentY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
          // Horizontal swipe
          if(event.target.classList[0] === "range" || event.target.classList[0] === "duel-range"){
            return false;
          }
          
          if (diffX > threshold) {
              // Swipe left
              handleNext();
          } else if (diffX < -threshold) {
              // Swipe right
              handlePrevious();
          }
      } else {
          // Vertical swipe
          if (diffY > threshold) {
              // Swipe up
              doNothing();
          } else if (diffY < -threshold) {
              // Swipe 
              togglePlaylistBySwipingDown();
          }
      }
  }

  function handleTouchEnd(event) {
      // Reset startX and startY
      startX = 0;
      startY = 0;
  }

  touchArea.addEventListener("touchstart", handleTouchStart, {passive: true});
  touchArea.addEventListener("touchmove", handleTouchMove, {passive: true});
  touchArea.addEventListener("touchend", handleTouchEnd, {passive: true});
  }
}