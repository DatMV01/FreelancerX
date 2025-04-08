import Confetti from "react-confetti";
import { useEffect, useState } from "react";

export default function Step3Success() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Tắt confetti sau vài giây để tránh gây khó chịu
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center p-8">
      {showConfetti && <Confetti />}
      <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 Order Success!</h2>
      <p className="text-gray-600">Thank you for your purchase. We'll be in touch soon.</p>
    </div>
  );
}
