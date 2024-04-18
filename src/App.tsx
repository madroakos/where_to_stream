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

    function fillTitlesWithNewData(search: string) {
        fetchTitles(search);
    }

    const fetchTitles = async (search: string) => {
        const request = {
            method: 'GET',
            url: 'https://streaming-availability.p.rapidapi.com/search/title',
            params: {
                country: 'hu',
                title: search,
                output_language: 'en',
                show_type: 'all'
            },
            headers: {
                'X-RapidAPI-Key': process.env.REACT_APP_X_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
            }
        };

        try {
            const {data} = await axios.request(request);
            const titles: Title[] = data.result.map((result: Result) => {
                const streamingServices = Object.values(result.streamingInfo).flat();
                const subscriptionServices = streamingServices.filter(info => info.streamingType === 'subscription');
                const availableOn = Array.from(new Set(subscriptionServices.map(info => info.service)));
                return {
                    title: result.title,
                    year: result.firstAirYear || result.year,
                    imdbID: result.imdbId,
                    availableOn: availableOn,
                };
            });

            setFoundTitles(titles);
            console.log(titles);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div className="flex flex-col items-center w-screen pt-12 mb-12 shadow-lg bg-gradient-to-b from-slate-50 via-slate-50 to-slate-200">
                <h1 className="font-bold text-transparent bg-clip-text text-6xl mb-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Where
                    to Stream</h1>
                <SearchBar searchFunction={fillTitlesWithNewData}/>
            </div>
            <div className="flex justify-around flex-wrap">
                {foundTitles.sort((a, b) => b.year - a.year).map((title) => <Content title={title}/>)}
            </div>
        </>
    )
}

export default App
