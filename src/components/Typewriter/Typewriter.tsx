import React, { useState, useEffect, useRef } from 'react';
import { Paper, type TypedChar } from './Paper';
import { CONSTANTS } from './constants';
import { Toolbar } from '../Controls/Toolbar';
import { exportToImage, exportToPDF } from '../../utils/export';
import { soundManager } from '../../utils/SoundManager';
import { Machine } from './Machine';
import { Carriage } from './Carriage';
import './Typewriter.css';

export const Typewriter: React.FC = () => {
    // --- STATE ---
    const [chars, setChars] = useState<TypedChar[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<number | null>(null);

    // Cursor Position on the PAPER
    // Start: Right Margin for Hebrew
    const startPaperX = CONSTANTS.PAPER_WIDTH_PX - CONSTANTS.MARGIN_RIGHT;
    const startPaperY = CONSTANTS.MARGIN_TOP;

    const [cursor, setCursor] = useState({ x: startPaperX, y: startPaperY });
    const paperRef = useRef<HTMLDivElement>(null);

    // --- HAMMER MECHANICS ---
    // Fix 1: Page starts too low -> Move Hammer offset UP (more negative Y).
    // The text needs to be visible.
    const HAMMER_OFFSET_Y = -600;
    const HAMMER_OFFSET_X = 0;    // Center screen

    // Fix 2: Right side alignment
    // Logic: CarriageX = ScreenCenter - CursorPaperX.
    // If Cursor is at 900 (Right), Carriage shifts -900.
    // This visually places the 900th pixel at Center. Correct.
    // Previous logic had + Width/2 which centered the *paper* instead of the *cursor*.
    const carriageX = HAMMER_OFFSET_X - cursor.x;
    const carriageY = HAMMER_OFFSET_Y - cursor.y;

    // --- AUDIO INIT ---
    useEffect(() => {
        const initAudio = () => {
            soundManager.playTypeSound();
            window.removeEventListener('click', initAudio);
            window.removeEventListener('keydown', initAudio);
        };
        window.addEventListener('click', initAudio);
        window.addEventListener('keydown', initAudio);
        return () => {
            window.removeEventListener('click', initAudio);
            window.removeEventListener('keydown', initAudio);
        }
    }, []);

    // --- INPUT HANDLER ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;

            const { key } = e;

            // Arrow Keys - Roller Movement
            if (key === 'ArrowUp') {
                // Move Cursor Up (Previous Line)
                setCursor(prev => ({ ...prev, y: prev.y - CONSTANTS.LINE_HEIGHT }));
                return;
            }

            if (key === 'ArrowDown') {
                // Move Cursor Down (Next Line)
                setCursor(prev => ({ ...prev, y: prev.y + CONSTANTS.LINE_HEIGHT }));
                return;
            }

            // Fix 3: Lightning speed animation
            if (key.length === 1 || key === 'Enter' || key === 'Backspace') {
                setIsTyping(true);
                if (typingTimeoutRef.current) {
                    window.clearTimeout(typingTimeoutRef.current);
                }
                // Reduce hold time to 50ms for snappy feel
                typingTimeoutRef.current = window.setTimeout(() => {
                    setIsTyping(false);
                }, 50);
            }

            if (key === 'Backspace') {
                soundManager.playTypeSound(); // Or maybe a different sound for backspace?
                // REALISM: Backspace does NOT delete. It just moves back to overwrite.
                // setChars(prev => prev.slice(0, -1)); // REMOVED

                // Move Cursor Backward (Right for RTL)
                setCursor(prev => ({
                    ...prev,
                    x: Math.min(prev.x + CONSTANTS.CHAR_WIDTH, CONSTANTS.PAPER_WIDTH_PX - CONSTANTS.MARGIN_RIGHT)
                }));
                return;
            }

            if (key === 'Enter') {
                soundManager.playReturnSound();
                setCursor(prev => ({
                    x: startPaperX,
                    y: prev.y + CONSTANTS.LINE_HEIGHT
                }));
                return;
            }

            if (key.length === 1) {
                // Check if we hit the left margin boundary
                let currentCursor = cursor;

                if (currentCursor.x - CONSTANTS.CHAR_WIDTH < CONSTANTS.MARGIN_LEFT) {
                    // Auto Return
                    soundManager.playReturnSound();
                    currentCursor = {
                        x: startPaperX,
                        y: currentCursor.y + CONSTANTS.LINE_HEIGHT
                    };
                } else {
                    soundManager.playTypeSound();
                }

                // If it's a space, we just move? 
                // A real typewriter actually triggers the mechanism for space too, just no hammer strike.
                // But usually the spacebar is distinct.
                // User said "spacebar to go forward".
                // We'll treat Space as a character for now (it renders nothing but moves cursor).
                // Actually, if we want to overwrite, we need to KNOW if we are overwriting?
                // No, just rendering on top is fine.

                // Jitter settings
                const jitterX = (Math.random() - 0.5) * 1.5;
                const jitterY = (Math.random() - 0.5) * 1.5;
                const rotation = (Math.random() - 0.5) * 2;
                const opacity = 0.9 + Math.random() * 0.1;

                // Don't render invisible chars if we don't want to pollute DOM, but for export we might need them?
                // Actually, spaces are needed for word spacing.

                const newChar: TypedChar = {
                    id: Math.random().toString(36).substr(2, 9),
                    char: key,
                    x: currentCursor.x + jitterX,
                    y: currentCursor.y + jitterY,
                    rotation,
                    opacity
                };

                setChars(prev => [...prev, newChar]);

                // Move Cursor Forward (Left for RTL)
                setCursor({
                    ...currentCursor,
                    x: currentCursor.x - CONSTANTS.CHAR_WIDTH
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cursor, startPaperX]);

    // --- EXPORT HANDLERS ---
    const handleExportImage = () => {
        if (paperRef.current) exportToImage(paperRef.current);
    };
    const handleExportPDF = () => {
        if (paperRef.current) exportToPDF(paperRef.current);
    };
    const handleClear = () => {
        setChars([]);
        setCursor({ x: startPaperX, y: startPaperY });
    };

    return (
        <div className="typewriter-container">
            <Toolbar
                onExportImage={handleExportImage}
                onExportPDF={handleExportPDF}
                onClear={handleClear}
            />

            <Machine isTyping={isTyping}>
                <Carriage x={carriageX} y={carriageY}>
                    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                        <defs>
                            <filter id="ink-bleed">
                                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" result="noise" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
                                <feGaussianBlur stdDeviation="0.4" />
                            </filter>
                        </defs>
                    </svg>
                    <Paper ref={paperRef} chars={chars} />
                </Carriage>
            </Machine>
        </div>
    );
};
