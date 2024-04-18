interface ContentProps {
    title: {
        poster: string;
        title: string;
        year: number;
        availableOn?: string[];
    };
}

function Content(props: ContentProps) {

    return (
        <div className="m-4 flex flex-col items-center">
            <img src={props.title.poster} alt={props.title.title} className="w-56"/>
            <h1>{props.title.title}</h1>
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
                </> : <p>None</p>
            }
        </div>
    )
}

export default Content;