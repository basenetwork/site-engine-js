
//----- css ------------
//include ./main.css

//----- std libs ---------
//include react-0.13.3/build/react.min.js
//include jquery/jquery-2.1.4.min.js
//include bootstrap-3.3.4/js/bootstrap.min.js
// todo: remove bootstrap and jquery

//-------- libs ------------
//include ../lib/utils.js
//include ../lib/Element.js
//include ./Application.jsx

//---- form components -----------
//include ../lib/components/Input.jsx
//include ../lib/components/Img.jsx
//include ../lib/components/Video.jsx
//include ../lib/components/Audio.jsx
//include ../lib/components/UserInfo.jsx
//include ../lib/components/Form.jsx

//-------- pages -----------
//include ../lib/pages/Page.jsx
//include ../lib/pages/Blog.jsx
//include ../lib/pages/ErrorPage.jsx
//include ../lib/pages/HomePage.jsx
//include ../lib/pages/Chat.jsx
//include ../lib/pages/Photos.jsx
//include ../lib/pages/Videos.jsx
//include ../lib/pages/Audios.jsx
//include ../lib/pages/Comment.jsx


//------ render app ---------
React.render(React.createElement(Application), document.body.appendChild(document.createElement('div')));
