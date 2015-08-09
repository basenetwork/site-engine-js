var STD_ICONS = [
    'asterisk','plus','euro','eur','minus','cloud','envelope','pencil','glass','music','search','heart','star','star-empty',
    'user','film','th-large','th','th-list','ok','remove','zoom-in','zoom-out','off','signal','cog','trash','home','file',
    'time','road','download-alt','download','upload','inbox','play-circle','repeat','refresh','list-alt','lock','flag',
    'headphones','volume-off','volume-down','volume-up','qrcode','barcode','tag','tags','book','bookmark','print','camera',
    'font','bold','italic','text-height','text-width','align-left','align-center','align-right','align-justify','list',
    'indent-left','indent-right','facetime-video','picture','map-marker','adjust','tint','edit','share','check','move',
    'step-backward','fast-backward','backward','play','pause','stop','forward','fast-forward','step-forward','eject',
    'chevron-left','chevron-right','plus-sign','minus-sign','remove-sign','ok-sign','question-sign','info-sign',
    'screenshot','remove-circle','ok-circle','ban-circle','arrow-left','arrow-right','arrow-up','arrow-down','share-alt',
    'resize-full','resize-small','exclamation-sign','gift','leaf','fire','eye-open','eye-close','warning-sign','plane',
    'calendar','random','comment','magnet','chevron-up','chevron-down','retweet','shopping-cart','folder-close',
    'folder-open','resize-vertical','resize-horizontal','hdd','bullhorn','bell','certificate','thumbs-up','thumbs-down',
    'hand-right','hand-left','hand-up','hand-down','circle-arrow-right','circle-arrow-left','circle-arrow-up','circle-arrow-down',
    'globe','wrench','tasks','filter','briefcase','fullscreen','dashboard','paperclip','heart-empty','link','phone',
    'pushpin','usd','gbp','sort','sort-by-alphabet','sort-by-alphabet-alt','sort-by-order','sort-by-order-alt',
    'sort-by-attributes','sort-by-attributes-alt','unchecked','expand','collapse-down','collapse-up','log-in','flash',
    'log-out','new-window','record','save','open','saved','import','export','send','floppy-disk','floppy-saved','floppy-remove',
    'floppy-save','floppy-open','credit-card','transfer','cutlery','header','compressed','earphone','phone-alt','tower',
    'stats','sd-video','hd-video','subtitles','sound-stereo','sound-dolby','sound-5-1','sound-6-1','sound-7-1',
    'copyright-mark','registration-mark','cloud-download','cloud-upload','tree-conifer','tree-deciduous','cd','save-file',
    'open-file','level-up','copy','paste','alert','equalizer','king','queen','pawn','bishop','knight','baby-formula',
    'tent','blackboard','bed','apple','erase','hourglass','lamp','duplicate','piggy-bank','scissors','bitcoin','btc','xbt',
    'yen','jpy','ruble','rub','scale','ice-lolly','ice-lolly-tasted','education','option-horizontal','option-vertical',
    'menu-hamburger','modal-window','oil','grain','sunglasses','text-size','text-color','text-background','object-align-top',
    'object-align-bottom','object-align-horizontal','object-align-left','object-align-vertical','object-align-right',
    'triangle-right','triangle-left','triangle-bottom','triangle-top','console','superscript','subscript','menu-left',
    'menu-right','menu-down','menu-up'
];

var Input = $class({
    getInitialState: function(){
        return {}
    },

    isValid: function() {
        if(this.state.error) return false;
        var fmt = this.props.options.format;
        return !fmt || (fmt instanceof RegExp && fmt || {
            title: /^\S/,
            name: /^[a-z0-9A-Z\-]+$/,
            int: /^\d+$/,
            number: /^\d+\.?\d*$/,
            float: /^\d+\.?\d*$/,
            email: /^[a-z0-9A-Z\.\-_\+]+@[a-z0-9A-Z\.\-_\+]+$/
        }[fmt] || /.*/).test(this.value()||"");
    },

    render: function () {
        var st = this.state;
        var type = this.props.type;
        var options = this.props.options || {};
        var value = this.value();
        var err = !value || this.isValid()? "" : " inp-error";

        switch(type) {
            default:
            case "line":
                return (
                    <input type="text" onChange={this.onChangeInput} className={"form-control"+err} defaultValue={value} placeholder={transl(options.placeholder)} />
                );

            case "tel":
            case "email":
            case "password":
            case "number":
            case "color":
            case "hidden":
                return (
                    <input type={type} onChange={this.onChangeInput} className={"form-control input-"+type+err} defaultValue={value} placeholder={transl(options.placeholder)} />
                );

            case "checkbox":
                return(
                    <div className={"checkbox"+(err? "" : " has-error")}>
                        <label>
                            <input type="checkbox" onChange={this.onChangeCheckbox} defaultChecked={value} placeholder={transl(options.placeholder)} />
                            {transl(options.label)}
                        </label>
                    </div>
                );

            case "text":
                return(
                    <textarea onChange={this.onChangeInput} className={"form-control"+err} defaultValue={value} placeholder={transl(options.placeholder)} />
                );

            case "select":
                return (
                    <select onChange={this.onChangeInput} className={"form-control"+err} defaultValue={value} placeholder={transl(options.placeholder)}>
                    {(options.values||[]).map(function(val, i){
                        if(typeof val === "string") val = {value: val, label: val, icon: null};
                        // set default value
                        if(value === null && !i) this.setValue(val.value);

                        // todo: use html version
                        // todo: add icons {val.icon && <i className={"glyphicon glyphicon-"+val.icon}></i>}
                        return (
                            <option value={val.value}>
                                {transl(val.label!==undefined? val.label : val.value)}
                            </option>
                        )
                    }.bind(this))}
                    </select>
                );

            case "icon":
                return(
                    <div className="input-icon btn-group">
                        <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className={"glyphicon glyphicon-"+value}></i>
                            &nbsp;&nbsp;&nbsp;
                            <span className="caret"></span>
                        </button>
                        <div className="dropdown-menu">
                            <a href="#" onClick={this.onClickIcon.bind(this, null)} key="0">
                                &nbsp;
                            </a>
                        {STD_ICONS.map(function(ico){
                            return <a href="#" onClick={this.onClickIcon.bind(this, ico)} key={ico} className={(ico==value? "active" : "")}>
                                <i className={"glyphicon glyphicon-"+ico} />
                            </a>
                        }.bind(this))}
                        </div>
                    </div>
                );

            case "image":
            case "file":
                // todo: type="image"
                // todo: multiple="multiple"
                // todo: drag and drop files
                // todo: add extension-icon
                return (
                    <div className="form-control input-file">
                        {value && (isImage(value)? <div id={setImg(value)} /> : <b>.{getExtension(value)}</b>)}
                        {!st.error && !value && options.placeholder && <span>{transl(options.placeholder)}</span>}
                        {st.error && <div className="text-danger">{transl(st.error)}</div>}
                        <input type="file" key={value} onChange={this.onChangeFile} />
                        {value && <a href="#" title="clear" onClick={this.reset} >&times;</a>}
                    </div>
                );
        }
    },

    element: function() {
        return this.props.name && this.props.element;
    },

    reset: function(ev) {
        ev && ev.preventDefault();
        ev && ev.stopPropagation();
        return this.value(null);
    },

    value: function(value) {
        if(arguments.length) { // set
            this.setValue(value);
            this.setState({});
            this.props.form && this.props.form.refreshForm();
        } else { // get
            return this.getValue();
        }
    },

    setValue: function(value) {
        var name = this.props.name, element = this.props.element;
        if(element && name) element.set(name, value);
    },

    getValue: function() {
        var name = this.props.name, element = this.props.element;
        if(element && name) return element.get(name);
    },

    onClickIcon: function(ico, ev) {
        ev && ev.preventDefault();
        ev && ev.stopPropagation();
        this.value(ico);
    },

    onChangeFile: function(ev) {
        var files = ev.currentTarget.files;
        if(!files || !files.length) return;
        this.state.error = null;
        // todo: show progress
        baseAPI.uploadFile({ file: files[0] }, function(err, linkInf){ // upload done
            if(err) return this.setState({ error: 'Upload error' });
            this.value(linkInf.uri);
            this.setState({});
        }.bind(this));
    },

    onChangeCheckbox: function(ev) {
        if(ev && ev.currentTarget) this.value(ev.currentTarget.checked);
    },

    onChangeInput: function(ev) {
        if(ev && ev.currentTarget) this.value(ev.currentTarget.value);
    }
});
