import { useState } from 'react';
import './App.css';
import logo from './assets/logo.png';
import greetingcard from './assets/dushera_asset.png';
// import decorationImage from './assets/Group.png'
import {svgTemplate, svgToJpegDataURL} from './utils'

function App() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);




  const handleSubmit = (name : string) => {
    console.log("handle submit");
    
    let x_position = 270;
    if(name.length > 12){
      x_position = 270-(3*(name.length-12));
    }
    const generatedSVG = svgTemplate(name, `${x_position}`);
    console.log("generatedSVG", generatedSVG);

    svgToJpegDataURL(generatedSVG, (dataURL: string) => {
      setImageDataUrl(dataURL); 

      console.log("dataURL", dataURL);
    
      const greetingImg = document.querySelector('.greetingCard') as HTMLImageElement;
      if (greetingImg) {
        greetingImg.src = dataURL;
        console.log("dataURL", dataURL);
      }
      console.log("Generating JPEG image with name:", name);
    });
  };

const handleShare = async () => {
  if (imageDataUrl && 'share' in navigator) {
    try {
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'greeting.jpg', { type: 'image/jpeg' });
      if ('canShare' in navigator && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Greeting Card',
          text: 'Check out this greeting card!',
          files: [file]
        });
      } else {
        console.error("File sharing not supported on this platform/browser.");
      }
    } catch (err) {
      console.error("Error sharing", err);
    }
  }
};


  return (
    <div className='mainContainer'>
      <div className="wrapper">
        <header><img src={logo} alt="logo" /></header>
        <div className='greetinCardWrapper'>
          {/* <img src={decorationImage} alt="" className="decorationImage" /> */}
          <img src={greetingcard} alt="" className='greetingCard' />
        </div>
        <form>
          <label htmlFor="name">Enter the sender’s name</label>
          <input 
            type="text" 
            placeholder="Enter name" 
            onChange={(e)=>{handleSubmit(e.target.value)}}
          />
          {imageDataUrl && !('share' in navigator) && <a href={imageDataUrl} download="greeting.jpg" className="downloadButton">Download Image</a>}
          {imageDataUrl && 'share' in navigator && <button onClick={handleShare} className="shareButton">Share Image</button>}
        </form>
      </div>
    </div>
  );  
}

export default App;
