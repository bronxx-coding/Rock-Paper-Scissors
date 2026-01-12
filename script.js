/**
 * Setup
 */
const iconMap = ["banana", "seven", "cherry", "plum", "orange", "bell", "bar", "lemon", "melon"];
const icon_width = 79;
const icon_height = 79;
const num_icons = 9;
const time_per_icon = 100;
let indexes = [0, 0, 0];

/**
 * Roll one reel
 */
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

/**
 * Roll all reels on click
 */
function rollAll() {
  const reelsList = document.querySelectorAll('.slots > .reel');

  // Disable interaction during spin
  const slotMachine = document.getElementById('slot-machine');
  slotMachine.style.pointerEvents = 'none';

  Promise.all([...reelsList].map((reel, i) => roll(reel, i)))
    .then((deltas) => {
      deltas.forEach((delta, i) => {
        indexes[i] = (indexes[i] + delta) % num_icons;
      });

      // Win logic
      if (indexes[0] === indexes[1] || indexes[1] === indexes[2]) {
        const winCls = indexes[0] === indexes[2] ? "win2" : "win1";
        slotMachine.classList.add(winCls);
        setTimeout(() => slotMachine.classList.remove(winCls), 2000);
      }

      // Re-enable interaction
      slotMachine.style.pointerEvents = 'auto';
    });
}

// Attach click handler
document.getElementById('slot-machine').addEventListener('click', rollAll);
