import { useEffect, useRef, useState } from "react";
import { TopAppBar } from "~/components/TopAppBar";
import { useNavigate } from "react-router";

const FlappyBird = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  // Game constants
  const GRAVITY = 0.5;
  const JUMP_FORCE = -10;
  const PIPE_SPEED = 2;
  const PIPE_GAP = 180;
  const PIPE_SPAWN_INTERVAL = 2000;

  // Game state
  const birdRef = useRef({
    x: 50,
    y: 250,
    velocity: 0,
    width: 40,
    height: 30,
    rotation: 0,
  });

  const pipesRef = useRef<
    Array<{
      x: number;
      topHeight: number;
      bottomY: number;
      width: number;
      passed?: boolean;
    }>
  >([]);

  const lastPipeSpawnRef = useRef(0);

  // Sound effects
  const playJumpSound = () => {
    const audio = new Audio("/sounds/jump.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const playScoreSound = () => {
    const audio = new Audio("/sounds/score.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const playGameOverSound = () => {
    const audio = new Audio("/sounds/game-over.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  // Game loop
  useEffect(() => {
    if (!canvasRef.current || !started) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = 0;

    const gameLoop = (timestamp: number) => {
      if (!ctx || gameOver) return;

      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#87CEEB"); // Sky blue
      gradient.addColorStop(0.5, "#B0E0E6"); // Powder blue
      gradient.addColorStop(1, "#E0F6FF"); // Light blue
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw clouds
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      for (let i = 0; i < 3; i++) {
        const x = ((timestamp / 2000 + i * 200) % (canvas.width + 100)) - 50;
        ctx.beginPath();
        ctx.arc(x, 100, 20, 0, Math.PI * 2);
        ctx.arc(x + 15, 100, 25, 0, Math.PI * 2);
        ctx.arc(x + 30, 100, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update bird
      birdRef.current.velocity += GRAVITY;
      birdRef.current.y += birdRef.current.velocity;
      birdRef.current.rotation = Math.min(
        Math.max(birdRef.current.velocity * 2, -30),
        90
      );

      // Debug logs
      console.log("Bird position:", {
        x: birdRef.current.x,
        y: birdRef.current.y,
        width: birdRef.current.width,
        height: birdRef.current.height,
      });

      // Check if bird hits the ground or ceiling with a small buffer
      if (
        birdRef.current.y + birdRef.current.height > canvas.height - 5 ||
        birdRef.current.y < 5
      ) {
        setGameOver(true);
        return;
      }

      // Spawn pipes
      if (timestamp - lastPipeSpawnRef.current > PIPE_SPAWN_INTERVAL) {
        const topHeight = Math.random() * (canvas.height - PIPE_GAP - 100) + 50;
        pipesRef.current.push({
          x: canvas.width,
          topHeight,
          bottomY: topHeight + PIPE_GAP,
          width: 50,
        });
        lastPipeSpawnRef.current = timestamp;
      }

      // Update and draw pipes
      pipesRef.current = pipesRef.current.filter((pipe) => {
        pipe.x -= PIPE_SPEED;

        // Check collision with adjusted hitbox
        if (
          birdRef.current.x + birdRef.current.width - 5 > pipe.x &&
          birdRef.current.x + 5 < pipe.x + pipe.width &&
          (birdRef.current.y + 5 < pipe.topHeight ||
            birdRef.current.y + birdRef.current.height - 5 > pipe.bottomY)
        ) {
          console.log("Collision detected:", {
            bird: {
              x: birdRef.current.x,
              y: birdRef.current.y,
              width: birdRef.current.width,
              height: birdRef.current.height,
            },
            pipe: {
              x: pipe.x,
              topHeight: pipe.topHeight,
              bottomY: pipe.bottomY,
              width: pipe.width,
            },
          });
          setGameOver(true);
          return false;
        }

        // Check if passed pipe
        if (pipe.x + pipe.width < birdRef.current.x && !pipe.passed) {
          setScore((prev) => prev + 1);
          pipe.passed = true;
        }

        return pipe.x + pipe.width > 0;
      });

      // Draw bird with rotation and better design
      ctx.save();
      ctx.translate(
        birdRef.current.x + birdRef.current.width / 2,
        birdRef.current.y + birdRef.current.height / 2
      );
      ctx.rotate((birdRef.current.rotation * Math.PI) / 180);

      // Bird body (main circle) with gradient color
      const bodyGradient = ctx.createRadialGradient(
        0,
        0,
        0,
        0,
        0,
        birdRef.current.width / 2
      );
      bodyGradient.addColorStop(0, "#FFD700"); // Bright yellow center
      bodyGradient.addColorStop(1, "#FFA500"); // Orange edges
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        birdRef.current.width / 2,
        birdRef.current.height / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Bird wing with smoother animation
      const wingAngle = Math.sin(timestamp / 100) * 0.3;
      ctx.save();
      ctx.rotate(wingAngle);
      const wingGradient = ctx.createLinearGradient(-25, -15, -25, 15);
      wingGradient.addColorStop(0, "#FF8C00"); // Dark orange
      wingGradient.addColorStop(1, "#FFA500"); // Light orange
      ctx.fillStyle = wingGradient;
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.quadraticCurveTo(-25, -20, -30, 0);
      ctx.quadraticCurveTo(-25, 20, -10, 0);
      ctx.fill();
      ctx.restore();

      // Bird eye with cute design
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(5, -5, 5, 0, Math.PI * 2);
      ctx.fill();

      // Eye highlight
      ctx.fillStyle = "#FFF";
      ctx.beginPath();
      ctx.arc(7, -7, 2, 0, Math.PI * 2);
      ctx.fill();

      // Bird beak with enhanced gradient and details
      const beakGradient = ctx.createLinearGradient(15, -5, 25, 5);
      beakGradient.addColorStop(0, "#FF4500"); // Orange-red
      beakGradient.addColorStop(0.5, "#FF6347"); // Tomato
      beakGradient.addColorStop(1, "#FF4500"); // Orange-red
      ctx.fillStyle = beakGradient;
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(25, -5);
      ctx.lineTo(25, 5);
      ctx.closePath();
      ctx.fill();

      // Add beak highlight for 3D effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(23, -3);
      ctx.lineTo(23, 3);
      ctx.closePath();
      ctx.fill();

      // Add beak outline for definition
      ctx.strokeStyle = "#FF4500";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(25, -5);
      ctx.lineTo(25, 5);
      ctx.closePath();
      ctx.stroke();

      // Bird tail with gradient
      const tailGradient = ctx.createLinearGradient(-15, -10, -15, 10);
      tailGradient.addColorStop(0, "#FF8C00"); // Dark orange
      tailGradient.addColorStop(1, "#FFA500"); // Light orange
      ctx.fillStyle = tailGradient;
      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.quadraticCurveTo(-25, -15, -30, 0);
      ctx.quadraticCurveTo(-25, 15, -15, 0);
      ctx.fill();

      // Add cute blush marks
      ctx.fillStyle = "rgba(255, 182, 193, 0.5)"; // Light pink
      ctx.beginPath();
      ctx.arc(-5, 5, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(5, 5, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Draw pipes with better design
      pipesRef.current.forEach((pipe) => {
        // Top pipe
        const topGradient = ctx.createLinearGradient(
          pipe.x,
          0,
          pipe.x + pipe.width,
          0
        );
        topGradient.addColorStop(0, "#1E8449"); // Darker green
        topGradient.addColorStop(0.5, "#27AE60"); // Medium green
        topGradient.addColorStop(1, "#1E8449"); // Darker green
        ctx.fillStyle = topGradient;
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);

        // Top pipe edge with 3D effect and pattern
        const edgeGradient = ctx.createLinearGradient(
          pipe.x - 5,
          pipe.topHeight - 10,
          pipe.x + pipe.width + 5,
          pipe.topHeight - 10
        );
        edgeGradient.addColorStop(0, "#145A32"); // Darkest green
        edgeGradient.addColorStop(0.5, "#1E8449"); // Medium dark green
        edgeGradient.addColorStop(1, "#145A32"); // Darkest green
        ctx.fillStyle = edgeGradient;
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 10, pipe.width + 10, 10);

        // Add decorative pattern to top pipe edge
        ctx.fillStyle = "#2ECC71"; // Light green for pattern
        for (let i = 0; i < pipe.width + 10; i += 10) {
          ctx.fillRect(pipe.x - 5 + i, pipe.topHeight - 8, 5, 2);
        }

        // Top pipe highlight for 3D effect
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(pipe.x, 0, pipe.width, 5);

        // Add vertical stripes to top pipe
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        for (let i = 0; i < pipe.width; i += 15) {
          ctx.fillRect(pipe.x + i, 0, 5, pipe.topHeight);
        }

        // Bottom pipe
        const bottomGradient = ctx.createLinearGradient(
          pipe.x,
          pipe.bottomY,
          pipe.x + pipe.width,
          pipe.bottomY
        );
        bottomGradient.addColorStop(0, "#1E8449"); // Darker green
        bottomGradient.addColorStop(0.5, "#27AE60"); // Medium green
        bottomGradient.addColorStop(1, "#1E8449"); // Darker green
        ctx.fillStyle = bottomGradient;
        ctx.fillRect(
          pipe.x,
          pipe.bottomY,
          pipe.width,
          canvas.height - pipe.bottomY
        );

        // Bottom pipe edge with 3D effect and pattern
        ctx.fillStyle = edgeGradient;
        ctx.fillRect(pipe.x - 5, pipe.bottomY, pipe.width + 10, 10);

        // Add decorative pattern to bottom pipe edge
        ctx.fillStyle = "#2ECC71"; // Light green for pattern
        for (let i = 0; i < pipe.width + 10; i += 10) {
          ctx.fillRect(pipe.x - 5 + i, pipe.bottomY + 2, 5, 2);
        }

        // Bottom pipe highlight for 3D effect
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, 5);

        // Add vertical stripes to bottom pipe
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        for (let i = 0; i < pipe.width; i += 15) {
          ctx.fillRect(
            pipe.x + i,
            pipe.bottomY,
            5,
            canvas.height - pipe.bottomY
          );
        }

        // Add pipe shadows for depth
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        ctx.fillRect(pipe.x - 2, 0, 2, pipe.topHeight);
        ctx.fillRect(pipe.x - 2, pipe.bottomY, 2, canvas.height - pipe.bottomY);

        // Add decorative elements (leaves/vines)
        ctx.fillStyle = "#2ECC71";
        ctx.beginPath();
        ctx.moveTo(pipe.x + pipe.width / 2, pipe.topHeight - 10);
        ctx.quadraticCurveTo(
          pipe.x + pipe.width / 2 + 20,
          pipe.topHeight - 30,
          pipe.x + pipe.width / 2 + 10,
          pipe.topHeight - 20
        );
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(pipe.x + pipe.width / 2, pipe.bottomY + 10);
        ctx.quadraticCurveTo(
          pipe.x + pipe.width / 2 + 20,
          pipe.bottomY + 30,
          pipe.x + pipe.width / 2 + 10,
          pipe.bottomY + 20
        );
        ctx.fill();
      });

      // Draw score with better styling
      ctx.fillStyle = "#000";
      ctx.font = "bold 32px Arial";
      ctx.strokeStyle = "#FFF";
      ctx.lineWidth = 4;
      ctx.strokeText(`Score: ${score}`, 20, 40);
      ctx.fillText(`Score: ${score}`, 20, 40);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [started, gameOver, score]);

  // Handle jump
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (!started) {
          setStarted(true);
        } else if (!gameOver) {
          birdRef.current.velocity = JUMP_FORCE;
        } else {
          // Reset game
          setGameOver(false);
          setScore(0);
          setStarted(true);
          birdRef.current = {
            x: 50,
            y: 250,
            velocity: 0,
            width: 40,
            height: 30,
            rotation: 0,
          };
          pipesRef.current = [];
          lastPipeSpawnRef.current = 0;
        }
      }
    };

    const handleTouch = () => {
      if (!started) {
        setStarted(true);
      } else if (!gameOver) {
        birdRef.current.velocity = JUMP_FORCE;
      } else {
        // Reset game
        setGameOver(false);
        setScore(0);
        setStarted(true);
        birdRef.current = {
          x: 50,
          y: 250,
          velocity: 0,
          width: 40,
          height: 30,
          rotation: 0,
        };
        pipesRef.current = [];
        lastPipeSpawnRef.current = 0;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("touchstart", handleTouch);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [started, gameOver]);

  // Update score handling
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("flappyBirdHighScore", score.toString());
    }
  }, [score]);

  // Load high score
  useEffect(() => {
    const savedHighScore = localStorage.getItem("flappyBirdHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-sky-400 via-blue-400 to-blue-500 min-h-screen">
      <TopAppBar onBack={() => navigate("/games")} title="Flappy Bird" />
      <div className="relative flex flex-col items-center justify-center h-full">
        <canvas
          ref={canvasRef}
          width={400}
          height={600}
          className="rounded-xl shadow-2xl border-4 border-white/20"
        />

        {/* Tutorial Screen */}
        {showTutorial && !started && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-center  /90 p-8 rounded-xl shadow-2xl max-w-md mx-4 animate-fade-in">
              <h1 className="text-4xl font-bold text-yellow-500 mb-4">
                Flappy Bird
              </h1>
              <div className="space-y-4 mb-6">
                <p className="text-lg text-gray-700">🎮 How to Play:</p>
                <ul className="text-left space-y-2 text-gray-600">
                  <li>• Press Space or Tap to make the bird fly</li>
                  <li>• Avoid hitting the pipes</li>
                  <li>• Try to get the highest score!</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setShowTutorial(false);
                  setStarted(true);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center  /90 p-8 rounded-xl shadow-2xl max-w-md mx-4">
              <h2 className="text-3xl font-bold text-red-500 mb-4">
                Game Over
              </h2>
              <div className="space-y-2 mb-6">
                <p className="text-2xl font-semibold text-gray-800">
                  Score: {score}
                </p>
                <p className="text-xl font-semibold text-yellow-500">
                  High Score: {highScore}
                </p>
              </div>
              <button
                onClick={() => {
                  setGameOver(false);
                  setScore(0);
                  setStarted(true);
                  birdRef.current = {
                    x: 50,
                    y: 250,
                    velocity: 0,
                    width: 40,
                    height: 30,
                    rotation: 0,
                  };
                  pipesRef.current = [];
                  lastPipeSpawnRef.current = 0;
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlappyBird;
