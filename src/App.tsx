import SearchBar from "./SearchBar.tsx";
import Content from "./Content.tsx";
import {useState} from "react";
import axios from "axios";

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

    function fillTitlesWithNewData(search: string, country: string) {
        fetchTitles(search, country);
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

        console.log(country)
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
                console.log(titles);
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

    return (
        <>
            <div className="flex flex-col items-center w-screen pt-12 mb-12 shadow-lg bg-gradient-to-b from-slate-50 via-slate-50 to-slate-200">
                <h1 className="font-bold text-center text-transparent bg-clip-text text-6xl mb-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Where
                    to Stream</h1>
                <SearchBar searchFunction={fillTitlesWithNewData}/>
            </div>
            <div className="flex justify-around flex-wrap">
                {foundTitles.length !== 0 ? foundTitles[foundTitles.length-1].poster ?
                    foundTitles
                        .filter((title, index, self) =>
                            index === self.map(item => item.imdbID).lastIndexOf(title.imdbID))
                        .map((title) => <Content title={title} key={title.imdbID}/>)
                    : <></> : <></>}
            </div>
        </>
    )
}

export default App
