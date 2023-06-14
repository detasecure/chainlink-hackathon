import React from 'react';

const AsciiLogoEthereum = () => {

  const asciiArtEth = `                      
                   &%%                  
                 &&&%%%                 
                &&&&%%%%%               
               &&&&&%%%%%%              
             &&&&&&&%%% %%%%            
            &&&  &&&%%%   %%%           
          &&&&   &&&%%%    %%%%         
         &&&     &&&%%%      %%%        
       &&&&      &&&%%%       %%%%      
      &&&        %&&%%%(        %%%     
    &&&&    #####%&&%%%((((((    %%%%   
   &&&  ######   &&&%%%    ((((((  %%%  
 &&&&####        &&&%%%        %((((%%%%
  &&&&&          &&&%%%          %%%%%% 
      &&&&&      &&&%%%      %%%%%%     
  ##/     &&&&&% &&&%%%  /%%%%%     *(( 
    ####,     &&&&&&%%%%%%%     ,((((   
      ######.     &&%%%     .((((((     
       ##########       #(((((((((      
         ####  #####((((((  ((((        
           ####   ###((#  ((((          
             ###  ###((# (((            
              #######((((((             
                #####((((               
                  ###((                 
                    #                     
`

  const asciiStyle = {
    color: 'white',
    display: 'inline-block',
    whiteSpace: 'pre',
    letterSpacing: '0',
    lineHeight: '1.4',
    fontFamily: "'Consolas','BitstreamVeraSansMono','CourierNew',Courier,monospace",
    fontSize: '9px',
  };

  return <pre style={asciiStyle}>{asciiArtEth}</pre>;
};

export default AsciiLogoEthereum;
