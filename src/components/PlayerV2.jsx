import { createRef, useRef, useState } from "react";
import { useMusic } from "../context/MusicContext";
import { BackwardIcon, ForwardIcon } from "@heroicons/react/16/solid";
import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import BASE_URL from '../../config';

const PlayerV2 = () => {
   const {
      currentTrack,
      isPlaying,
      playTrack,
      pauseTrack,
      stopTrack,
      nextTrack,
      previousTrack, 
      audioProgress,
      totalDuration,
      currentTime,
      handleMusicProgressBar} = useMusic();

   const formatTime = (timeInSeconds) => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
   };

   // Change Avatar Class
   let avatarClass = ['object-cover','object-contain','object-none']
   const [avatarClassIndex, setAvatarClassIndex] = useState(0)
   const handleAvatar = ()=>{
      if (avatarClassIndex >= avatarClass.length - 1) {
         setAvatarClassIndex(0)
      }else{
         setAvatarClassIndex(avatarClassIndex + 1)
      }
   }

   // Change BG Video
   const [videoIndex, setVideoIndex] = useState(0);
   const vidArray = ['/videos/video1.mp4','/videos/video2.mp4','/videos/video3.mp4','/videos/video6.mp4', '/videos/video7.mp4', '/videos/video8.mp4', '/videos/video9.mp4', '/videos/video10.mp4'];
   const handleChangeBackground = () => {
      if (videoIndex >= vidArray.length - 1) {
         setVideoIndex(0);
      }else{
         setVideoIndex(videoIndex + 1)
      }
   }

   const videoRefs = useRef([]);
   for (let i = 0; i < vidArray.length; i++) {
      videoRefs.current.push(createRef());
   }

   return (
   <div className='min-w-[100vw] min-h-screen flex justify-center items-center'>
      {currentTrack && (
         <>
         <video src={vidArray[videoIndex]} loop muted autoPlay className='w-full h-screen absolute right-0 top-0 object-cover z-[-1] saturate-[5]'></video>
         <div className="black-screen w-screen h-screen absolute pointer-events-none bg-[#11111133]"></div>
         <div className="music-container w-[350px] py-9 px-10 flex flex-col justify-center items-center text-center rounded-[36px] shadow-2xl backdrop-blur-lg font-semibold">
            <p className=' text-primaryLight m-0 mb-3'>Sudhil&apos;s Retro Player</p>
            <p className='track-name text-center my-0 mx-auto text-2xl'>{currentTrack?.title}</p>
            <p className='artist-name text-primaryDim text-xl font-normal my-1 mx-0'>{currentTrack?.songArtist || "Artist"}</p>
            <div className="relative">
               <img
                  src={`${currentTrack.localArt}`}
                  // src={`${BASE_URL}${currentTrack.artworkUrl}`}
                  className={`${avatarClass[avatarClassIndex]} ${isPlaying ? 'animate-avatar' : ''} w-[200px] h-[200px] rounded-full my-5 mx-0 relative cursor-pointer`}
                  onClick={handleAvatar}
                  alt="song Avatar"
               />
               <div className={`w-[200px] h-[200px] absolute rounded-full top-[20px] left-0 border-[1px] border-gray-50 ${isPlaying ? 'animate-pulse' : ''}`}></div>
            </div>
            <div className="w-full flex justify-between font-semibold">
               <p className='current-time'>{formatTime(currentTime)}</p>
               <p className='total-lenght'>{formatTime(totalDuration)}</p>
            </div>

            <input type="range" name="music-progress-bar" className='w-full h-[10px] mb-4 outline-none rounded-md filter hue-rotate-90 cursor-pointer' value={audioProgress} onChange={handleMusicProgressBar} title=""/>
           
            <div className="flex flex-row gap-2">
               <BackwardIcon className="w-8 h-8 cursor-pointer" onClick={previousTrack}/>
               <div onClick={isPlaying ? pauseTrack : playTrack}>
                  {isPlaying ? <PauseCircleIcon className="w-8 h-8 cursor-pointer"/> : <PlayCircleIcon className="w-8 h-8 cursor-pointer"/>}
               </div>
               <ForwardIcon className="w-8 h-8 cursor-pointer" onClick={nextTrack}/>
            </div>
         </div>
         <div className="change-bg w-[200px] h-8 bg-[#eee] text-[#222] text-center font-extralight pt-1 cursor-pointer absolute top-0 rounded-bl-xl rounded-br-xl z-[10]" onClick={handleChangeBackground}>
            Change Background
         </div>
         </>
      )}
   </div>
   )
}

export default PlayerV2;