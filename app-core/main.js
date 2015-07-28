
//----- import ------------
//include ../ext/react-0.13.3/build/react.min.js

//----- std libs ------------
//include ../lib/utils.js
//include ../lib/Element.js
//include ./Application.jsx
//include ./RegistrationForm.jsx

//---- form components -----------
//include ../lib/components/Input.jsx
//include ../lib/components/Img.jsx
//include ../lib/components/UserInfo.jsx
//include ../lib/components/Form.jsx

var _ = base._;

//------ render app ---------
React.render(React.createElement(Application), document.body.appendChild(document.createElement('div')));
