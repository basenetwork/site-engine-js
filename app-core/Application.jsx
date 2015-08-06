var Application = $class({

    getInitialState: function() {
        setTimeout(this.init.bind(this));
        return {
            error: false,
            loading: true,
            fExpandedWindow: window===top // todo: false
        }
    },

    render: function() {
        application = this; // instance of Application
        var state = this.state;
        var accounts = base.Accounts.getAccounts();
        var cert = base.Accounts.getCurrentCertificate();
        var accDomain = cert.name? cert.name + '.base.network' : "";

        // refresh core-frame style (at top window context)
        base.core.postMessageToTopWindow('setStyle', [[
            "width:50px; height:50px; position:fixed; z-index:10001; top:0; right:0; border:none;", // collapsed
            "width:100%; height:100%; position:fixed; z-index:10001; top:0; right:0; border:none;" // expanded
        ][state.fExpandedWindow|0]]);

        if(!state.fExpandedWindow) return (
            <div className="window window-expand-0">
                <a href="#" className="top-icon" onClick={this.evToggle("fExpandedWindow")}>
                    <UserIcon user={cert.toString()} />
                </a>
            </div>
        );
        //
        return (
            <div className="window window-expand-1">
                <div className="settings-block container">
                    <a className="btn-close" onClick={this.evToggle("fExpandedWindow")}>&times;</a>
                    <div className="profile-info"  key={cert.toString()} >
                        <UserIcon user={cert} />
                        <div className="cert-name">{cert.name}</div>
                        <UserName user={cert} />

                        {cert.isAnonymous() && !state.fRegForm &&
                        <div className="profile-reg-status">
                            {transl("This account is anonymous.")}
                            <div><button className="btn btn-default btn-sm" onClick={this.evToggle("fRegForm")}>{transl("Verify this account")}</button></div>
                        </div>}

                    </div>
                    {cert.isAnonymous() && state.fRegForm && <RegistrationForm onClose={this.evToggle("fRegForm")} />}

                    <div className="block row">
                    <h4>{transl("Account")}</h4>
                    {cert.isAnonymous() ?
                        <div>
                        </div>
                    :
                        <div>
                            {accDomain && <div >
                                <label className="col-sm-2">{transl("Domain:")}</label>
                                <a href={"//"+accDomain}><b>{accDomain}</b></a>
                            </div>}
                        </div>
                    }
                    </div>
                    <div className="block row keys-info">
                        <h4>{transl("Private key")}</h4>
                        <input type="text" className="form-control" value={base.Accounts.getCurrentPrivateKey()} disabled="disabled" />
                    </div>
                    <div className="row container">
                        <h4>{transl("Operations")}</h4>
                        <button className="btn btn-default" onClick={this.removeAccount}>{transl("Remove account")}</button>
                        &nbsp;
                        <button className="btn btn-default" onClick={this.setPrivateKey}>{transl("Set private key")}</button>
                    </div>
                    <div className="block row">
                        <h4>{transl("Other accounts")}</h4>
                        <ul className="accounts-list">
                        {accounts.map(function(cert){return(
                            <li className={cert.isCurrentCertificate()&&"active"} onClick={this.setCurrentAccount.bind(this, cert)}>
                                <UserIcon user={cert} />
                            </li>
                        )}.bind(this))}
                            <li>
                                <button className="add-account-btn" title="Add account" onClick={this.onAddAccount}>+</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    },

    init: function() {
        var cert = base.Accounts.getCurrentCertificate();
        cert.rsign && cert.name || cert.loadRegistrationInfo(function(err) {
            this.setState({
                error: err,
                loading: false
            });
            if(err || !cert.rsign) return;
            base.Accounts.saveAccounts();
            this.setState({
                fRegForm: false
            });
        }.bind(this));
    },

    evToggle: function(param) {
        return function() {
            var st={}; st[param] = !this.state[param];
            this.setState(st);
        }.bind(this);
    },

    reloadPage: function() {
        base.core.postMessageToTopWindow('reload');
        setTimeout(function(){location.reload() });
    },

    setCurrentAccount: function(cert) {
        base.Accounts.setCurrentAccount(cert);
        this.reloadPage();
    },

    onAddAccount: function() {
        base.Accounts.addNewAccount();
        this.forceUpdate();
    },

    removeAccount: function() {
        if(!confirm(transl("Are you sure you want to permanently delete the account?"))) return;
        base.Accounts.removeCurrentAccount();
        this.reloadPage();
    },

    setPrivateKey: function() {
        try {
            var prvKey = prompt(transl("Enter your private key"));
            if(base.Accounts.setPrivateKey(prvKey)) this.reloadPage();
        } catch(e) {
            alert(transl(e));
        }
    },

    setAccountInfo: function(info) {
        var cert = base.Accounts.getCurrentCertificate();
        info.name = info.name || cert.name;
        base.core.postData({
            storage: "D",
            ring: 1,
            uid: cert.pub,
            data: info // <- {name, icon, ...}
        }, function(err){
            if(err) return this.setState({ success: transl("Setting of account info has been failed."), progress: null });

            this.setState({ success: transl("Account has been successfully registered."), progress: null });
        }.bind(this));
    },

    //-------------- static methods ----------------------------
    statics: {
        //siteInfo: baseAPI.getCurrentSiteInfo(),

        element: function(path, host) {
            return newElement(path, host);
        },

        setLocation: function(path, byHistory){
            //if(!window.history) {
            //    window.location = path;
            //    return;
            //} else if(!byHistory) {
            //    window.history.pushState(path, path, path);
            //}
            //Application.onElementUpdate();
        },

        onElementUpdate: function(element) {
            //application.forceUpdate();
        }
    }
});
