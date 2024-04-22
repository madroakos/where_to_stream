import React, {useState} from "react";

interface SearchBarProps {
    searchFunction: (search: string, country: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({searchFunction}) => {
    const [searchBar, setSearchBar] = useState<string>('')
    const [selectedCountry, setSelectedCountry] = useState<string>('hu')

    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(event.target.value);
    };

    return (
        <div className="shadow-2xl mb-6 bg-gray-500">
            <form onSubmit={(e) => {
                e.preventDefault();
                searchFunction(searchBar, selectedCountry);
            }}>
                <select name="countries" id="countries" value={selectedCountry} onChange={handleCountryChange} defaultValue="hu"
                        className="h-10 p-1 text-center"> {/* will change to be based on geolocation */}
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
                    className="h-10 focus:outline-none"
                />
                <button type="submit"
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-2 h-10">&#x1F50D;</button>
            </form>
        </div>
    )
}

export default SearchBar;