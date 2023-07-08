import { useState } from 'react';
import { users } from '@/components/user';

const test2 = () => {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        // Here you would typically make a request to your server to fetch the user data
        setResults(users.filter(user => user.name.includes(query)));
    }

    return (
        <div className="p-10">
            <div className="bg-white flex items-center rounded-full shadow-md">
                <input
                    className="rounded-l-full w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
                    id="search"
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <div className="p-4">
                    <button 
                        onClick={handleSearch} 
                        className="text-white rounded-full p-2 focus:outline-none w-12 h-12 flex items-center justify-center"
                    >
                        🔍
                    </button>
                </div>
            </div>

            <div className="mt-10">
                {results.map(user => (
                    <div key={user.id} className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-l m-3">
                        <div className="md:flex">
                            <div className="md:flex-shrink-0">
                                <img className="ml-1 rounded-full h-28 w-full  md:w-28" src={user.image} alt={user.name} />
                            </div>
                            <div className="p-8">
                                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{user.name}</div>
                                <p className="mt-2 text-gray-500">{user.email}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default test2;