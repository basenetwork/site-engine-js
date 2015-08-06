var baseAPI = basenetwork.getAPI(0);
var context = this;     // current context
var application;        // instance of Application

function log(str){
    try { console.log.apply(console, arguments); } catch(e) {}
    return str;
}

function ex(a, b) {
    a = a || {};
    if(b) for(var i in b) if(b[i] !== undefined) a[i] = b[i];
    return a;
}


function transl(phrase) {
    //todo: add translates
    return phrase;
}

function genID(prefix) {
    return (prefix||"id") + Math.random().toString(36).substr(2, 12);
}

function getExtension(uri) {
    return uri && (uri.match(/\.([a-z0-9]+)$/)||[])[1];
}

var TYPES_IMAGE = ['png', 'jpeg', 'jpg', 'image', 'bmp', 'gif', 'ico'];

function isImage(uri) {
    return uri && TYPES_IMAGE.indexOf(getExtension(uri)) > -1;
}

// return HTMLElementID
function setImg(uri) {
    var id = genID();
    setTimeout(function(){
        baseAPI.setImageContent(id, uri);
    });
    return id;
}

/**
 * return time string. length 17. format: "YYYYMMDDhhmmssxxx"
 * for example: "20150723142631186"
 * @returns {string}
 */
function strTime() {
    return new Date().toISOString().replace(/[^\d]/g, '');
}

String.prototype.truncate = function(length, truncation) {
    length = (length || 100)|0;
    if(this.length < length) return this;
    // todo: don`t cut words
    if(truncation === undefined) truncation = '...';
    return this.slice(0, length - truncation.length) + truncation;
};

function $class() {
    var proto, cls = { render: function(){} };
    for(var i in arguments)
        if(proto = arguments[i])
            ex(cls, proto._cls || proto);
    return ex(React.createClass(cls), { _cls: cls });
}

function $element(type, attrs, child) {
    if(typeof type === "string") type = context[type];
    return React.createElement(type, attrs, child);
}

// append <meta name="viewport" content="width=device-width, initial-scale=1">
document.head.appendChild(ex(document.createElement("meta"), {
    name: "viewport",
    content: "width=device-width, initial-scale=1"
}));
