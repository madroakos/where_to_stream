import SearchBar from "./SearchBar.tsx";
import Content from "./Content.tsx";
import {useState} from "react";
import axios from "axios";
import MovieSkeleton from "./MovieSkeleton.tsx";

function App() {

    interface Title {
        title: string,
        year: number,
        poster: string
        imdbID: string;
        availableOn?: string[],
    }

    interface Result {
        title: string,
        firstAirYear?: number,
        year?: number,
        imdbId: string,
        streamingInfo: Record<string, StreamingInfo[]>;
    }

    interface StreamingInfo {
        service: string;
        streamingType: string;
    }

    const [foundTitles, setFoundTitles] = useState<Title[]>([])
    const [loading, setLoading] = useState<boolean>(false);

    function fillTitlesWithNewData(search: string, country: string) {
        setFoundTitles([]);
        fetchTitles(search, country).then(() => setLoading(false));
    }

    const fetchTitles = async (search: string, country: string) => {
        const request = {
            method: 'GET',
            url: 'https://streaming-availability.p.rapidapi.com/search/title',
            params: {
                country: country,
                title: search,
                output_language: 'en',
                show_type: 'all'
            },
            headers: {
                'X-RapidAPI-Key': import.meta.env.VITE_X_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
            }
        };

        try {
            const {data} = await axios.request(request);
            const titlesPromises = data.result.map(async (result: Result) => {
                const streamingServices = Object.values(result.streamingInfo).flat();
                const subscriptionServices = streamingServices.filter(info => info.streamingType === 'subscription');
                const availableOn = Array.from(new Set(subscriptionServices.map(info => info.service)));

                try {
                    const poster = await fetchPosters(result.imdbId);
                    return {
                        title: result.title,
                        year: result.firstAirYear || result.year,
                        imdbID: result.imdbId,
                        availableOn: availableOn,
                        poster: poster
                    };
                } catch (error) {
                    console.error(error);
                    return {
                        title: result.title,
                        year: result.firstAirYear || result.year,
                        imdbID: result.imdbId,
                        availableOn: availableOn,
                        poster: ''
                    };
                }
            });

            try {
                const titles = await Promise.all(titlesPromises);
                setFoundTitles(titles);
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchPosters = async (imdbID: string) => {
        const query = `
    {
        title(id: "${imdbID}") {
            posters{
                url
            }
        }
    }`;

        try {
            const response = await axios.post('https://graph.imdbapi.dev/v1', {
                query: query
            });
            return response.data.data.title.posters[0].url;
        } catch (error) {
            console.error(error);
            return '';
        }
    }

    function fillSkeletons() {
        return Array.from({ length: 10 }, (_, i) => <MovieSkeleton key={i} />);
    }

    return (
        <>
            <div className="flex flex-col items-center w-screen pt-12 mb-12">
                <h1 className="title font-bold text-center text-transparent bg-clip-text text-5xl sm:text-6xl mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-0">Where
                    to Stream</h1>
                <div className="z-50 w-full flex justify-center">
                    <SearchBar searchFunction={fillTitlesWithNewData} setLoadingFunction={setLoading}/>
                </div>
            </div>
            <div className="flex justify-around flex-wrap gap-5">
                {loading ? fillSkeletons() : (
                    foundTitles.length !== 0 && foundTitles[foundTitles.length - 1].poster ? (
                        foundTitles
                            .filter((title, index, self) =>
                                index === self.map(item => item.imdbID).lastIndexOf(title.imdbID))
                            .map((title) => <Content title={title} key={title.imdbID} />)
                    ) : <></>
                )}
            </div>
        </>
    )
}

export default App
