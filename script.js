// === WELCOME SCREEN ===
let userLocation = { lat: 55.7558, lon: 37.6176 };
let cityName = "Москва";
let currentTemp = -5;
let welcomePhase = 0;
let currentTypingTimer = null;

// === ЗВУКИ (Howler.js) ===
//let clickSound, spinSound, win2Sound, jackpotSound;
//let soundsUnlocked = false;

// Разблокировка Web Audio API при первом взаимодействии
/*function unlockSounds() {
  if (soundsUnlocked) return;
  soundsUnlocked = true;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  oscillator.connect(ctx.destination);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    ctx.close();
  }, 10);
}*/

// Инициализация звуков
/*function initSounds() {
  const base = 'https://raw.githubusercontent.com/bronxx-coding/Rock-Paper-Scissors/a0c0c59caa7e9d92011733ba4dd145dd0e07d77d/';
  
  clickSound = new Howl({
    src: [base + 'click.mp3'],
    volume: 0.5,
    preload: true
  });
  spinSound = new Howl({
    src: [base + 'spin_short.mp3'],
    volume: 0.6,
    preload: true
  });
  win2Sound = new Howl({
    src: [base + 'win_2x.mp3'],
    volume: 0.7,
    preload: true
  });
  jackpotSound = new Howl({
    src: [base + 'win_3x.mp3'],
    volume: 0.8,
    preload: true
  });
}*/

async function fetchWeatherAndDate(lat, lon, city = "Москва") {
  try {
    const now = new Date();
    const days = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
    const dayName = days[now.getDay()];
    const dateNum = now.getDate();

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();
    const temp = Math.round(weatherData.current.temperature_2m);
    
    currentTemp = temp;
    document.getElementById('dateNumber').textContent = dateNum;
    document.getElementById('dateDay').textContent = dayName;
    document.getElementById('tempValue').textContent = `${temp}°`;
    document.getElementById('cityName').textContent = city;
  } catch (err) {
    console.warn("Ошибка погоды:", err);
    const now = new Date();
    const days = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
    document.getElementById('dateNumber').textContent = now.getDate();
    document.getElementById('dateDay').textContent = days[now.getDay()];
    document.getElementById('tempValue').textContent = "-5°";
    document.getElementById('cityName').textContent = "Москва";
  }
}

function requestLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: 55.7558, lon: 37.6176, city: "Москва" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        let city = "Москва";
        try {
          const geoUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ru`;
          const geoRes = await fetch(geoUrl);
          const geoData = await geoRes.json();
          city = geoData.address?.city || geoData.address?.town || "Москва";
        } catch (e) {
          console.warn("Не удалось определить город");
        }
        resolve({ lat, lon, city });
      },
      () => resolve({ lat: 55.7558, lon: 37.6176, city: "Москва" })
    );
  });
}

function getWelcomeMessage(phase, temp = -5) {
  if (phase === 0) return "Привет, друг! За окном зима во всей красе ❄️\nУ тебя тоже холодно? Давай узнаем это!";
  if (phase === 1) {
    if (temp > 10) return "Да ты наверное в очках ходишь и прячешься от солнца, ни то что я! ХА-ХА! Ладно, у меня тут сюрприз! ✨";
    if (temp > 0) return "Ого, а у тебя не так уж и холодно, ни то что у меня! Ладно, у меня тут сюрприз! ✨";
    return "Ух, довольно холодно даже для меня! 🥶 Но ничего,\nдля тебя есть сюрприз!✨";
  }
  if (phase === 2) return "Что же за загадочная иконка появилась на экране❓ Нажми на неё и узнаешь! 🌠";
}

function typeMessageWelcome(text, speed = 40, animateDots = true) {
  const element = document.getElementById('typewriter-welcome');
  const statusDots = document.querySelector('#welcomeScreen .status-dots');
  
  if (currentTypingTimer) {
    clearTimeout(currentTypingTimer);
    currentTypingTimer = null;
  }
  
  element.innerHTML = "";
  if (animateDots && statusDots) statusDots.classList.add('animating');
  
  let i = 0;
  function type() {
    if (i < text.length) {
      const char = text.charAt(i);
      element.innerHTML += char === '\n' ? '<br>' : char;
      i++;
      currentTypingTimer = setTimeout(type, speed);
    } else {
      currentTypingTimer = null;
      if (animateDots && statusDots) statusDots.classList.remove('animating');
    }
  }
  type();
}

function updateIconVisibility() {
  const icon1 = document.getElementById('icon1');
  const icon2 = document.getElementById('icon2');
  const icon3 = document.getElementById('icon3');
  
  if (welcomePhase === 0) {
    icon1.style.display = 'none';
    icon2.style.display = 'none';
    icon3.style.display = 'none';
  } else if (welcomePhase === 1) {
    icon1.style.display = 'block';
    icon2.style.display = 'block';
    icon2.style.opacity = '0';
    icon2.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => icon2.style.opacity = '1', 100);
    icon3.style.display = 'none';
  } else if (welcomePhase === 2) {
    icon1.style.display = 'block';
    icon2.style.display = 'block';
    icon2.style.opacity = '1';
    icon3.style.display = 'block';
    icon3.style.opacity = '0';
    icon3.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => {
      icon3.style.opacity = '1';
      icon3.classList.add('icon-shake');
      setTimeout(() => {
        icon3.classList.remove('icon-shake');
        setTimeout(() => icon3.classList.add('icon-sway'), 4000);
      }, 400);
    }, 100);
  }
}

function updateProgressBar() {
  document.querySelectorAll('.progressBar-dots .dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === welcomePhase);
  });
}

function createSnow() {
  const canvas = document.createElement('canvas');
  canvas.id = 'snow-canvas';
  canvas.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  `;
  document.getElementById('welcomeScreen').appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = 608;
  canvas.height = 1080;
  
  const flakes = [];
  const flakeCount = 80;
  
  class Flake {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * -canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speed = Math.random() * 2 + 1;
      this.wind = Math.random() * 1 - 0.5;
    }
    update() {
      this.y += this.speed;
      this.x += this.wind;
      if (this.y > canvas.height) {
        this.y = -10;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  for (let i = 0; i < flakeCount; i++) flakes.push(new Flake());
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flakes.forEach(flake => {
      flake.update();
      flake.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// === ЗВУКИ (нативный Audio) ===
// === ЗВУКИ И УПРАВЛЕНИЕ ===
let isMuted = false;

function playSound(filename, volume = 0.5) {
  if (isMuted) return;
  
  const audio = new Audio(filename);
  audio.volume = volume;
  audio.play().catch(e => {
    console.log("Звук заблокирован:", filename);
  });
}

// === Инициализация welcome ===
document.addEventListener('DOMContentLoaded', async () => {
  /*initSounds(); */ // ← ИНИЦИАЛИЗАЦИЯ ЗВУКОВ
  
  const statusDots = document.querySelector('#welcomeScreen .status-dots');
  if (statusDots) statusDots.classList.add('animating');
  
  typeMessageWelcome(getWelcomeMessage(0), 40, false);
  
  setTimeout(async () => {
    if (statusDots) statusDots.classList.remove('animating');
    const loc = await requestLocation();
    userLocation = { lat: loc.lat, lon: loc.lon };
    cityName = loc.city;
    fetchWeatherAndDate(loc.lat, loc.lon, loc.city);
    
    document.getElementById('readNextWelcome').style.display = 'flex';
    document.getElementById('readBackWelcome').style.display = 'none';
    updateProgressBar();
  }, 4000);
  
  createSnow();
  // Обработчик кнопки отключения звука
const muteButton = document.getElementById('muteButton');
if (muteButton) {
  muteButton.addEventListener('click', () => {
    isMuted = !isMuted;
    muteButton.classList.toggle('muted', isMuted);
  });
}
});

// === Обработчики welcome ===
document.getElementById('readNextWelcome').addEventListener('click', () => {
  /*if (!soundsUnlocked) unlockSounds();
  if (soundsUnlocked) clickSound.play();*/
  playSound('click.mp3', 0.5);
  if (welcomePhase < 2) {
    welcomePhase++;
    typeMessageWelcome(getWelcomeMessage(welcomePhase, currentTemp), 40, true);
    updateIconVisibility();
    updateProgressBar();
    
    if (welcomePhase === 1) {
      document.getElementById('readBackWelcome').style.display = 'flex';
      document.getElementById('readNextWelcome').style.display = 'flex';
    }
    if (welcomePhase === 2) {
      document.getElementById('readNextWelcome').style.display = 'none';
      document.getElementById('readBackWelcome').style.display = 'flex';
    }
  }
});

document.getElementById('readBackWelcome').addEventListener('click', () => {
  /*if (!soundsUnlocked) unlockSounds();
  if (soundsUnlocked) clickSound.play();*/
  playSound('click.mp3', 0.5);
  if (welcomePhase > 0) {
    welcomePhase--;
    typeMessageWelcome(getWelcomeMessage(welcomePhase, currentTemp), 40, true);
    updateIconVisibility();
    updateProgressBar();
    
    if (welcomePhase === 0) {
      document.getElementById('readBackWelcome').style.display = 'none';
      document.getElementById('readNextWelcome').style.display = 'flex';
    }
    if (welcomePhase === 1) {
      document.getElementById('readBackWelcome').style.display = 'flex';
      document.getElementById('readNextWelcome').style.display = 'flex';
    }
  }
});

// === ПЕРЕХОД К СЛОТУ ===
document.getElementById('icon3').addEventListener('click', () => {
  /*if (!soundsUnlocked) unlockSounds(); // ← разблокировка при первом клике
  if (soundsUnlocked) clickSound.play(); // ← звук клика*/
  playSound('click.mp3', 0.5);
  
  if (welcomePhase === 2) {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('slotMachineApp').style.display = 'block';
    if (!window.slotInitialized) {
      initSlotMachineApp();
      window.slotInitialized = true;
    }
  }
});

// === СЛОТ МАШИНА ===
function initSlotMachineApp() {
  let score = 500;
  let messageState = 0;
  let currentTypingTimerSlot = null;
  const iconMap = ["banana", "seven", "cherry", "plum", "orange", "bell", "bar", "lemon", "melon"];
  const blueMessages = [
    "Кажется удача на твоей стороне, скоро подарок станет твоим!🎁",
    "Вау! Хороший результат, главное не сдавайся!🦾",
    "Ого, у тебя точно получится собрать три в ряд!🆒",
    "Победа уже рядом,\nя верю в тебя!🤞",
    "Отлично! Ты делаешь успехи!👌",
    "Тебя ждёт приз,\nне сбавляй обороты!🚀",
    "Ты в ударе!\nНа твоем месте я бы бежал покупать лотерейные билеты!💸",
    "Здорово! Такими темпами ты с легкостью возьмёшь главный приз🏆",
    "Это было круто! Двигаемся вперед к главному призу!🏆",
    "Победа всё ближе, продолжаем!🥇"
  ];
  const winSymbols = ["plum", "lemon", "bell", "seven"];
  const icon_width = 134;
  const icon_height = 134;
  const num_icons = 9;
  let time_per_icon = 100;
  let indexes = [0, 0, 0];
  const messages = [
    "Время испытать твою удачу, тапай по экрану с иконками, возможно тебе удастся выиграть🍀",
    "Некоторые комбинации из двух символов дают очки. Можешь отыскать их сам или перейти к следующему сообщению c подсказкой!💎",
    "ХА-ХА!😂 Я так и думал!\nЗа 2 шапки, шишки, кружки или 2 камина на центральной линии получишь очки, а за 3 любые главный приз!"
  ];
  
  let freeSpinsActive = false;
  let freeSpinsCount = 0;
  const speedPotionSymbol = "banana"; // Символ зелья скорости
  let isSpeedPotionActive = false; // Глобальный флаг для звука спина



  function typeMessageSlot(text, speed = 40, animateDots = true) {
    const element = document.getElementById('typewriter-slot');
    const statusDots = document.querySelector('#slotMachineApp .status-dots');
    
    if (currentTypingTimerSlot) {
      clearTimeout(currentTypingTimerSlot);
      currentTypingTimerSlot = null;
    }
    
    element.innerHTML = "";
    if (animateDots && statusDots) statusDots.classList.add('animating');
    
    let i = 0;
    function type() {
      if (i < text.length) {
        const char = text.charAt(i);
        element.innerHTML += char === '\n' ? '<br>' : char;
        i++;
        currentTypingTimerSlot = setTimeout(type, speed);
      } else {
        currentTypingTimerSlot = null;
        if (animateDots && statusDots) statusDots.classList.remove('animating');
      }
    }
    type();
  }

  // === УПРАВЛЕНИЕ КНОПКАМИ СЛОТА ===
  document.getElementById('readNextSlot').addEventListener('click', () => {
    playSound('click.mp3', 0.5);
    if (messageState < 2) {
      messageState++;
      typeMessageSlot(messages[messageState], 40, true);
      
      if (messageState === 0) {
        document.getElementById('readNextSlot').style.display = 'flex';
        document.getElementById('readBackSlot').style.display = 'none';
      } else if (messageState === 1) {
        document.getElementById('readNextSlot').style.display = 'flex';
        document.getElementById('readBackSlot').style.display = 'flex';
      } else if (messageState === 2) {
        document.getElementById('readNextSlot').style.display = 'none';
        document.getElementById('readBackSlot').style.display = 'flex';
      }
    }
  });

  document.getElementById('readBackSlot').addEventListener('click', () => {
    playSound('click.mp3', 0.5);
    if (messageState > 0) {
      messageState--;
      typeMessageSlot(messages[messageState], 40, true);
      
      if (messageState === 0) {
        document.getElementById('readNextSlot').style.display = 'flex';
        document.getElementById('readBackSlot').style.display = 'none';
      } else if (messageState === 1) {
        document.getElementById('readNextSlot').style.display = 'flex';
        document.getElementById('readBackSlot').style.display = 'flex';
      } else if (messageState === 2) {
        document.getElementById('readNextSlot').style.display = 'none';
        document.getElementById('readBackSlot').style.display = 'flex';
      }
    }
  });

  function roll(reel, offset = 0) {
    const delta = (offset + 2) * num_icons + Math.floor(Math.random() * num_icons);
    return new Promise((resolve) => {
      const style = getComputedStyle(reel);
      const backgroundPositionY = parseFloat(style["background-position-y"]);
      const targetBackgroundPositionY = backgroundPositionY + delta * icon_height;
      const normTargetBackgroundPositionY = targetBackgroundPositionY % (num_icons * icon_height);
      
      setTimeout(() => {
        reel.style.transition = `background-position-y ${(8 + delta) * time_per_icon}ms cubic-bezier(.41,-0.01,.63,1.09)`;
        reel.style.backgroundPositionY = `${targetBackgroundPositionY}px`;
      }, offset * 150);
      
      setTimeout(() => {
        reel.style.transition = "none";
        reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
        resolve(delta % num_icons);
      }, (8 + delta) * time_per_icon + offset * 150);
    });
  }

  /*// === ОБРАБОТЧИК КЛИКА ПО БАРАБАНАМ ===
  document.getElementById('slot-machine').addEventListener*/

  typeMessageSlot(messages[0], 40, true);
  setTimeout(() => {
    document.getElementById('readNextSlot').style.display = 'flex';
    document.getElementById('readBackSlot').style.display = 'none';
  }, 4000);
} //конец initslotmachine

/*// Обработчик кнопки перезапуска
document.getElementById('restartButton').addEventListener('click', () => {
  playSound('click.mp3', 0.5);
  
  // Сбрасываем игру
  score = 500;
  document.getElementById('scoreValue').textContent = score;
  document.getElementById('restartButton').style.display = 'none';
  document.getElementById('giftButton').classList.remove('show');
  document.getElementById('giftBlueButton').style.display = 'none';
  
  // Скрываем сообщение
  typeMessageSlot(messages[0]);
});

// Обработчик закрытия слота
document.getElementById('closeSlot').addEventListener('click', () => {
  playSound('click.mp3', 0.5);
  document.getElementById('slotMachineApp').style.display = 'none';
  document.getElementById('welcomeScreen').style.display = 'block';
  
  welcomePhase = 0;
  updateIconVisibility();
  updateProgressBar();
  
  // Скрываем кнопки до окончания печати
  document.getElementById('readNextWelcome').style.display = 'none';
  document.getElementById('readBackWelcome').style.display = 'none';
  
  // Перезапускаем снег
  const snowCanvas = document.getElementById('snow-canvas');
  if (snowCanvas) snowCanvas.remove();
  createSnow();
  
  // Печатаем сообщение и показываем кнопку после завершения
  typeMessageWelcome(getWelcomeMessage(0), 40, true);
  
  // Ждём завершения печати (длина текста * скорость + буфер)
  const messageLength = getWelcomeMessage(0).length;
  setTimeout(() => {
    document.getElementById('readNextWelcome').style.display = 'flex';
  }, messageLength * 40 + 500);
});

  document.getElementById('slot-machine').addEventListener('click', rollAll);
  
  typeMessageSlot(messages[0], 40, true);
  setTimeout(() => {
    document.getElementById('readNextSlot').style.display = 'flex';
    document.getElementById('readBackSlot').style.display = 'none';
  }, 4000);
}*/

// Обработчик кнопки перезапуска
document.getElementById('restartButton').addEventListener('click', () => {
  playSound('click.mp3', 0.5);
  
  // Сбрасываем игру
  score = 500;
  document.getElementById('scoreValue').textContent = score;
  document.getElementById('restartButton').style.display = 'none';
  document.getElementById('giftButton').classList.remove('show');
  document.getElementById('giftBlueButton').style.display = 'none';
  
  // Скрываем сообщение
  typeMessageSlot(messages[0]);
});

// Обработчик закрытия слота
document.getElementById('closeSlot').addEventListener('click', () => {
  /*if (!soundsUnlocked) unlockSounds();
  if (soundsUnlocked) clickSound.play();*/
  playSound('click.mp3', 0.5);
  document.getElementById('slotMachineApp').style.display = 'none';
  document.getElementById('welcomeScreen').style.display = 'block';
  
  welcomePhase = 0;
  updateIconVisibility();
  updateProgressBar();
  
  // Скрываем кнопки до окончания печати
  document.getElementById('readNextWelcome').style.display = 'none';
  document.getElementById('readBackWelcome').style.display = 'none';
  
  // Перезапускаем снег
  const snowCanvas = document.getElementById('snow-canvas');
  if (snowCanvas) snowCanvas.remove();
  createSnow();
  
  // Печатаем сообщение и показываем кнопку после завершения
  typeMessageWelcome(getWelcomeMessage(0), 40, true);
  
  // Ждём завершения печати (длина текста * скорость + буфер)
  const messageLength = getWelcomeMessage(0).length;
  setTimeout(() => {
    document.getElementById('readNextWelcome').style.display = 'flex';
  }, messageLength * 40 + 500);
});

/*function adjustAppScale() {
  const wrapper = document.querySelector('.webapp-wrapper');
  if (!wrapper) return;
  
  // Используем clientWidth вместо innerWidth (точнее для iOS)
  const screenWidth = document.documentElement.clientWidth;
  const designWidth = 608;
  
  // Масштабируем ТОЛЬКО если экран уже дизайна
  const scale = screenWidth < designWidth ? screenWidth / designWidth : 1;
  
  wrapper.style.transform = `scale(${scale})`;
  wrapper.style.width = `${designWidth}px`;
  wrapper.style.height = '1080px';
  
  // Убираем скролл
  document.body.style.overflow = 'hidden';
  
  // Фикс для iOS: предотвращаем "прыжки" при скролле
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
}*/
function adjustAppScale() {
  const wrapper = document.querySelector('.webapp-wrapper');
  if (!wrapper) return;
  
  const screenWidth = document.documentElement.clientWidth;
  const designWidth = 608;
  const scale = screenWidth < designWidth ? screenWidth / designWidth : 1;
  
  wrapper.style.transform = `scale(${scale})`;
  wrapper.style.width = `${designWidth}px`;
  wrapper.style.height = '1080px';
  
  document.body.style.overflow = 'hidden';
  // УДАЛИ ЭТИ СТРОКИ:
  // document.body.style.position = 'fixed';
  // document.body.style.width = '100%';
}

// Запускаем с задержкой для iOS
window.addEventListener('load', () => {
  setTimeout(adjustAppScale, 100);
});

// Обновляем при изменении размера
window.addEventListener('resize', () => {
  setTimeout(adjustAppScale, 100);
});

// Для Telegram
if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.onEvent('viewportChanged', () => {
    setTimeout(adjustAppScale, 100);
  });
}


