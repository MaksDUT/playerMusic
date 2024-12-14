// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production

import { status, isPlaying, audioPlayer, index, trackList, addTrack } from './../stores';


export const prerender = false;

import {createClient} from "@sanity/client";

const client = createClient({
    projectId: "ytdccba3",
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: false,
});


export async function load({ params }) {
    const data = await client.fetch(`*[_type=="music"]{title, artist,"imageURL": image.asset->url,"musicURL": music.asset->url}`);
  
    if (data) {
        data.forEach( music => {
            addTrack(
                {
                    img: music.imageURL,
                    title: music.title ,
                    artist: music.artist,
                    file: music.musicURL,
                },
            )
        });


      return {
        music: data
      };
    }
    return {
      status: 500,
      body: new Error("Internal Server Error")
    };
  }