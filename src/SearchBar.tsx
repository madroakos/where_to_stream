import React, {useState} from "react";

interface SearchBarProps {
    searchFunction: (search: string, country: string) => void;
    setLoadingFunction: (loading: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({searchFunction, setLoadingFunction}) => {
    const [searchBar, setSearchBar] = useState<string>('')
    const [selectedCountry, setSelectedCountry] = useState<string>('hu')

    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(event.target.value);
    };

    return (
        <div className="searchBar w-fit shadow-2xl mb-6">
            <form onSubmit={(e) => {
                e.preventDefault();
                setLoadingFunction(true);
                searchFunction(searchBar, selectedCountry);
            }}>
                <select name="countries" id="countries" value={selectedCountry} onChange={handleCountryChange} defaultValue="hu"
                        className="h-10 p-1 text-center rounded-bl rounded-tl">
                    <option value="hu">Hungary</option>
                    <option value="de">Germany</option>
                    <option value="us">USA</option>
                    <option value="uk">UK</option>
                    <option value="jp">Japan</option>
                </select>
                <input
                    type="text"
                    value={searchBar}
                    onChange={(e) => setSearchBar(e.target.value)}
                    placeholder="Search for a title..."
                    className="h-10 focus:outline-none pl-2"
                />
                <button type="submit"
                        className="bg-transparent p-2 h-10 rounded-br rounded-tr">&#x1F50D;</button>
            </form>
        </div>
    )
}

export default SearchBar;