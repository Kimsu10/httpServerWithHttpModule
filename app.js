const http = require('http'); // (1)
const { domainToASCII } = require('url');
const server = http.createServer();

const users = [ // (2) 새롭게 회원가입 하는 사용자 정보를 저장할 배열을 users라는 변수에 정의합니다. 배열 안에 객체 형태로 회원 정보가 저장될 것입니다.
  {
    id: 1,
    name: "Rebekah Johnson",
    email: "Glover12345@gmail.com",
    password: "123qwe",
  },
  {
    id: 2,
    name: "Fabian Predovic",
    email: "Connell29@gmail.com",
    password: "password",
  },
]

const posts = [
  {
    id: 1,
    title: "간단한 HTTP API 개발 시작!",
    description: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
    userId: 1,
  },
  {
    id: 2,
    title: "HTTP의 특성",
    description: "Request/Response와 Stateless!!",
    userId: 1,
  },
];

const httpRequestListener = function (request, response) {
const { url, method } = request
	if (method === 'GET') {
		if (url === '/ping') {
			response.writeHead(200, {'Content-Type' : 'application/json'});
			response.end(JSON.stringify('pong')); 
		}else if(url === '/info'){
			function data(){
				let dataArr=[];
				for(let i =0; i< users.length; i++){
					for(let j=0; j<posts.length;j++){
						if(users[i].id === posts[j].userId){
							let result ={
								"userID" : users[i].id,
								"userName" : users[i].name,
								"postingId" : posts[j].id,
								"postingTitle" : posts[j].title,
								"postingContent" : posts[j].description
							}
							dataArr.push(result);
						}
					}
					return dataArr;
				}
			}
			response.writeHead(200, {'Content-Type' : 'appliction/json'})
			response.end(JSON.stringify({"data" : data()}))
			}
		} else if (method === 'POST') { // (3)“/ping” 엔드포인트와 마찬가지로 request message에서 꺼내온 http method(POST), tartget(/users) 정보와 if문을 사용해서 엔드포인트를 정의합니다.
		if (url === '/users/signup') {
			let body = ''; // (4) HTTP 요청을 통해 전송된 body에 담긴 회원 정보를 읽어 들입니다. 간단하게는 짧은 단위로 나누어져서 받아지는 body에 담겨있는 데이터를 하나로 합쳐서 body라는 변수에 정의합니다. 
			request.on('data', (data) => {body += data;}) 
            // (5)자세한 동작 원리는 이후에 별도로 Event Driven Architecture에 대해서 설명하겠습니다.
			
			// stream을 전부 받아온 이후에 실행
			request.on('end', () => {  
                // (6)4, 5 과정에서 데이터를 정상적으로 받아온 이후에 자동으로 실행되는 코드입니다. 정확히는 request.on() 함수에 인자로 전달한 arrow function이 실행됩니다.
				const user = JSON.parse(body); 
                //(7) JSON.parse()를 활용해서 HTTP 요청을 통해 전송된 JSON 데이터를 javascript object로 변환해 줍니다.

				// users.push({ 
                //     // (8)Client로부터 받은 사용자 정보를 객체 형태로 만들어서 users 배열에 추가해주면서, 회원 등록을 완료합니다.
				// 	id : user.id,
				// 	name : user.name,
				// 	email: user.email,
				// 	password : user.password
				// })
				user.push({
					userId : users[j].id,
					userName : users[j].name,
					postingId : posts[i].id,
					postingTitle : posts[i].title,
					postingContent : posts[i].postingContent
				})
					

	response.end(JSON.stringify({message: 'usercreated', 'users':users}))
// (9)마지막으로 회원가입이 성공적으로 끝났음을 알리는 “ok!” 메세지를 응답으로 보내줍니다.
                    })
                }
            }
};

server.on("request", httpRequestListener);

server.listen(8000, '127.0.0.1', function() { 
    console.log('Listening to requests on port 8000');
});