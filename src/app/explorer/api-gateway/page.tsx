'use client';

import React from 'react';
import {useRouter} from "next/navigation";
import useKeyboardNavigation from "@/hooks/useKeyboardNavigation";
import ServiceInfo from "@/components/ServiceInfo";

const asciiArt = `
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@ ~--~@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@-----------~@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@---------------@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@----------------- @@--@@@@@@@@@@@
@@@@@@@@@@@@@@@@--------------------@--@@@@@@@@@@@
@@@@@@@@@@@@@@@------------------------@@@@@@@@@@@
@@@@@@@@@@@@@------------------------@-@@@@@@@@@@@
@@@@@@@@@@@@@-----------------------@@@-@@@@@@@@@@
@@@@@@@@@@@@@----------------------@@@@-@@@@@@@@@@
@@@@@@@@@@------------------------@@@@@-@@@@@@@@@@
@@@@@@@--------------------------@@@@@@-@@@@@@@@@@
@@@@@@------------------,,,,,:;@@@@@@@@--@@@@@@@@@
@@@@@----------------@@@@@@@@@@@@@@@@@@----@@@@@@@
@@@@---------------@@@@@@@@@@@@@@@@--@@-----@@@@@@
@@@@--------------@@@@@@@@@@@@@@@@---@@------@@@@@
@@@--------------@@@@@@@@@@@@@@@@@--@@@------@@@@@
@@@--------------@@@@@@@@@@@@@@@@---@@@-------@@@@
@@@-------------@@@@@@@@@@@@@@@@@-~@@@@--------@@@
@@--------------@@@@@@@@@@@@@@@---@@@@@--------@@@
@@--------------@@@@@@@@@@@@@----@@@@@@--------@@@
@@--------------@@@@@@@@@@@@----~@@@@@@--------@@@
@@--------------,@@@@@@@@@@-----@@@@@@---------@@@
@@@--------------@@@@@@@-------@@@@@@@---------@@@
@@@--------------,,,,-------@@@@@@@;:----------@@@
@@@@----------------------@@@@@@@ -------------@@@
@@@@------------,-----------------------------@@@@
@@@@@-----------------------------------------@@@@
@@@@@@---------------------------------------@@@@@
@@@@@@~-------------------------------------@@@@@@
@@@@@@@@@---------------------------------@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
`;

const ComponentInfo = {
    title: '게이트웨이',
    serviceName: 'API Gateway',
    version: '4.1.5',
    url: 'https://api.kwt.co.kr/',
    information: 'Spring Cloud Gateway를 이용한 API Gateway입니다. 클라이언트의 요청을 적절한 서비스로 라우팅하며 인증/인가 및 로깅을 수행합니다.',
};

const GatewayPage: React.FC = () => {
    const router = useRouter();

    const { selectedButton, handleMouseOver, handleButtonClick } = useKeyboardNavigation(
        () => window.open(ComponentInfo.url, '_blank'),
        () => router.push('/explorer')
    );

    return (
        <ServiceInfo
            title={ComponentInfo.title}
            asciiArt={asciiArt}
            serviceName={ComponentInfo.serviceName}
            version={ComponentInfo.version}
            information={ComponentInfo.information}
            url={ComponentInfo.url}
            selectedButton={selectedButton}
            handleMouseOver={handleMouseOver}
            handleButtonClick={handleButtonClick}
        />
    );
};

export default GatewayPage;