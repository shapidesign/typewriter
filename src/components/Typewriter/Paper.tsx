import { forwardRef } from 'react';
import './Paper.css';

export interface TypedChar {
    id: string;
    char: string;
    x: number;
    y: number;
    rotation: number;
    opacity: number;
}

interface PaperProps {
    chars: TypedChar[];
}

export const Paper = forwardRef<HTMLDivElement, PaperProps>(({ chars }, ref) => {
    return (
        <div className="paper-wrapper">
            <div className="paper-sheet" ref={ref}>
                {chars.map((item) => (
                    <span
                        key={item.id}
                        className="typewriter-char"
                        style={{
                            left: `${item.x}px`,
                            top: `${item.y}px`,
                            transform: `rotate(${item.rotation}deg)`,
                            opacity: item.opacity,
                        }}
                    >
                        {item.char}
                    </span>
                ))}
            </div>
        </div>
    );
});
