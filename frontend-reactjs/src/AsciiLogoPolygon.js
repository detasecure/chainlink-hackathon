import React from 'react';

const AsciiLogoPolygon = () => {
  const asciiArtPolygon = `
                             /#(((.                                             
                         ((((((((((((#.                                         
                     /((((((.     .(((((((                                      
                     #(((             #((#                                      
                     #(((             /((,    .((((.                            
                     #(((                 ,#((((((((((#,                        
                     #(((,            /(((((#*      /((((((.                    
                     .(((((((.    (((((((*             *(((/                    
                         .(((((((((((.                 .(((/                    
                              /(/     .#(#             .(((/                    
                                      *(((/            ((((/                    
                                       ((((((#,    ,#((((((                     
                                           ((((((((((((.                        
                                               /((/                             
  `;

  
  const asciiStyle = {
    color: 'white',
    display: 'inline-block',
    whiteSpace: 'pre',
    letterSpacing: '0',
    lineHeight: '1.4',
    fontFamily: "'Consolas','BitstreamVeraSansMono','CourierNew',Courier,monospace",
    fontSize: '12px',
  };

  return <pre style={asciiStyle}>{asciiArtPolygon}</pre>;
};

export default AsciiLogoPolygon;
