// UI Elements
const launchButton = document.getElementById('launch');
const destinationSelect = document.getElementById('destination');
const speedDisplay = document.getElementById('speed');
const distanceTraveledDisplay = document.getElementById('distance-traveled');
const distanceToDestinationDisplay = document.getElementById('distance-to-destination');

// Convert light-years to kilometers (1 light-year = 9.461e12 km)
const LY_TO_KM = 9.461e12;

// Global Variables
let isLaunched = false;
let acceleration = 9.81;  // 1g in m/s²
let currentSpeed = 0;
let distanceTraveled = 0;
let totalDistance = 0;
let halfwayPoint = 0;
let journeyStarted = false;
let elapsedTime = 0;
let lastTime = 0;

// Starfield related
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let width, height;
let stars = [];
const numStars = 500;
let starSpeedFactor = 0.05;

// Resize canvas to fill the window
function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Star class
class Star {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = (Math.random() * 2 - 1) * width;
    this.y = (Math.random() * 2 - 1) * height;
    this.z = Math.random() * width;
    this.size = 2;
  }

  update() {
    // Move the star based on the current spacecraft speed
    this.z -= starSpeedFactor * currentSpeed;  // Linked to the spacecraft speed

    if (this.z <= 0) {
      this.reset();
    }

    this.size = (width / this.z) * 0.5;  // Perspective scaling
  }

  draw() {
    ctx.beginPath();
    const x = (this.x / this.z) * width + width / 2;
    const y = (this.y / this.z) * height + height / 2;
    ctx.arc(x, y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
}

// Create stars
function createStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
  }
}
createStars();

// Launch process
function startJourney() {
  if (isLaunched) return;

  const selectedOption = destinationSelect.options[destinationSelect.selectedIndex];
  const lightYears = parseFloat(selectedOption.dataset.distance);
  totalDistance = lightYears * LY_TO_KM;
  halfwayPoint = totalDistance / 2;

  isLaunched = true;
  journeyStarted = true;
  lastTime = Date.now();

  currentSpeed = 0;
  distanceTraveled = 0;
  elapsedTime = 0;
  
  updateUI();
}

// Launch button event
launchButton.addEventListener('click', startJourney);

// Physics update for journey
function updateJourney(deltaTime) {
  if (!journeyStarted) return;

  const dt = deltaTime / 1000;

  if (distanceTraveled < halfwayPoint) {
    currentSpeed += acceleration * dt / 1000;  // Accelerate
    distanceTraveled += currentSpeed * dt;
  } else {
    currentSpeed -= acceleration * dt / 1000;  // Decelerate
    distanceTraveled += currentSpeed * dt;

    if (currentSpeed <= 0) {
      currentSpeed = 0;
      journeyStarted = false;
      isLaunched = false;
    }
  }

  starSpeedFactor = currentSpeed / 50;  // Update starfield speed factor

  updateUI();
}

// Update UI elements based on current values
function updateUI() {
  speedDisplay.textContent = currentSpeed.toFixed(2);
  distanceTraveledDisplay.textContent = distanceTraveled.toFixed(2);
  distanceToDestinationDisplay.textContent = (totalDistance - distanceTraveled).toFixed(2);
}

// Combined animation loop
function animate() {
  const now = Date.now();
  const deltaTime = now - lastTime;

  // Update the journey
  if (journeyStarted) {
    updateJourney(deltaTime);
  }

  // Update and draw the starfield
  ctx.clearRect(0, 0, width, height);
  stars.forEach(star => {
    star.update();
    star.draw();
  });

  lastTime = now;
  requestAnimationFrame(animate);
}

// Start the animation loop
animate();
