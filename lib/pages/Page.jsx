var Page = $component('page', {

    tplFormEdit: 'FormPage',

    tplChildItem: 'Comment',
    tplChildForm: 'CommentNew',

    //---- templates ------
    $Header: function() {
        var coverImg = this.get("cover"), coverID = "cover-" + this.element().key;
        coverImg && baseAPI.setImageContent(coverID, coverImg);
        //todo: don`t load image on each render
        return(
            <div className="header" style={{backgroundColor: this.get("color") || "#497cd5" }}>
                {coverImg && <div id={coverID} className="cover" />}
                <div className="container">
                    <div className="row">
                        <div className="col-sm-1">
                            {this.get("icon") && <i className={"icon glyphicon glyphicon-"+this.get("icon")}></i>}
                        </div>
                        <div className="col-sm-11">
                            <h1>{this.get("title")}</h1>
                            <p className="lead">{this.get("description")}</p>
                        </div>
                    </div>
                </div>
                {this.isEditable() && <button className="btn btn-sm btn-primary btn-edit" onClick={this.editModeOn}>
                    <i className="glyphicon glyphicon-edit"></i> {transl("edit")}
                </button>}
            </div>
        );
    },

    $Stream: function() {
        return (
            <div className="container">
                {this.isAvailableToAdd() && this.$FormNewItem()}
                {this.children().map(this.$ChildItem)}
            </div>
        );
    },

    $ChildItem: function(element) {
        return $element(this.tplChildItem, { element: element, key: element.key });
    },

    $FormEdit: function() {
        return $element(this.tplFormEdit, { element: this.element(), onClose:this.editModeOff });
    },

    $FormNewItem: function() {
        var e = this.element();
        return $element(this.tplChildForm, { parent: e, key: e.key + 'newCh' });
    },

    $Footer: function() {
        return (
            <footer></footer>
        )
    },

    //----- methods ----------
    getInitialState: function() {
        return {}
    },

    render: function() {
        return (
            <div>
                {this.state.editMode? this.$FormEdit() : this.$Header()}
                {this.$Stream()}
                {this.$Footer()}
            </div>
        );
    },

    element: function() {
        return this.props.element;
    },

    children: function() {
        return this.element().children();
    },

    get: function(param) {
        var e = this.element();
        return e? e.get(param) : null;
    },

    author: function() {
        return this.element().author;
    },

    datetime: function() {
        return this.element().datetime();
    },

    isEditable: function() {
        return this.element().isEditable();
    },

    isAvailableToAdd: function() {
        return this.element().isAvailableToAdd();
    },

    //----- events --------
    editModeOn: function() {
        this.setState({ editMode: true });
    },

    editModeOff: function() {
        this.setState({ editMode: false });
    }
});

var FormPage = $class(Form, {
    render: function() {
        return (
            <form className="edit-form" onSubmit={this.submit}>
                <h2>{transl("Edit Page")}</h2>
                <div className="form-group row">
                    <div className="col-md-4">
                        <label>{transl("title")}</label>
                        {this.$input("title", { placeholder: "title" })}
                    </div>
                    <div className="col-md-5">
                        <label>{transl("icon")}</label>
                        {this.$inputIcon("icon", { placeholder: "icon" })}
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-md-5">
                        <label>{transl("description")}</label>
                        {this.$inputText("description", { placeholder: "description" })}
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-md-2">
                        <label>{transl("cover image")}</label>
                        {this.$inputFile("cover", { placeholder: "cover image" })}
                    </div>
                    <div className="col-md-2">
                        <label>{transl("color")}</label>
                        {this.$inputColor("color", { placeholder: "color" })}
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-md-3">
                        <label>{transl("who can add child items")}:</label>
                        {this.$inputSelect("access", { values:[
                            { value:"self", label:"only me" },  // todo: icon
                            { value:"reg",  label:"only registered users" },
                            { value:"all",  label:"all users" }
                        ]})}
                    </div>
                </div>
                <div className="form-group ">
                    <button type="submit" className="btn btn-primary">{transl("Save")}</button>
                &nbsp;
                    <button type="button" className="btn btn-default" onClick={this.close}>{transl("Close")}</button>
                </div>
            </form>
        );
    }
});
