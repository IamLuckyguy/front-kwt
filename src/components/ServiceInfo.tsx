import React from 'react';
import TypingText from '@/components/TypingText';

interface ServiceInfoProps {
    title: string;
    asciiArt: string;
    serviceName: string;
    version: string;
    information: string;
    url: string;
    selectedButton: 'view' | 'back' | null;
    handleMouseOver: (field: 'view' | 'back') => void;
    handleButtonClick: (field: 'view' | 'back') => void;
}

const ServiceInfo: React.FC<ServiceInfoProps> = ({
                                                     title,
                                                     asciiArt,
                                                     serviceName,
                                                     version,
                                                     information,
                                                     url,
                                                     selectedButton,
                                                     handleMouseOver,
                                                     handleButtonClick
                                                 }) => {
    return (
        <div className="flex flex-col md:flex-row items-start min-h-screen bg-black text-green-500 p-4">
            <div>
                <div className="w-full md:w-1/2 text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4 font-bold">
                    <TypingText text={title} speed={40} tag={'div'} />
                </div>
                <div id={'ascii-art'} className="w-1/2 mb-4">
                    <TypingText text={asciiArt} speed={10} tag={'pre'} />
                </div>
                <div className="w-1/2 font-mono text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                    {serviceName && (
                        <TypingText text={`서비스: ${serviceName}`} speed={40} tag={'div'} />
                    )}
                    {version && (
                        <TypingText text={`버전: ${version}`} speed={40} tag={'div'} />
                    )}
                    {url && (
                        <TypingText text={`URL: ${url}`} speed={40} tag={'div'} />
                    )}
                    {information && (
                        <TypingText text={`정보: ${information}`} speed={10} tag={'div'} />
                    )}
                </div>
                <div className="mt-4 space-x-4">
                    <button
                        className={`px-4 py-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl ${
                            selectedButton === 'view'
                                ? 'bg-green-500 text-black'
                                : 'bg-black text-green-500 border border-green-500 hover:bg-green-500 hover:text-black'
                        }`}
                        style={{ outline: 'none' }}
                        onMouseOver={() => handleMouseOver('view')}
                        onClick={() => handleButtonClick('view')}
                    >
                        보러가기
                    </button>
                    <button
                        className={`px-4 py-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl ${
                            selectedButton === 'back'
                                ? 'bg-green-500 text-black'
                                : 'bg-black text-green-500 border border-green-500 hover:bg-green-500 hover:text-black'
                        }`}
                        style={{ outline: 'none' }}
                        onMouseOver={() => handleMouseOver('back')}
                        onClick={() => handleButtonClick('back')}
                    >
                        뒤로가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceInfo;