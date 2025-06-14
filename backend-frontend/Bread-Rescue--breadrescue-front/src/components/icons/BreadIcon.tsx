
import React from 'react';

interface BreadIconProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const BreadIcon: React.FC<BreadIconProps> = ({
  className,
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Baguette/long bread (🥖) shape */}
      <path d="M2.5 7.5C2.5 5 4 3.5 7 3.5C14 3.5 17 3.5 17 3.5C20 3.5 21.5 5 21.5 7.5C21.5 10 20 11.5 17 11.5H7C4 11.5 2.5 13 2.5 15.5C2.5 18 4 19.5 7 19.5C14 19.5 17 19.5 17 19.5" />
      {/* Bread scoring/cuts on top */}
      <path d="M5 7.5L7 5.5" />
      <path d="M9 7.5L11 5.5" />
      <path d="M13 7.5L15 5.5" />
      <path d="M5 15.5L7 13.5" />
      <path d="M9 15.5L11 13.5" />
      <path d="M13 15.5L15 13.5" />
    </svg>
  );
};

export default BreadIcon;
