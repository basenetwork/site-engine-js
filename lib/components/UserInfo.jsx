var STD_ICONS_ANON = ['star','music','heart','glass','signal','font','leaf','gift','fire','heart-empty','phone',
    'flash','send','tower','tree-conifer','tree-deciduous','apple','knight','king','queen','tent','piggy-bank',
    'education','grain','paperclip','bell','picture','camera','book','th-large','asterisk','pencil','cloud',
    'star-empty'
];

//-------------- UserIcon ----------------------
var UserInfo = $class({
    getInitialState: function() {
        var user = this.props.user;
        var cert = baseAPI.parseCertificate(user.cert? user.cert : user);
        if(cert) {
            if(cert.isAnonymous()) {
                return {
                    isAnonymous: true,
                    nickname: "anonymous-"+parseInt(cert.pub.substr(0,8), 16).toString(36).toUpperCase(),
                    ico: STD_ICONS_ANON[parseInt(cert.pub.substr(-10), 16) % STD_ICONS_ANON.length],
                    color: "#" + cert.pub.substr(-6)
                };
            }
            baseAPI.getAuthorInfo(cert.toString(), function(err, info){
                setTimeout(this.setState.bind(this, err? {error: "ERROR: "+err} : info));
            }.bind(this));
        }
        return {
            color: "#" + cert.pub.substr(-6)
        }
    },

    toString: function() {
        return this.state[this.props.type || "nickname"]
    },

    render: function () {
        return (
            <span>{this.toString()}</span>
        );
    }
});

var UserIcon = $class(UserInfo, {
    render: function () {
        return this.state.isAnonymous? (
            <div className="user-icon user-icon-anon" style={{backgroundColor: this.state.color}}>
                <i className={"icon glyphicon glyphicon-"+this.state.ico}></i>
            </div>
        ):(
            <div className="user-icon" style={{backgroundColor: this.state.color}}>
                <Img src={this.state.icon} sizeLimit={50*1024} />
            </div>
        );
    }
});

var UserName = $class(UserInfo, {
    render: function() {
        return (
            <b className="user-name">{this.toString()}</b>
        );
    }
});
