import React from 'react';
import './Carriage.css';

interface CarriageProps {
    x: number;
    y: number;
    children: React.ReactNode;
}

export const Carriage: React.FC<CarriageProps> = ({ x, y, children }) => {
    return (
        <div
            className="carriage"
            style={{ transform: `translate(${x}px, ${y}px)` }}
        >
            {children}
        </div>
    );
};
