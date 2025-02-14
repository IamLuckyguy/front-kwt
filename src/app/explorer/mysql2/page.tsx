'use client';

import React from 'react';
import {useRouter} from "next/navigation";
import useKeyboardNavigation from "@/hooks/useKeyboardNavigation";
import ServiceInfo from "@/components/ServiceInfo";

const asciiArt = `
         ..                                       
        ::::,                                     
       -; ,;::,                                   
       ::   .::~..                                
       .:.    ~:::;:-.                            
        ~~      ..-~;;-.                          
         :~          :;;.                         
         .:.           ::~                        
          -:    ::      ~:~                       
           :    .:       ,::.                     
           ::    ~        .::.                    
           .:              .::.                   
            :.              -:-                   
            ::               ~;-                  
             :.               ::                  
             ~~               ,::                 
              :-               ::.                
              -~               .::                
              :-                ;:.               
              ;                 .:-               
             ,:                  :;               
             ~-                  -:-              
             ~,                   ::              
             :,    ,              ~:-             
             :-   ::               ;:             
             ~:   ::.              -:,            
              ;  :::~               ::.           
              ;, ;: :               .:::-         
              ~: :; -:                .-;:-       
               :~:: .;,                  -;~.     
               .~:    ;.                   ~:.    
                       -                    -:,   
                        ,                     :.  
                        .,               -~:::;;. 
                                       ,;:;-,,.   
                                        ::.       
                                        .::,      
                                         .::;     
                                           -::,   
                                            .-:,  
-;;     ,;:.          .......   .....  ..     .~. 
;::,    :~:-          ..       .     . ..       ~.
;~;:   ,:,:~ ~,    :- .        .     .  .         
;~.;,  ;: :~ ;,    ;- ......   .     .  .         
;~ :: .:. :- ;,    ;-    .... ..     . ..         
;~ ,:,:;  :- ;,    ;-       . ..  .  . ..         
;~  :::,  :~ :-....;-      ..  .   . .  .        .
;~  ,;:   ;~  ~;;;;:- ......    ......   ......   
                   ;-                ..           
             ;;;;;;~.                             
`;

const ComponentInfo = {
    title: '웹 서버',
    serviceName: 'Ingress Nginx',
    version: '',
    url: 'https://front.kwt.co.kr/',
    information: 'Next.js를 사용한 프론트엔드 서비스입니다.',
};

const NginxPage: React.FC = () => {
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

export default NginxPage;