// Playlist{{{
// jam is acronym of Javascript Asemany Music or jam
// And am is acrony of Asemany Music player
var jamPlaylist = [
  {
    title: "Ano Natsu he",
    artist: "Joe Hisaishi",
    url: "https://uploadkon.ir/uploads/cd4a04_2301-Joe-Hisaishi-Ano-Natsu-he.mp3",
    cover: "https://uploadkon.ir/uploads/b7d804_23spiritedCover.jpg",
  },
  {
    title: "Canis Lupus",
    artist: "Alexandre Desplat",
    url: "https://uploadkon.ir/uploads/42a605_23Fantastic-Mr-Fox-Soundtrack-23-Canis-Lupus.mp3",
    cover: "https://uploadkon.ir/uploads/e48105_23fantasticMrFox.jpg",
  },
  {
    title: "Many Meetings",
    artist: "Howard Shore",
    url: "https://uploadkon.ir/uploads/744708_2309-Many-Meetings.mp3",
    cover: "https://uploadkon.ir/uploads/793f08_23lotrManyMeetings.jpg"
  }

];
//}}}

// Required variables{{{
var jamSounds = [];
var jamCurrent = 0;
var jamMaxCounter = jamPlaylist.length;
var jamSoundLast;

const jamCover = document.getElementById('amCover');

const jamTitle = document.getElementById('amTitle');

const jamLoopBtn =  document.getElementById('amLoopBtn');
const jamShuffleBtn = document.getElementById('amShuffleBtn');


var jamLoopTrigger = false;
var jamLoopOnce = false;
var jamShuffleTrigger = false;
var jamPlaylistBtnTrigger = false;
var jamShuffleIndex;
var jamModalEventsTrigger = true;

var jamDisableColor = "#bbbbbb";
var jamEnableColor = "#000000";
// Controllers{{{
const jamPlayBtn = document.getElementById("amPlay");
const jamNextBtn = document.getElementById("amNext");
const jamPreviousBtn = document.getElementById("amPrevious");
const jamForwardBtn = document.getElementById("amForward");
const jamRewindBtn = document.getElementById("amRewind");

const jamCurrentTimebar = document.getElementById('amCurrentTime');
const jamTimebar = document.getElementById('amTimebar');
const jamDurationTimebar = document.getElementById('amDurationTime');

const jamVolumebar = document.getElementById('amVolumebar');
const jamVolumeUp = document.getElementById('amVolumeUp');
const jamVolumeDown = document.getElementById('amVolumeDown');

const jamPlaylistBtn = document.getElementById('amPlaylistBtn');
// Controllers}}}
// Modal{{{
const jamModal = document.getElementById('amPlaylistModal');
const jamModalCloseBtn = document.getElementById('ampmClose');
const jamModalBg = document.getElementById('ampmBg');

const jamModalUploadBtn = document.getElementById('ampmUpload');
const jamModalUrlBtn = document.getElementById('ampmUrl');
const jamModalClearListBtn = document.getElementById('ampmClear');
//}}}
//}}}

jamSoundMaker(true);

// Sound Events{{{
jamSounds[jamCurrent].on('pause', function() {
  jamPlayBtnExchange();
});

jamSounds[jamCurrent].on('load', function() {
  jamVolumebar.value = jamSounds[jamCurrent].volume() * 100;
});

//}}}

// Progress bar and time{{{
setInterval(jamTimefunc, 1000);

jamTimebar.addEventListener("change", () => {
  let currentWheel = jamTimebar.value * jamSounds[jamCurrent].duration() / 100;
  jamCurrentTimebar.textContent = jamTimeFormat(currentWheel);
  jamSounds[jamCurrent].seek(currentWheel);
  jamSounds[jamCurrent].play();
  jamPlayBtnExchange();
  jamTimefunc();
});

jamVolumebar.addEventListener('change', () => {
  jamVolumebarfunc();
});
//}}}

// Button Events{{{
// Modal{{{
jamModalCloseBtn.addEventListener('click', () => {
  jamModalClose();
});

jamModalBg.addEventListener('click', () => {
  jamModalClose();
});

jamModalClearListBtn.addEventListener('click', () => {
  if (jamMaxCounter > 1) {
    for (let i = 0; i < jamMaxCounter; i++) {
      if (jamCurrent !== i) {
        jamSounds[i].unload();
        jamPlaylist.splice(i, 1);
        jamSoundMaker(false);
        jamSoundMaker(true);
        jamModal.querySelectorAll('ul li')[i].remove();
        jamListFixer();
      }
    }
  }
});
//}}}
// Player{{{
jamPlayBtn.addEventListener("click", () => {
  if(jamSounds[jamCurrent].playing()) {
    jamSounds[jamCurrent].pause();
  } else {
    jamSounds[jamCurrent].play();
  }
});

jamForwardBtn.addEventListener("click", () => {
  jamSounds[jamCurrent].seek(jamSounds[jamCurrent].seek() + 20);
  jamSounds[jamCurrent].play();
});

jamRewindBtn.addEventListener("click", () => {
  jamSounds[jamCurrent].seek(Math.max(0, jamSounds[jamCurrent].seek() - 20));
  jamSounds[jamCurrent].play();
});

jamNextBtn.addEventListener("click", () => {
  jamNext(true);
});

jamPreviousBtn.addEventListener("click", () => {
  jamPrev();
});

jamVolumeUp.addEventListener('click', () => {
  jamSounds[jamCurrent].volume(jamSounds[jamCurrent].volume() + .1);
  jamVolumebar.value = jamSounds[jamCurrent].volume() * 100;
});

jamVolumeDown.addEventListener('click', () => {
  jamSounds[jamCurrent].volume(jamSounds[jamCurrent].volume() - .1);
  jamVolumebar.value = jamSounds[jamCurrent].volume() * 100;
});

jamLoopBtn.addEventListener('click', () => {
  if (jamLoopBtn.classList.contains('bx-repost') && !jamSounds[jamCurrent].loop() && !jamLoopTrigger) {
    jamLoop("all");
    jamLoopBtn.style.color = jamEnableColor;
    jamLoopTrigger = true;
    jamLoopOnce = false;
  } else if (jamLoopBtn.classList.contains('bx-repost') && jamLoopTrigger) {
    jamLoop("self");
    jamLoopBtn.classList.remove('bx-repost');
    jamLoopBtn.classList.add('bx-repeat');
    jamLoopTrigger = false;
    jamLoopOnce = true;
  } else {
    jamLoop('none');
    jamLoopBtn.classList.remove('bx-repeat');
    jamLoopBtn.classList.add('bx-repost');
    jamLoopBtn.style.color = jamDisableColor;
    jamLoopOnce = false;
  }
});

jamShuffleBtn.addEventListener('click', () => {
  if (jamShuffleTrigger) {
    jamShuffleBtn.style.color = jamDisableColor;
    jamShuffleTrigger = false;
  } else {
    jamShuffleBtn.style.color = jamEnableColor;
    jamShuffleTrigger = true;
  }
});

jamPlaylistBtn.addEventListener('click', () => {
  jamListMaker();
  jamModalShow();
});
//}}}
//}}}

// Functions{{{
// Change play pause button icon{{{
function jamPlayBtnExchange() {
  if(jamSounds[jamCurrent].playing()) {
    jamPlayBtn.classList.remove('bx-play-circle');
    jamPlayBtn.classList.add('bx-pause-circle');
  } else {
    jamPlayBtn.classList.add('bx-play-circle');
    jamPlayBtn.classList.remove('bx-pause-circle');
  }
}
//}}}
// Next music functionality{{{
function jamNext(trigger) {
  if (trigger) {
    jamSounds[jamCurrent].stop();
    // if loop all is enable and loop once disabled
    if (jamLoopTrigger && !jamLoopOnce) {
      jamLoopClear();
      if(jamCurrent < jamMaxCounter - 1) {
        if (jamShuffleTrigger) {
          jamCurrent = jamShuffle();
          jamSounds[jamCurrent].play();
        } else {
          jamCurrent++;
          jamSounds[jamCurrent].play();
        }
      } else {
        if (jamShuffleTrigger) {
          jamCurrent = jamShuffle();
          jamSounds[jamCurrent].play();
        } else {
          jamCurrent = 0;
          jamSounds[jamCurrent].play();
        }
      }
      // if loop all and once is disable
    } else if (!jamLoopTrigger && !jamLoopOnce) {
      jamLoopClear();
      if(jamCurrent < jamMaxCounter - 1) {
        if(jamShuffleTrigger) {
          jamCurrent = jamShuffle();
          jamSounds[jamCurrent].play();
        } else {
          jamCurrent++;
          jamSounds[jamCurrent].play();
        }
      } else {
        if(jamShuffleTrigger) {
          jamCurrent = jamShuffle();
          jamSounds[jamCurrent].play();
        } else {
          jamSounds[jamCurrent].stop();
        }
      } 
      // if loop once is enable
    } else if (jamLoopOnce) {
      jamSounds[jamCurrent].play();
    }

    jamCoverAnimation(jamCover);
    jamCoverAnimation(jamTitle);
    jamCover.setAttribute("src", jamPlaylist[jamCurrent].cover);
    jamTitle.textContent = jamPlaylist[jamCurrent].title + " By " + jamPlaylist[jamCurrent].artist;
    jamTimefunc();
  }
}
//}}}
// Previous music functionality{{{
function jamPrev() {
  jamSounds[jamCurrent].stop();

  // if loop all is enable and loop once disabled
  if (jamLoopTrigger && !jamLoopOnce) {
    jamLoopClear();
    if(jamCurrent != 0) {
      if (jamShuffleTrigger) {
        jamCurrent = jamShuffle();
        jamSounds[jamCurrent].play();
      } else {
        jamCurrent--;
        jamSounds[jamCurrent].play();
      }
    } else {
      if (jamShuffleTrigger) {
        jamCurrent = jamShuffle();
        jamSounds[jamCurrent].play();
      } else {
        jamCurrent = jamMaxCounter - 1;
        jamSounds[jamCurrent].play();
      }
    }
    // if loop all and once is disable
  } else if (!jamLoopTrigger && !jamLoopOnce) {
    jamLoopClear();
    if(jamCurrent != 0) {
      if(jamShuffleTrigger) {
        jamCurrent = jamShuffle();
        jamSounds[jamCurrent].play();
      } else {
        jamCurrent--;
        jamSounds[jamCurrent].play();
      }
    } else {
      if(jamShuffleTrigger) {
        jamCurrent = jamShuffle();
        jamSounds[jamCurrent].play();
      } else {
        jamSounds[jamCurrent].stop();
      }
    } 
    // if loop once is enable
  } else if (jamLoopOnce) {
    jamSounds[jamCurrent].play();
  }

  jamCoverAnimation(jamCover);
  jamCover.setAttribute("src", jamPlaylist[jamCurrent].cover);
  jamTitle.textContent = jamPlaylist[jamCurrent].title + " By " + jamPlaylist[jamCurrent].artist;
  jamTimefunc();
}
//}}}
// Set the timers{{{
function jamTimefunc() {
  let duration = jamTimeFormat(Math.floor(jamSounds[jamCurrent].duration()));
  let current = jamTimeFormat(Math.floor(jamSounds[jamCurrent].seek()));

  jamTimebar.value = Math.floor(Math.floor(jamSounds[jamCurrent].seek()) * 100 / Math.floor(jamSounds[jamCurrent].duration()));
  
  jamCurrentTimebar.textContent = current;
  jamDurationTimebar.textContent = duration;
}
//}}}
// Format time in seconds to a standard human readable format{{{
function jamTimeFormat(duration) {
  if (duration / 60 < 1) {
    if (duration / 10 < 1) {
      duration = "00:0" + duration;
    } else {
      duration = "00:" + duration;
    }
  } else if (duration / 3600 < 1) {
    let durationMin = Math.floor(duration / 60);
    let durationSec = Math.floor(duration - durationMin * 60);
    if (durationMin / 10 < 1) durationMin = "0" + durationMin;
    if (durationSec / 10 < 1) durationSec = "0" + durationSec;
    duration = durationMin + ":" + durationSec;
  } else {
    let durationHour = Math.floor(duration / 3600);
    let durationMin = Math.floor((duration - (durationHour * 3600)) / 60);
    let durationSec = Math.floor(duration - durationHour * 3600 - durationMin * 60);
    if (durationMin / 10 < 1) durationMin = "0" + durationMin;
    if (durationSec / 10 < 1) durationSec = "0" + durationSec;
    duration = durationHour + ":" + durationMin + ":" + durationSec;
  }

  return duration;
}
//}}}
// funcionalize the timebar change for using in oninput event{{{
function jamTimebarfunc() {
  let currentWheel = jamTimebar.value * jamSounds[jamCurrent].duration() / 100;
  jamCurrentTimebar.textContent = jamTimeFormat(Math.floor(currentWheel));
}
//}}}
// funcionalize the volumebar change for using in oninput event{{{
function jamVolumebarfunc() {
    jamSounds[jamCurrent].volume(jamVolumebar.value / 100);
}
//}}}
// Cover animation{{{
function jamCoverAnimation(cover) {
  this.sample = cover;
  const theAnimation = [
    { opacity: "0" },
    { opacity: "1" },
  ];

  const timinig = {
    duration: 1000,
    iterations: 1,
  };

  cover.animate(theAnimation, timinig);
}
//}}}
// A looping functionality{{{
function jamLoop(task) {
  if (task === "self") {
    jamSounds[jamCurrent].on('end', () => {
      jamSounds[jamCurrent].loop(true);
    });
  } else if (task === "all") {
    jamSounds[jamCurrent].on('end', () => {
      jamSounds[jamCurrent].loop(false);
    });
  } else {
    jamSounds[jamCurrent].on('end', () => {
      jamNext(false);
      jamSounds[jamCurrent].loop(false);
    });
  }
}
//}}}
// Loop clear stop{{{
function jamLoopClear() {
  for(let i = 0; i < jamMaxCounter; i++) {
    jamSounds[i].stop();
    jamSounds[i].loop(false);
  }
}
//}}}
// Stop all{{{
function jamStopAll() {
  for(let i = 0; i < jamMaxCounter; i++) {
    jamSounds[i].stop();
  }
}
//}}}
// Shuffle the index{{{
function jamShuffle() {
jamShuffleIndex = Math.round(Math.random() * (jamMaxCounter - 1));
  if (jamMaxCounter > 1) {
    while (jamShuffleIndex == jamCurrent) {
      jamShuffleIndex = Math.round(Math.random() * (jamMaxCounter - 1));
    }
    return jamShuffleIndex;
  } else {
    return 0;
  }
}
//}}}
// Sound object maker{{{
function jamSoundMaker(task) {
  if (task) {
    jamMaxCounter = jamPlaylist.length;
    for (let i = 0; i < jamMaxCounter; i++) {
      jamSounds[i] = new Howl ({
        src: [jamPlaylist[i].url],

        onplay: function() {
          jamPlayBtnExchange();
        },

        onpause: function() {
          jamPlayBtnExchange();
        },

        onseek: function() {
          jamTimefunc();
        },

        onload: function() {
          jamTitle.textContent = jamPlaylist[jamCurrent].title + " By " + jamPlaylist[jamCurrent].artist;
        },

        onend: function() {
          jamNext(true);
        }

      });
    }
  } else {
    for (let i = 0; i < jamMaxCounter; i++) {
      jamSounds.splice(i, 1);
    }
  }
}
//}}}
// Playlist Modal functionality{{{
// Modal closer{{{
function jamModalClose() {
  jamModalBg.style.display = 'none';
  jamModal.style.display = 'none';
}
//}}}
// Modal show {{{
function jamModalShow() {
  jamCoverAnimation(jamModalBg);
  jamModalBg.style.display = 'block';
  jamModal.style.display = 'block';
  jamListMaker();
}
//}}}
// Modal List maker{{{
function jamListMaker() {
  let lis = jamModal.querySelectorAll('ul li');
  if(lis) {
    for (let i = 0; i < lis.length; i++) {
      lis[i].remove();
    }
  } 
  let li, span, icon, input;
  for (let i = 0; i < jamMaxCounter; i++) {
    li = document.createElement('li');
    if (i == jamCurrent) {
      li.setAttribute('class', 'current');
    }
    span = document.createElement('span');
    span.textContent = jamPlaylist[i].title + " By " + jamPlaylist[i].artist;
    icon = document.createElement('i');
    icon.setAttribute('class', 'bx bx-minus-circle ampmMinus');
    input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('value', i);
    li.appendChild(span);
    li.appendChild(icon);
    li.appendChild(input);
    jamModal.querySelector('ul').appendChild(li);
  }

  lis = jamModal.querySelectorAll('ul li');
  for (let i = 0; i < lis.length; i++) {
    lis[i].addEventListener('click', () => {
      jamCurrent = Number(lis[i].querySelector('input').value);
      jamCoverAnimation(jamCover);
      jamCoverAnimation(jamTitle);
      jamCover.setAttribute("src", jamPlaylist[jamCurrent].cover);
      jamTitle.textContent = jamPlaylist[jamCurrent].title + " By " + jamPlaylist[jamCurrent].artist;
      jamTimefunc();
      jamStopAll();
      if (jamSoundLast) {
        jamSoundLast.stop();
        jamSoundLast.unload();
      }
      jamSounds[jamCurrent].play();
      jamPlayBtnExchange();
      jamModalClose();
    });

    lis[i].querySelector('.ampmMinus').addEventListener('click', (e) => {
      e.stopPropagation();
      if (jamMaxCounter > 1) {
        let selectedIndex = Number(lis[i].querySelector('input').value);
        if (selectedIndex == jamCurrent) {
          jamSounds[selectedIndex].stop();
          jamNext(true);
        }
        jamSounds[selectedIndex].unload();
        jamPlaylist.splice(selectedIndex, 1);
        jamSoundLast = jamSounds[jamCurrent];
        jamSoundMaker(false);
        jamSoundMaker(true);
        lis[i].remove();
        jamListFixer();
      }
    });
  }


}
//}}}
// Modal List fixer{{{
function jamListFixer() {
  let lis = jamModal.querySelectorAll('ul li');
  if (jamMaxCounter > 1) {
    for (let i = 0; i < lis.length; i++) {
      lis[i].querySelector('input').value = i;
      if (i == jamCurrent - 1) {
        lis[i].classList.add('current');
      }
    }
  }
}
//}}}

//}}}

//}}}
