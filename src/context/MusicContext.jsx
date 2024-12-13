import { createContext, useEffect, useState, useContext } from "react";
import { Howl } from 'howler';
import BASE_URL from "../../config";
import staticTracks from "../tracks.json";

const MusicContext = createContext();

export const MusicContextProvider = ({ children }) => {
   const [tracks, setTracks] = useState(staticTracks);
   // const [tracks, setTracks] = useState([]);
   const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
   const [isPlaying, setIsPlaying] = useState(false);
   const [sound, setSound] = useState(null);

   // The dynamic track fetching is diabled for now. Currently using the local static track list of 50.
   // useEffect(() => {
   //    const fetchTracks = async () => {
   //       try {
   //          const response = await fetch(`${BASE_URL}/api/v1/tracks?limit=20&cursor=1`);
   //          const data = await response.json();
   //          setTracks(data.body.tracks);
   //       } catch (error) {
   //          console.error('Error fetching tracks:', error);
   //       }
   //    };

   //    fetchTracks();
   // }, []);


   useEffect(() => {
      if (sound) {
         sound.unload();
      }

      const newSound = new Howl({
         src: [`${tracks?.[currentTrackIndex]?.localAudio}`],
         // src: [`${BASE_URL}${tracks?.[currentTrackIndex]?.streamUrl}`],
         html5: true,
         autoplay: true,
         loop: true,
         // volume: 0.5,
         // onload: () => {
         //    console.log("test")
         // },
         onplay: () => {
            setIsPlaying(true);
         },
         onpause: () => {
            setIsPlaying(false);
         },
         onstop: () => {
            setIsPlaying(false);
         },
         onend: () => {
            setIsPlaying(false);
            if (currentTrackIndex < tracks.length - 1) {
               setCurrentTrackIndex(currentTrackIndex + 1);
            } else {
               setCurrentTrackIndex(0); // Loop back to first
            }
         },
      });
      setSound(newSound);

      return () => {
         if (sound) {
            sound.unload();
         }
      };
   }, [currentTrackIndex, tracks]);

   const playTrack = () => {
      if (sound) {
         sound.play();
      }
   };

   const pauseTrack = () => {
      if (sound) {
         sound.pause();
      }
   };

   const stopTrack = () => {
      if (sound) {
         sound.stop();
      }
   };

   const nextTrack = () => {
      if (currentTrackIndex < tracks.length - 1) {
         setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
         setCurrentTrackIndex(0); // Loop back to first 
      }
   };

   const previousTrack = () => {
      if (currentTrackIndex > 0) {
         setCurrentTrackIndex(currentTrackIndex - 1);
      } else {
         setCurrentTrackIndex(tracks.length - 1); // Loop back to last track
      }
   };

   const currentTrack = tracks[currentTrackIndex];

   // -------------------------------------------------------------
   // Time, progress, and seek
   const [audioProgress, setAudioProgress] = useState(0);
   const [totalDuration, setTotalDuration] = useState(0);
   const [currentTime, setCurrentTime] = useState(0);

   let interval;
   useEffect(() => {
      if (sound) {
         sound.on('load', () => {
            setTotalDuration(Math.floor(sound.duration()));
         });
   
         sound.on('play', () => {
            if(sound.playing()) {
               interval = setInterval(() => {
                  const currentTimeInSeconds = Math.floor(sound.seek());
                  setCurrentTime(currentTimeInSeconds);
                  setAudioProgress((currentTimeInSeconds / Math.floor(sound.duration())) * 100);
               }, 1000);
               // return () => clearInterval(interval);
            }
         });
   
         sound.on('pause', () => {
            clearInterval(interval);
         })

         sound.on('seek', () => {
            const currentTimeInSeconds = Math.floor(sound.seek());
            setCurrentTime(currentTimeInSeconds);
            setAudioProgress((currentTimeInSeconds / Math.floor(sound.duration())) * 100);
         });
   
         sound.on('end', () => {
            setCurrentTime(0);
            setAudioProgress(0);
            if (currentTrackIndex < tracks.length - 1) {
               setCurrentTrackIndex(currentTrackIndex + 1);
            } else {
               setCurrentTrackIndex(0); // Loop back to first
            }
         });
      }

      return () => clearInterval(interval);
   }, [sound, currentTrackIndex, tracks]);

   const handleMusicProgressBar = (e) => {
      const seekValue = parseInt(e.target.value);
      setAudioProgress(seekValue);
      if (sound) {
         const seekTimeInSeconds = (seekValue / 100) * Math.floor(sound.duration());
         setCurrentTime(seekTimeInSeconds);
      
         // Update total duration if it's not already set
         if (totalDuration === 0) {
            setTotalDuration(Math.floor(sound.duration()));
         }
         
         // Seek to the new position
         sound.seek(seekTimeInSeconds);
      }
   };
   // -------------------------------------------------------------

   
   return (
      <MusicContext.Provider 
         value={{ 
            tracks,
            currentTrackIndex,
            setCurrentTrackIndex,
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
            handleMusicProgressBar
         }}>
         {children}
      </MusicContext.Provider>
   );
}

// This custom hook will help to get the music context values directly in any component
export const useMusic = () => {
   const context = useContext(MusicContext);
   if (!context) {
      throw new Error('useMusic must be used within a MusicContextProvider');
   }

   return context;
};

// This is not required because of the above hook
// export { MusicContext, MusicContextProvider };