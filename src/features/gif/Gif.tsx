import { useState } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { GiphyImage } from './types';

function Gif() {
    const [randomGif, setRandomGif] = useState<GiphyImage | null>(null);
    const [currentId, setCurrentId] = useState<string>('f2uJ1pbidyrEA');
    const [isLoading, setIsLoading] = useState(false);
    const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_DEV_KEY);

    const fetchRandomGif = async () => {
        setIsLoading(true);
        try {
            const { data } = await gf.related(currentId, {
                limit: 10,
                type: 'gifs',
                rating: 'g',
            });

            const random = Math.floor(Math.random() * 10);
            const gif = data[random] as unknown as GiphyImage;
            setRandomGif(gif);
            setCurrentId(gif.id);
        } catch (error) {
            console.error('Error fetching random GIF:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative h-full w-full">
            <img
                src={randomGif?.images.original.url || '/flowing.gif'}
                alt={randomGif?.title || 'GIF'}
                className="h-full w-full object-cover object-center"
            />
            <button onClick={fetchRandomGif} disabled={isLoading} className="btn btn-sm absolute top-2 left-2">
                {isLoading ? '...' : '✨ Random (Beta)'}
            </button>
        </div>
    );
}

export default Gif;
