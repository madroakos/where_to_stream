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
        <div className="movieCard card m-4 flex flex-col items-center justify-end transition-opacity">
            <div className="card shadow-lg">
                <figure className="w-56 self-start">
                <img src={props.title.poster} alt={props.title.title} className="mb-2"/>
            </figure>
            <div className="card-body w-56 text-center items-center flex-grow-0 h-60 content-around">
                <p className="card-title text-wrap">{props.title.title}</p>
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
            </div>
        </div>
    )
}

export default Content;