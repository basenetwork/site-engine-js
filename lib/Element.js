var newElement = (function(){

var _key = 0, _cache = {};

function Element(path, host) {
    this.host = host;
    this.path = path;
    this.name = path.match(/([^\/]*)\/$/)[1];
    this.key = _key++;
}

function _newElement(path, host, _initData) {
    host = host || Application.siteInfo.host;
    path = path || location.pathname;
    path = (path + '/').replace(/\/+/g, '/');
    var uri = host + path;
    var element = _cache[uri];
    if(!element) {
        _cache[uri] = element = new Element(path, host);
        if(_initData) element._setData(_initData);
        else element.load();
    }
    return element;
}

ex(Element.prototype, {
    host: null,
    path: null,
    name: null,
    author: null,
    data: null,
    owner: null,
    error: null,
    key: null,
    _loading: false,
    _inp: null,
    _children: null,

    type: function() {
        if(this.isRoot()) return "MainPage";
        return this.get("type");
    },

    uri: function() {
        return this.host + this.path;
    },

    href: function() {
        return this.path;
    },

    aid: function() {
        return this.author && this.author.aid;
    },

    ev: function(fnName, args, confirmMsg) {
        return function(ev) {
            if(ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            (!confirmMsg || confirm(transl(confirmMsg))) && this[fnName] && this[fnName].apply(this, args || []);
        }.bind(this);
    },

    remove: function() {
        this._setData({ data: "" });
        return this.save();
    },

    save: function(fn) {
        var parent = !this.isRoot() && this.parent();
        var ver = (this.ver|0) + 1;
        var uid = this.isRoot()? this.host : (this.uid || parent.uri());
        var name = this.name;
        var newData;
        if(this.isRemoved()) {
            newData = "";
        } else {
            newData = {};
            for(var i in this.data) {
                newData[i] = this.data[i];
            }
            for(i in this._inp) if(i[0] !== "_") { // set input values
                newData[i] = this.get(i);
            }
            for(i in newData) {
                if(newData[i] === null || newData[i] === undefined)
                    delete newData[i];
            }
            if(newData.name !== undefined) name = newData.name;
            delete newData.name;
            this.setName(name);
        }
        this._setData({
            _saving: true
        });
        baseAPI.postData({
            uid: uid,
            storage: this.storage,
            ring: this.ring,
            ver: ver,
            pos: name,
            data: newData
        }, function(err, resp) {
            this._setData({
                _saving: false,
                ver: ver,
                author: resp.author,
                data: err? this.data : newData,
                error: err
            })._refresh();
            if(!err) {
                this._inp = null;
                if(this.isRoot()) {
                    Application.siteInfo.title = this.get('title');
                    delete localStorage.siteInfo;
                }
                if(this._isNew) {
                    this._isNew = false;
                    if(parent) {
                        (parent._children || (parent._children = [])).unshift(this);
                        //todo: search position in _children by init.pos
                    }
                }
            }
            fn && fn(err, resp);
        }.bind(this));
        return this._refresh();
    },

    isRoot: function(){
        return this.host === Application.siteInfo.host
            && this.path === "/";
    },

    isNew: function(){
        return this._isNew;
    },

    isLoading: function(){
        return !!this._loading;
    },

    isLoaded: function(){
        return this.data !== null;
    },

    isRemoved: function(){
        return this.data === "";
    },

    isActive: function(){
        return this.host === Application.siteInfo.host
            && (location.pathname+"/").substr(0, this.path.length) === this.path;
    },

    isEditable: function(){
        return this.isLoaded() && this.author && this.author.isMe;
    },

    isAvailableToAdd: function() {
        var author = this.author, access = this.get("access") || "self";
        if(!author) return false;
        return author.isMe
            || access == "all"
            || access == "reg" && author.signed
            || access.split(",").indexOf(author.aid) > -1;
    },

    toString: function(){
        return this.get("title") || this.get("subject") || (this.error? '#ERROR{'+this.error+'}' : null) || this.name;
    },

    parent: function() {
        return !this.isRoot() && _newElement(this.path.replace(/[^\/]*\/$/, ""), this.host);
    },

    getChildStreamInfo: function() {
        var access = this.get("access")||"self";
        var strg = (access=="self"? "D" : "P") + Application.siteInfo.ring;  // <storage:CHAR><ring:int>
        return {
            uid: this.host + this.path,
            access: access,
            aid: /^[0-9a-zA-Z\-_]{20}$/.test(access)? access : this.author && this.author.aid || Application.siteInfo.owner,
            storage: strg.match(/^[A-Z]+/)[0],
            ring: strg.match(/[0-9]+/)[0]|0
        }
    },

    children: function() {
        if(this._children) return this._children;
        if(!this.isLoaded()) return [];
        var ch = this._children = [];
        var streamInf = this.getChildStreamInfo();
        var req = {
            cmd:     "top",
            uid:     streamInf.uid,
            aid:     streamInf.aid,
            ring:    streamInf.ring,
            storage: streamInf.storage
        };
        baseAPI.requestData(req, function(err, packs) {
            if (err) return {error: err};
            packs.forEach(function(pack){
                ch.push(_newElement(this.path + pack.pos, this.host, pack));
            }.bind(this));
            this._refresh();
        }.bind(this));
        return this._children;
    },

    datetime: function() {
        var t = String(this.name).match(/^(20\d\d)([01]\d)([0-3]\d)([0-2]\d)([0-5]\d)([0-5]\d)\d\d\d$/);
        if(t) return [t[1],"-",t[2],"-",t[3]," ",t[4],":",t[5],":",t[6]].join("");
    },

    get: function(name) {
        if(!this.isLoaded()) {
            this.load();
            return null;
        }
        if(this._inp && this._inp[name] !== undefined) {
            var val = this._inp[name];
            if(val instanceof Function) return val.call(this);
            return val;
        }
        return this.data[name] !== undefined && this.data[name]
            || this[name] !== undefined && !(this[name] instanceof Function) && this[name]
            || null;
    },

    set: function(name, value) {
        if(arguments.length === 1) {
            for(var i in name) this.set(i, name[i]);
        } else {
            if(name === "pos") name = "name";
            this._inp = this._inp || {};
            this._inp[name] = value;
        }
        return this;
    },

    reset: function() {
        this._inp = {};
        return this;
    },

    setName: function(name) {
        this.name = name;
        this.path = (this.parent() || {path: ""}).path + name + "/";
        return this;
    },

    newChildElement: function() {
        var element = new Element(this.path + "/", this.host);
        var streamInf = this.getChildStreamInfo();
        element.storage = streamInf.storage;
        element.ring = streamInf.ring;
        element.data = {};
        element._isNew = true;
        return element;
    },

    load: function(fn) {
        if(this.isLoaded()) {
            fn && fn(this);
            return this;
        }
        if(this._loading) {
            this._loading.push(fn);
            return this;
        }
        this._loading = [];
        if(fn) this._loading.push(fn);

        var parent = this.parent();
        var onParentLoaded = function(){
            if(this.error = parent && parent.error) {
                return this._refresh();
            }
            var strmInf = parent? parent.getChildStreamInfo() : Application.siteInfo;
            var req = {
                cmd: "doc", // load single document
                ring: strmInf.ring,
                storage: strmInf.storage,
                aid: strmInf.aid || strmInf.owner,
                uid: strmInf.uid || strmInf.host,
                pos: this.name,
                limit: 1
            };
            baseAPI.requestData(req, function(err, packs) {
                err = err || !packs.length && 'Not found ' + this.uri();
                this._setData(err? { error: err } : packs[0]);

                // callbacks
                while(this._loading.length) setTimeout(this._loading.shift());
                this._loading = false;
                return this._refresh();
            }.bind(this));
        }.bind(this);

        if(!parent) {
            onParentLoaded();
            //if(!parent) return _upd();
        } else {
            if(parent._children) {
                //todo: search in children
            }
            parent.load(onParentLoaded);
        }
        return this;
    },

    _refresh: function() {
        this.data && this.author && setTimeout(Application.onElementUpdate.bind(application, this));
    },

    _setData: function(pack) {
        if(pack.pos !== undefined) { // .name is synonym of .pos
            this.name = pack.pos;
            delete pack.pos;
        }
        ex(this, pack);
        if(this.isRemoved()) { // deleted
            this.title = "*[REMOVED]*";
            // remove element from parent.children
            var par = this.parent(), children = par && par._children;
            if(children)
            for(var i in children)
                if(children[i] === this) {
                    delete children[i];
                    break;
                }
            par._refresh();
        }
        this.key = _key++;
        return this;
    }
});

return _newElement;
})();