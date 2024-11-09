'use client';

import React from 'react';
import {useRouter} from "next/navigation";
import useKeyboardNavigation from "@/hooks/useKeyboardNavigation";
import ServiceInfo from "@/components/ServiceInfo";

const asciiArt = `
........................./........................ 
......................../........................
,....................../........................
,,..................../........................
,,,................../........................
,,,,...............,/........................
,,,,,.............,/........................
,,,,,,............/........................
,,,,,,,.........,/........................
,,,,,,,,......../........................
,,,,,,,,,.....,/........................
,,,,,,,,,,..../........................
,,,,,,,,,,,.,/........................
,,,,,,,,,,,,/........................
,,,,,,,,,,,/........................
,,,,,,,,,,/........................
,,,,,,,,,/........................
,,,,,,,,/........................
,,,,,,,/........................
,,,,,,/,.......................
,,,,,/........................
,,,,/,.......................
,,,/........................
,,/,.......................
,/........................
,,.......................
.......................-..
,.....................-....
,....................-......
,,,.................-........
,,,................-..........
,,,,,.............-............
,,,,,............-..............
,,,,,,,.........-................
,,,,,,,........-..................
,,,,,,,,,.....-....................
,,,,,,,,,...,-......................
,,,,,,,,,,,.-........................
,,,,,,,,,,,-..........................
,,,,,,,,,,-............................
,,,,,,,,,-..............................
,,,,,,,,-................................
,,,,,,,-..................................
,,,,,,-,...................................
,,,,,-......................................
,,,,-,.......................................
,,,-,,........................................
,,-,,,,........................................
,-,,,,,,........................................
-,,,,,,,,........................................
`;

const ComponentInfo = {
    title: '프론트엔드를 위한 백엔드',
    serviceName: 'BFF',
    version: 'Kotlin 1.5.31, Spring WebFlux 5.3.10',
    url: 'https://api.kwt.co.kr/',
    information: '프론트엔드로 들어온 페이지 호출에 필요한 데이터를 수집하고,' +
        ' 필요한 데이터를 수집하여 프론트엔드에 전달하는 역할을 합니다.' +
        ' Kotlin과 Spring WebFlux를 사용하여 구현했습니다.',
};

const BffPage: React.FC = () => {
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

export default BffPage;