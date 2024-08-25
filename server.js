const http = require('http');
const url = require('url');

const userId = "john_doe_17091999";
const email = "john@xyz.com";
const rollNumber = "ABCD123";

const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const parsedUrl = url.parse(req.url, true);
    const method = req.method;

    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (parsedUrl.pathname === '/bfhl' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { data } = JSON.parse(body);

                if (!Array.isArray(data)) {
                    throw new Error("Invalid input");
                }

                const numbers = [];
                const alphabets = [];
                let highestLowercaseAlphabet = "";

                data.forEach(item => {
                    if (!isNaN(item)) {
                        numbers.push(item);
                    } else if (typeof item === 'string') {
                        alphabets.push(item);
                        if (item === item.toLowerCase() && item > highestLowercaseAlphabet) {
                            highestLowercaseAlphabet = item;
                        }
                    }
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    is_success: true,
                    user_id: userId,
                    email,
                    roll_number: rollNumber,
                    numbers,
                    alphabets,
                    highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : []
                }));

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    is_success: false,
                    user_id: userId,
                    email,
                    roll_number: rollNumber,
                    message: error.message
                }));
            }
        });
    } else if (parsedUrl.pathname === '/bfhl' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ operation_code: 1 }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});