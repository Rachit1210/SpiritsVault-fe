// BottleIcon.tsx
import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface BottleIconProps {
  height?: number;
}

const BottleIcon: React.FC<BottleIconProps> = ({ height = 40 }) => {
  return (
    <Svg width={height / 3} height={height} viewBox="0 0 24 72" fill="none">
      {/* Bottle Shape */}
      <Path
        d="M10 0h4v16l2 4v48a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V20l2-4V0z"
        fill="white"
      />
      {/* Neck of the Bottle */}
      <Path
        d="M12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="white"
      />
    </Svg>
  );
};

export default BottleIcon;  // Make sure it's exported as default
