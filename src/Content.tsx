interface ContentProps {
    title: {
        poster: string;
        title: string;
        imdbID: string;
        year: number;
        availableOn?: string[];
    };
}

function Content(props: ContentProps) {

    return (
        <div className="m-4 flex flex-col items-center justify-end">
            <div className="w-56 self-start">
                <img src={props.title.poster} alt={props.title.title} className="mb-2"/>
            </div>
                <p className="text-wrap w-56 text-center h-10 align-bottom">{props.title.title}</p>
                <p className="text-gray-400">{props.title.year}</p>
                <h2>Streaming on:</h2>
                {props.title.availableOn?.length !== 0 ?
                    <>
                        {props.title.availableOn?.map((service) =>
                            <div className="flex items-center">
                                <img src={service + ".ico"} alt={service} className="w-8"></img>
                                <p>{service}</p>
                            </div>
                        )}
                    </> : <p className="mb-1 mt-1">None</p>
                }

        </div>
    )
}

export default Content;