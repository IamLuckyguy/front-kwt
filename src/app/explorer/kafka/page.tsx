'use client';

import React from 'react';
import {useRouter} from "next/navigation";
import useKeyboardNavigation from "@/hooks/useKeyboardNavigation";
import ServiceInfo from "@/components/ServiceInfo";

const asciiArt = `                                
                                                  
                  ,@@@@:                          
                 -#@*=@@~                         
                 ;@; .=@#                         
                 ;@.  :@@                         
                 ;@*  ;@@                         
                 :@@@#@@.   !@@$-                 
                  :#@@$*  .*@@@@@:                
                   ~@$-   -@@;:*@#.               
                    @=    -@;  .=@.               
                   !@@;   -@~  -@@.               
                 -$@@@@@--#@@-,!@#.               
                ,=@@**$@@@#*#@@@$,                
                :@@:  ,$@@- -:::,                 
               .#@;    =@#                        
               .@@-    =@#                        
                *@=   .=@#  .,,,.                 
                -@@:~~*@@@:~$@@@*.                
                .=@@@@@@;;@@@@!@@*                
                 .-@@@@:  :@@- :@@.               
                    @=    -@-  .*@.               
                    @=    -@$, :@@.               
                  -:@#!.  ,$@$:@@=                
                 -#@@@@=   ,$@@@=.                
                 ;@@,,!@$   .,,,.                 
                 ;@.  ;@@                         
                 ;@-  ;@@                         
                 ;@@::=@*                         
                 ,$@@@@!                          
                  .,@$,                           
                                                  
                                                  
                                                  
     ,,                  ,*~,,,                   
     #=.                =#@;*#$                   
     @$.                #@- =@#                   
     @$. ,-,  .---- -,.-@#-.=@#  ,-,  ,---.,-     
     @$..=@: -=@@@@!@=~#@@@;=@# -$@: -$@@@=$@     
     @$,!@!  *@@~~=@@=.~@@~,=@#,$@: ,$@:~~=@@     
     @$!@=  :@@.  .#@=  ##  =@@#@:  ~@:   ,$@     
     @@@@.  ;@@     @=  ##  =@@@;   $@-    =@     
     @$!@;  ;@@    ~@=  ##  =@@$@~  =@-    =@     
     @$-$@: -#@:  -@@=  ##  =@#-#$  ~@*   ~#@     
     @$.,@@: =@@**$@@=  ##  =@# !@= .=@=**$@@     
     @$. .@= .#@@@@-@=  ##  =@#  =@$ .=@@@!=@     
`;

const ComponentInfo = {
    title: '어플리케이션',
    serviceName: 'board-api',
    version: 'Spring WebFlux 6.1.13',
    url: 'https://api.kwt.co.kr/board',
    information: '게시판 서비스를 위한 API 서버입니다.' +
        ' 게시글을 작성, 조회, 수정, 삭제할 수 있습니다.' +
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