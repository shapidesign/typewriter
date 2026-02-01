import twOff from '../../assets/new-tw-off.png';
import twOn from '../../assets/new-to-on.png';
import './Machine.css';

interface MachineProps {
    children: React.ReactNode;
    isTyping: boolean;
}

export const Machine: React.FC<MachineProps> = ({ children, isTyping }) => {
    return (
        <div className="machine-wrapper">
            <div className="carriage-layer">
                {children}
            </div>

            <div className="machine-layer">
                {/* Preload both images or valid caching. Toggle visibility for instant switch */}
                <img
                    src={twOff}
                    alt="Typewriter Idle"
                    className={`typewriter-img ${!isTyping ? 'active' : ''}`}
                    style={{ opacity: isTyping ? 0 : 1, position: 'absolute', bottom: 0 }}
                />
                <img
                    src={twOn}
                    alt="Typewriter Active"
                    className={`typewriter-img ${isTyping ? 'active' : ''}`}
                    style={{ opacity: isTyping ? 1 : 0, position: 'absolute', bottom: 0 }}
                />
            </div>
        </div>
    );
};
