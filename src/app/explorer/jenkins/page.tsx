'use client';

import React from 'react';

const jenkinsAsciiArt = `
@@@@@@@@@@@@@@@@@@@@@@@#########@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@$##############$@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@######         ####@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@##-.#$            =##@@@@@@@@@@@@@
@@@@@@@@@@@@@@##:.!#                ##@@@@@@@@@@@@
@@@@@@@@@@@@@##.,!#                  ##@@@@@@@@@@@
@@@@@@@@@@@@##.;!#                    ##@@@@@@@@@@
@@@@@@@@@@@@#.,*$                    .##@@@@@@@@@@
@@@@@@@@@@@###$$#      .##          #####@@@@@@@@@
@@@@@@@@@@##$.,!#     .#==-            ##@@@@@@@@@
@@@@@@@@@@#=.!!!#     #                 #@@@@@@@@@
@@@@@@@@@##.!!!!#    #                  ;#@@@@@@@@
@@@@@@@@@##!!!!!#                        #@@@@@@@@
@@@@@@@@@##!!!!!#                ,       #@@@@@@@@
@@@@@@@@###!!!!!#           ;    #     # #@@@@@@@@
@@@@@@@####!*!!!#           =-   $.    # ##@@@@@@@
@@@@@@## ######!#         ---#    #  ### ###@@@@@@
@@@@@##  ##   #$#         ###:    *#     #!##@@@@@
@@@@##* -# -#- ##                  #~    #,=#@@@@@
@@@@##  ##  ## ##                   #-   #,,##@@@@
@@@##  ,##    .                      #-  #,,,##@@@
@@@#* ,,,#                           #~  #,,,##@@@
@@##  ,,,#                          ~#  !,,,,,##@@
@@#* ,,,,##                    =  ~#!   #,,,,,##@@
@##  ,,,,,##  #                ##!!  .# #,,,,,,#@@
@## ,,,,,,,###$             #~~~~~ ~## .#,,,,,,##@
@#~ ,,,,,,,,!#.              !#### ##  #,,,,,,,$#@
@# .,,,,,,,,,##     .      #           #,,,,,,,,#@
## ,,,,,,,,,,!#     #       #=:,  .   #!,,,,,,,,##
## ,,,,,,,,,,,#      #       #####;  :#,,,,,,,,,##
## ,,,,,,,,,,,!#      $              ##,,,,,,,,,##
##,,,,,,,,,,,,;#      :$            ####,,,,,,,,##
#*,,,,,,,,,,,####      :#         ;##:!##,,,,,,,##
#;,,,,,,,,,###::##~    -:##:   :#####*:!##,,,,,,##
#$,,,,,,,;##:::::#####*#########;##;;#;:;##,,,,,##
##,,,,,,##*::::;*=#.  #   :##:  ## ..#**::##,,,,##
##,,,,$##::::!*****=#;# ,,..:####  ,,=***;#$,,,,##
##,,,##$:::!*********=# ,,,, ; ,#: ,,,****#,,,,,##
##,,,##::*************# ,,,,..#,#,,,,,****#,,,,,#@
@#,,,:#::*************# ,,,,,!#::##!!#****#,,,,,#@
@#=,,,##:;*************;,,,,!#.. .#,,#$**#,,,,,##@
@##,,,##::*************#,,-#;;# # #,,,#**#,,,,,##@
@@#,,,-#::********$****####,,,#.  #,,=***#,,,,,#@@
@@##,,,##:********#;****=#,,,,,# !#,,=**#-,,,,##@@
@@##,,,##:********#:*****#,,,,,#. #,#***#,,,,,##@@
@@@##,,,#:;*******#:*****##,,,,~# #-****#,,,,##@@@
@@@##,,,#::*******#:******###;,,#.,#***#,,*$###@@@
@@@@##,,#!:*******#:********$##*$=#****#*###--##@@
@@@@@##,##:*****#*#:******$$$$###########$,    #@@
@@@@@##**#:*****$#######################   *.  ##@
@@@@@@##*#:****$!!#--           .#::#  # *-    ##@
@@@@@@@###:****!!:#             .#::#  #. $#;  .#@
@@@@@@@@##:*******#             .#**#  #.      .#@
@@@@@@@@@#:********             .#**## ;. ,,,. .#@
@@@@@@@@@#:********             .#**## .........#@
@@@@@@@@@#:********#            .#**##..$:===..$#@
@@@@@@@@@##********#            .#**#######..-=#@@
@@@@@@@@@####******#            .#$###@@@@#####@@@
@@@@@@@@@@#####****#            .#####@@@@@@@@@@@@
@@@@@@@@@@@@@#######            .#..#@@@@@@@@@@@@@
@@@@@@@@@@@@@@@#####=           .#..#@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@##           .#..#@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@#           .#..##@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@#           .#..##@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@#$          .~####@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@##           .##@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@#         ...#@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@######;-;#####@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@###########@@@@@@@@@@@@@@@@
`;

const jenkinsInfo = {
  version: '2.401.1',
  plugins: '1500+',
  access: 'http://jenkins.example.com:8080',
  usage: [
    '1. 로그인',
    '2. 새 작업 생성',
    '3. 파이프라인 구성',
    '4. 빌드 실행',
    '5. 결과 확인'
  ]
};

const JenkinsPage: React.FC = () => {
  return (
    <div className="flex items-start justify-center min-h-screen bg-black text-green-500 p-4">
      <div className="w-1/2 mr-4">
        <pre className="text-xs">{jenkinsAsciiArt}</pre>
      </div>
      <div className="w-1/2 font-mono">
        <h1 className="text-2xl mb-4">Jenkins</h1>
        <p>Version: {jenkinsInfo.version}</p>
        <p>Plugins: {jenkinsInfo.plugins}</p>
        <p>Access: {jenkinsInfo.access}</p>
        <h2 className="text-xl mt-4 mb-2">Usage:</h2>
        <ol className="list-decimal list-inside">
          {jenkinsInfo.usage.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default JenkinsPage;
