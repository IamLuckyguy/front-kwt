'use client';

import React from 'react';
import {useRouter} from "next/navigation";
import useKeyboardNavigation from "@/hooks/useKeyboardNavigation";
import ServiceInfo from "@/components/ServiceInfo";

const asciiArt = `
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@ @@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@ @@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@  @@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@  @@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@;  @@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@  @@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@  @@   @@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@  @@  @@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@  @@  @@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@  @@  @@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@  @@  @@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@  @@   @@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@  @@   @@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@  @@  @@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@ @@   @@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@ @@ ;@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@  @@@@@@  @@@@@   @@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@   @@@@@@@@@@@@@@@@ :@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@             @@@@@  @@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  @@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@  @@@@@@@@@@@@@* @@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@           @@@ @@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@*   ~@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@           @@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@  @@         @@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@   @@@@@@@@@@@@@@@@@ @@@@@@@@@@@@@@@
@@@@@@@@@@@@@      @@@@@@@@@;@    @@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@~              :@@@  @@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@;;        @@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@:      ;@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
`;

const ComponentInfo = {
    title: '어플리케이션',
    serviceName: 'consumer',
    version: 'Spring WebFlux 6.1.13',
    url: '',
    information: 'Kafka에 생성된 메시지 데이터를 Elastic Search에 Indexing 하기 위한 Agent 모듈입니다.' +
        ' Java 17, Spring WebFlux 6.1.13로 개발되었습니다.',
};

const BoardApiPage: React.FC = () => {
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

export default BoardApiPage;