const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];
const numStars = 500;  // Number of stars in the field
const speed = 0.05;    // Speed of the stars moving towards the viewer

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

  // Randomly reset star position and depth
  reset() {
    this.x = (Math.random() * 2 - 1) * width;  // Random x position
    this.y = (Math.random() * 2 - 1) * height; // Random y position
    this.z = Math.random() * width;            // Random depth
    this.size = 2;                             // Initial size
  }

  // Update star position and size based on depth
  update() {
    this.z -= speed * 10;  // Move the star closer (towards the viewer)
    
    if (this.z <= 0) {
      this.reset();  // If the star reaches the viewer, reset it
    }

    this.size = (width / this.z) * 0.5;  // Size based on depth
  }

  // Draw the star
  draw() {
    ctx.beginPath();
    const x = (this.x / this.z) * width + width / 2;  // Perspective calculation for x
    const y = (this.y / this.z) * height + height / 2; // Perspective calculation for y
    ctx.arc(x, y, this.size, 0, Math.PI * 2);  // Draw a circle for the star
    ctx.fillStyle = 'white';
    ctx.fill();
  }
}

// Create star objects
function createStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
  }
}
createStars();

// Animation loop
function animate() {
  ctx.clearRect(0, 0, width, height);  // Clear canvas

  // Update and draw each star
  stars.forEach(star => {
    star.update();
    star.draw();
  });

  requestAnimationFrame(animate);  // Loop the animation
}
animate();
