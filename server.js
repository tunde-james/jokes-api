const { createServer } = require('http');
let db = [
  {
    title: 'What did the mic, tell the user? Stop spitting on me',
    comedian: 'John Doe',
    year: 1994,
    id: 1,
  },
  {
    title: 'Why is it called fried rice when it is not fried with the pan?',
    comedian: 'Erik Ten__',
    year: 1849,
    id: 2,
  },
  {
    title: 'Some code like they dress',
    comedian: 'Moyes',
    year: 2000,
    id: 3,
  },
  {
    title: 'After cooking for 4 months, it was a spaghetti code',
    comedian: 'Starly Chambers',
    year: 1888,
    id: 4,
  },
  {
    title: "Life is a journey... you're meant to laught at this joke",
    comedian: 'Woodle Spark',
    year: 2014,
    id: 5,
  },
];

// POST, GET, PATCH, DELETE - CRUD
const requesthandler = (req, res) => {
  console.log(req.url);

  if (req.url === '/' && req.method === 'GET') {
    getJokes(req, res);
  } else if (req.url === '/jokes/5' && req.method === 'PATCH') {
    updateJoke(req, res);
  } else if (req.url === '/' && req.method === 'POST') {
    postJoke(req, res);
  } else if (req.url === '/jokes/1' && req.method === 'DELETE') {
    deleteJoke(req, res);
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: true, message: 'Not found' }));
  }
};

function getJokes(req, res) {
  res.writeHead(200);
  res.end(JSON.stringify({ data: db, message: 'Data fetched successfully' }));
}

function updateJoke(req, res) {
  const body = [];
  const jokeId = +req.url.split('/')[2];

  req.on('data', (chunk) => {
    body.push(chunk);
  });

  req.on('end', () => {
    const convertedBuffer = Buffer.concat(body).toString();
    const jsonResponse = JSON.parse(convertedBuffer);

    let updatedDB = db.map((joke) => {
      if (joke.id === jokeId) {
        return {
          ...joke,
          ...jsonResponse,
        };
      }
      return joke;
    });

    updatedDB = db.find((joke) => joke.id === jokeId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updatedDB));
  });
}

function postJoke(req, res) {
  const body = [];

  req.on('data', (chunk) => {
    body.push(chunk).toString();
  });

  req.on('end', () => {
    const joke = JSON.parse(body);
    joke.id = db.length + 1;
    db.push(joke);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db));
  });
}

function deleteJoke(req, res) {
  const jokeId = +req.url.split('/')[2];
  const deletedJoke = db.find((joke) => joke.id === jokeId);

  db = db.filter((joke) => joke.id !== jokeId);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(deletedJoke));
}

const server = createServer(requesthandler);

server.listen(8000, () => {
  console.log('server running');
});
