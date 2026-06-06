import { motion } from "framer-motion";

export default function WaveText({ text = "", className = "", gradient = "" }) {
  const hasGradient = gradient !== "";
  const gradientStyle = hasGradient ? {
    background: gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  } : {};

  return (
    <motion.span
      className={`inline-block ${className}`}
      whileHover="hover"
      whileTap="hover"
      initial="initial"
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          style={hasGradient ? gradientStyle : undefined}
          variants={{
            initial: { y: 0, scale: 1 },
            hover: {
              y: -4,
              scale: 1.2,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 15,
                delay: index * 0.03,
              },
            },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
