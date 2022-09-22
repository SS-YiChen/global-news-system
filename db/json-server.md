# json-server
link: https://www.npmjs.com/package/json-server

install: npm install -g json-server

start json server: 
    json-server --watch ./test.json --port 8000
        run test.json file at the 8000 port

CRUD:
    view: get
    add: post
    update: put / patch
    delete: delete

relevant table: 
    _embed
    eg. "http://localhost:8000/posts?_embed-comments"
    will return posts data and comments data relevant with posts

    _expand
    eg. "http://localhost:8000/comments?_expand=post" 

