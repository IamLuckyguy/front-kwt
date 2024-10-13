import { useCallback, useEffect, useState } from 'react';
import { playBeep, playSelectSound } from '@/utils/audio';

type ButtonType = 'view' | 'back' | null;

const useKeyboardNavigation = (onView: () => void, onBack: () => void) => {
    const [selectedButton, setSelectedButton] = useState<ButtonType>(null);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                playBeep();
                setSelectedButton((prev) => (prev === 'back' ? 'view' : 'back'));
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                playBeep();
                setSelectedButton((prev) => (prev === 'view' ? 'back' : 'view'));
                break;
            case 'Enter':
            case ' ':
                playSelectSound();
                if (selectedButton === 'view') {
                    onView();
                } else if (selectedButton === 'back') {
                    onBack();
                }
                break;
            default:
                break;
        }
    }, [selectedButton, onView, onBack]);

    const handleMouseOver = (field: ButtonType) => {
        playBeep();
        setSelectedButton(field);
    };

    const handleButtonClick = (field: ButtonType) => {
        playSelectSound();
        if (field === 'view') {
            onView();
        } else if (field === 'back') {
            onBack();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return { selectedButton, setSelectedButton, handleMouseOver, handleButtonClick };
};

export default useKeyboardNavigation;