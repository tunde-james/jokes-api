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

console.log(db);

// POST, GET, PATCH, DELETE - CRUD
const requesthandler = (req, res) => {
  console.log(req.url);

  if (req.url === '/' && req.method === 'GET') {
    getJokes(req, res);
  } else if (req.url === '/jokes/1' && req.method === 'PATCH') {
    updateJoke(req, res);
  } else if (req.url === '/' && req.method === 'POST') {
    postJoke(req, res);
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
  const id = +req.url.split('/')[2];

  req.on('data', (chunk) => {
    body.push(chunk);
  });

  req.on('end', () => {
    const convertedBuffer = Buffer.concat(body).toString();
    const jsonResponse = JSON.parse(convertedBuffer);

    const updateDB = db.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...jsonResponse,
        };
      }
      return item;
    });

    db = updateDB;
  });

  res.end(JSON.stringify({ id }));
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

const server = createServer(requesthandler);

server.listen(8000, () => {
  console.log('server running');
});
