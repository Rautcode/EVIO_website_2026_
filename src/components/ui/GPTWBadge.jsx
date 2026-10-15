import React from 'react';

export const GPTWBadge = ({ className = "" }) => {
    return (
        <svg 
            viewBox="0 0 160 250" 
            className={`drop-shadow-lg ${className}`} 
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Top Red Section */}
            <path d="M 0 0 L 160 0 L 160 160 L 0 160 Z" fill="#FF0E3E" />
            
            {/* Bottom Navy Section with Point */}
            <path d="M 0 160 L 160 160 L 160 210 L 80 250 L 0 210 Z" fill="#0B2265" />
            
            {/* Text Elements */}
            <g fontFamily="Inter, sans-serif" fontWeight="800" fill="white">
                <text x="16" y="44" fontSize="30" letterSpacing="-0.5">Great</text>
                <text x="16" y="80" fontSize="30" letterSpacing="-0.5">Place</text>
                <text x="16" y="116" fontSize="30" letterSpacing="-0.5">To</text>
                <text x="16" y="152" fontSize="30" letterSpacing="-0.5">Work<tspan fontSize="12" dy="-14">®</tspan></text>
                
                <text x="80" y="196" fontSize="22" textAnchor="middle" letterSpacing="0.5">Certified</text>
                
                <text x="80" y="216" fontSize="10" fontWeight="600" textAnchor="middle" opacity="0.9">AUG 2023 - AUG 2024</text>
                <text x="80" y="234" fontSize="12" textAnchor="middle">INDIA</text>
            </g>
        </svg>
    );
};
