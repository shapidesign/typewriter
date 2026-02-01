import React from 'react';
import './Toolbar.css';

interface ToolbarProps {
    onExportImage: () => void;
    onExportPDF: () => void;
    onClear: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onExportImage, onExportPDF, onClear }) => {
    return (
        <div className="toolbar">
            <div className="toolbar-group">
                <button onClick={onExportImage} className="tool-btn">Export PNG</button>
                <button onClick={onExportPDF} className="tool-btn">Export PDF</button>
            </div>
            <div className="toolbar-group">
                <button onClick={onClear} className="tool-btn danger">Clear Paper</button>
            </div>
        </div>
    );
};
