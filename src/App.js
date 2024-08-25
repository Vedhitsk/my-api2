import React, { useState } from 'react';
import "./App.css"

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState(null);
    const [dropdown, setDropdown] = useState([]);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const parsedData = JSON.parse(jsonInput);
            if (!parsedData.data || !Array.isArray(parsedData.data)) {
                throw new Error("Invalid JSON format");
            }
            const res = await fetch('http://localhost:3000/bfhl', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: jsonInput,
            });
            const data = await res.json();
            setResponse(data);
            setDropdown([]);
            setError('');
        } catch (err) {
            setError(err.message);
            setResponse(null);
        }
    };

    const handleDropdownChange = (e) => {
        const { options } = e.target;
        const selectedOptions = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedOptions.push(options[i].value);
            }
        }
        setDropdown(selectedOptions);
    };

    return (
        <div>
            <h1>21BCE5199</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    JSON Input:
                    <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        rows="4"
                        cols="50"
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {response && (
                <>
                    <label>
                        Select Fields:
                        <select multiple onChange={handleDropdownChange}>
                            <option value="alphabets">Alphabets</option>
                            <option value="numbers">Numbers</option>
                            <option value="highest_lowercase_alphabet">Highest Lowercase Alphabet</option>
                        </select>
                    </label>
                    <div>
                        {dropdown.includes('alphabets') && (
                            <p>Alphabets: {response.alphabets.join(', ')}</p>
                        )}
                        {dropdown.includes('numbers') && (
                            <p>Numbers: {response.numbers.join(', ')}</p>
                        )}
                        {dropdown.includes('highest_lowercase_alphabet') && (
                            <p>Highest Lowercase Alphabet: {response.highest_lowercase_alphabet.join(', ')}</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
