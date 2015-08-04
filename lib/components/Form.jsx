var Form = $class({

    defaultValues: {
        // param: value,...
    },

    getInitialState: function() {
        if(this.defaultValues) {
            for(var param in this.defaultValues)
                this.setDefault(param, this.defaultValues[param]);
        }
        setTimeout(this.refreshForm.bind(this));
        return {};
    },

    render: function() {
        return (
            <form onSubmit={this.onSubmit}>Abstract form</form>
        );
    },

    $input: function(param, options) {
        options = options || {};
        var e = this.element();
        var type = options.type || "line";
        return (
            <Input form={this} name={param} ref={param} key={param+e.key} type={type} element={e} options={options} />
        )
    },

    $inputText:     function(param, op) { return this.$input(param, ex({type: "text"},  op)); },
    $inputColor:    function(param, op) { return this.$input(param, ex({type: "color"}, op)); },
    $inputIcon:     function(param, op) { return this.$input(param, ex({type: "icon"},  op)); },
    $inputFile:     function(param, op) { return this.$input(param, ex({type: "file"},  op)); },
    $inputSelect:   function(param, op) { return this.$input(param, ex({type: "select"},  op)); },
    $inputCheckbox: function(param, op) { return this.$input(param, ex({type: "checkbox"},  op)); },

    element: function() {
        return this._element
            || (this._element = (this.props.element || this.props.parent && this.props.parent.newChildElement()));
    },

    get: function(param) {
        var e = this.element();
        return e? e.get(param) : null;
    },

    set: function(param, value) {
        var e = this.element();
        if(e) e.set.apply(e, arguments);
        return this;
    },

    setDefault: function(param, value) {
        this.get(param) || this.set(param, value);
        return this;
    },

    reset: function() {
        var e = this.element();
        e && e.reset();
        return this;
    },

    val: function(param) {
        var ref = this.refs[param];
        if(ref && ref.value) return ref.value();
    },

    values: function() {
        var vals = {};
        for(var i in this.refs)
            if(this.refs[i].value) {
                vals[i] = this.refs[i].value();
            }
        return vals;
    },

    refreshForm: function(){
        var dsbl = false, inp;
        if(this.refs)
        for(var i in this.refs)
        if((inp = this.refs[i]) && inp.value) {
            var val = inp.value();
            if(typeof val === "string") val=val.trim();
            if(inp.props.options.required && !val || !inp.isValid()) {
                dsbl = true;
                break;
            }
        }
        if(this.state.disabled !== dsbl) this.setState({ disabled: dsbl });
    },

    close: function() {
        this.reset();
        this.props.onClose && this.props.onClose();
    },

    onSubmit: function(ev) {

    },

    onAfterSubmit: function(newElement) {

    },

    submit: function(ev) {
        ev && ev.preventDefault();
        ev && ev.stopPropagation();
        // todo: check format of input values
        if(this.onSubmit(ev) === false) return;

        var element = this.element();
        element.save(function(err){
            if(!err) {
                this._element = null;
                this.onAfterSubmit(element);
                if(this.props.onSubmit) this.props.onSubmit();
                this.close();
            }
            element._refresh();
        }.bind(this));
    }

});
