import React, { ReactNode, MouseEventHandler } from "react";

interface GradientButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  gradientColors: string[];
  height?: string;
  children: ReactNode;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  onClick,
  disabled = false,
  gradientColors,
  height = "48px",
  children,
}: GradientButtonProps) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      style={{
        height: height,
        marginTop: "8px",
        background: `linear-gradient(108.32deg, ${gradientColors.join(", ")})`,
        opacity: disabled ? "0.5" : "1",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default GradientButton;
