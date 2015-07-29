var RegistrationForm = $class({
    getInitialState: function() {
        return {}
    },

    render: function() {
        return (
        <div className="panel panel-primary">
            <div className="panel-heading">{transl("Registration")}</div>
            {this.state.success?
                <div  className="panel-body">
                    <div className="alert alert-success">
                        {this.state.success}
                    </div>
                    <button className="btn btn-success" onClick={this.reload}>{transl("Continue")}</button>
                </div>
            :
            <form className="panel-body" onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label for="regName">{transl("nickname")}</label>
                    <input type="text" className="form-control" id="regName" placeholder="my-domain.base.network" disabled={!!this.state.progress} />
                </div>
                <div className="form-group">
                    <label for="regInviteCode">
                        {transl("invite code")}
                    </label>
                    <input type="text" className="form-control" id="regInviteCode" placeholder={transl("invite code")} disabled={!!this.state.progress} />
                    <small>(<a href="#" onClick={this.onGetInviteCode}>{transl("Receive the invite code")}</a>)</small>
                </div>
                {this.state.error && <div className="alert alert-danger">
                    {this.state.error}
                </div>}
                {this.state.progress && <div className="progress">
                    <div className="progress-bar progress-bar-striped active" style={{width: Math.min(100, this.state.progress/8*100|0)+"%"}} />
                </div>}
                <div className="form-group">
                    <button className="btn btn-primary" disabled={!!this.state.progress} type="submit">{transl("Sign Me Up")}</button>
                &nbsp;
                    <button className="btn btn-default" disabled={!!this.state.progress} onClick={this.onClose}>{transl("Close")}</button>
                </div>
            </form>}
        </div>
        );
    },

    onClose: function(ev) {
        ev && ev.preventDefault();
        ev && ev.stopPropagation();
        this.close();
    },

    reload: function() {
        location.reload();
    },

    close: function() {
        this.props.onClose();
    },

    onSubmit: function(ev) {
        ev && ev.preventDefault();
        ev && ev.stopPropagation();

        var name = document.getElementById('regName').value.trim().toLowerCase();
        var code = document.getElementById('regInviteCode').value.trim();
        var cc = code.match(/^([a-zA-Z0-9]{14})([a-f0-9]{4})$/);
        var domain = name + "." + base.registrars[0].zone;
        var cert = base.Accounts.getCurrentCertificate();
        var cert64 = cert.toString();

        if(!/^[a-z][a-z0-9\-]{2,60}$/.test(name)) {
            return this.setState({error: transl("Incorrect domain name"), err: null});
        }
        if(!cc || !_.sha256(cc[1]).substr(0, 4)) { // check CRC
            return this.setState({error: transl("Invalid invite code"), err: null});
        }
        this.setState({
            progress: 1,
            error: null,
            err: null
        });

        // check domain
        base.core.requestData({
            storage: "N",
            ring: 0,
            uid: domain
        }, function(err, packs) {
            if(err) return this.setState({ error: transl("Error of checking domain information!"), err: err, progress: null});
            if(packs.length) return this.setState({ error: transl("Domain is already registered by another person."), progress: null});
            this.setState({ progress: 2 });

            // check by invite code
            base.core.requestData({
                storage: "D",
                ring: 1,
                uid: "invite-codes/" + code,
                aid: base.registrars[0].cert,
                pos: ""
            }, function(err, packs) {
                if(err) return this.setState({ error: transl("Error of checking invite code information!"), err: err, progress: null});
                if(packs.length) return this.setState({ error: transl("This invite code is already used"), err: err, progress: null});
                this.setState({ progress: 3 });

                // registration
                base.core.postData({
                    storage: "P",
                    ring: 1,
                    uid: "base/registration",
                    pos: strTime(),
                    senderTag: "registration",          // anonymous sender
                    recipient: base.registrars[0].cert, // encrypt message for recipient
                    data: {
                        cert: cert64,
                        name: name,
                        code: code
                    }
                }, function(err, res){
                    if(err) return this.setState({ error: transl("Error: Can not register"), err: err, progress: null});

                    this.setState({
                        progress: 4,
                        success: null //"Request was successfully sent to the registrar. Please wait. Registration will be completed for a few minutes."
                    });

                    var _interval = 2111, _checkDomain = function(){
                        this.setState({ progress: this.state.progress + 0.1 });
                        base.core.requestData({
                            storage: "N",
                            ring: 0,
                            uid: domain
                        }, function(err, packs) {
                            this.setState({ progress: this.state.progress + 0.1 });
                            if (err) this.setState({ error: transl("Error of checking domain information!"), err: err });

                            if (err || !packs || !packs.length) { // continue
                                return setTimeout(_checkDomain, _interval += 1009);
                            }
                            var data = packs[0].data;
                            var _cert = base.Certificate.parsePublicCertificate(data.owner);
                            if(cert.pub == _cert.pub) {
                                this.setState({ success: transl("Account has been successfully registered."), progress: null });
                                //setTimeout(application.reloadPage, 3559);

                            } else {
                                this.setState({ error: transl("Domain is already registered by another person."), progress: null });
                            }

                        }.bind(this));

                    }.bind(this);
                    setTimeout(_checkDomain, _interval);

                }.bind(this));

            }.bind(this));
            
        }.bind(this));
    },

    onGetInviteCode: function(ev){
        ev && ev.preventDefault();
        ev && ev.stopPropagation();

        var email = prompt(
            transl("Enter your @gmail.com account") + "\n\n" +
            transl("(Your gmail-account is not saved anywhere! It is necessary for registration limit only)")
        );
        if(!(email=(email||"").trim())) return;

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4) {
                if(xhr.status != 200) {
                    alert(transl("ERROR: Can not get invite code.")
                        +" (Response status is " + xhr.status+")");
                } else {
                    alert(xhr.response);
                }
            }
        };
        // Invite code has been sent to your email ''. Check your email.
        xhr.open("GET", "http://iv.base.network/invite/?email="+encodeURIComponent(email), true);
        xhr.send();
    }

});