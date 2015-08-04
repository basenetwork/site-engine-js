var PhotoEdit = $class(Form, {
    render: function() {
        return (
            <form className="edit-form" onSubmit={this.submit}>
                <h2>Edit Photo</h2>
                <div className="form-group row">
                    <div className="col-md-1">
                        <label>file</label>
                        {this.$inputFile("photo", { placeholder: "photo", required:true })}
                    </div>
                    <div className="col-md-4">
                        <label>title</label>
                        {this.$input("title", { placeholder: "title" })}

                        <label>description</label>
                        {this.$inputText("description", { placeholder: "description" })}

                        <label>{transl("who can add comments")}</label>
                        {this.$inputSelect("access", { values:[
                            { value:"self", label:"only me" },  // todo: icon
                            { value:"reg",  label:"only registered users" },
                            { value:"all",  label:"all users" }
                        ]})}

                        <br/>
                        <br/>
                            <button type="submit" className="btn btn-primary" disabled={this.state.disabled}>{transl("Save")}</button>
                        &nbsp;
                            <button type="button" className="btn btn-default" onClick={this.close}>{transl("Close")}</button>
                    </div>
                </div>
            </form>
        );
    }
});

var Photo = $class(Page, {
    tplFormEdit: PhotoEdit,

    $Header: function() {
        return(
            <div className="photo-page">
                <div className="photo-cont">
                    <Img src={this.get("photo")} alt={this.get("title")} />
                </div>
                <div className="photo-description">
                    <div className="col-xs-2">
                        <UserIcon user={this.author()} />
                    </div>
                    <div className="col-xs-7">
                        <UserName user={this.author()} /> &nbsp;
                        <span className="datetime">{this.datetime()}</span>
                        <p>{this.get('title')}</p>
                    </div>
                    <div className="col-xs-2">
                        {false && this.isEditable() && <button className="btn btn-default btn-xs" onClick={this.element().ev("remove", [], "Remove photo?")}>{transl("remove")}</button>}
                        {this.isEditable() && <button className="btn btn-sm btn-primary btn-edit" onClick={this.editModeOn}>
                            <i className="glyphicon glyphicon-edit"></i> {transl("edit")}
                        </button>}
                    </div>
                </div>
                <a className="btn-close" href={this.element().parent().path}>&times;</a>
            </div>
        );
    }
});

var PhotoItem = $class({
    render: function() {
        var element = this.props.element;
        return(
            <div className="photo-item">
                <div className="photo-desc">
                    <div className="col-xs-2">
                        <UserIcon user={element.author} />
                    </div>
                    <div className="col-xs-8">
                        <UserName user={element.author} /> &nbsp;
                        <span className="datetime">{element.datetime()}</span>
                        <p>{element.get('title')}</p>
                    </div>
                    <div className="col-xs-2">
                        {element.isEditable() && <button className="btn btn-default btn-xs" onClick={element.ev("remove", [], "Remove photo?")}>{transl("remove")}</button>}
                    </div>
                </div>
                <div className="row photo-cont">
                    <a href={element.path}>
                        <Img src={element.get("photo")} alt={element.get("title")} />
                    </a>
                </div>
            </div>
        );
    }
});

var PhotoNew = $class(Form, {
    render: function() {
        return (
            <form onSubmit={this.submit} className="row form-group">
                <div className="col-sm-2">
                    {this.$inputFile("photo", {placeholder: "File", required: true})}
                </div>
                <div className="col-sm-4">
                    <div className="input-group">
                        {this.$input("title", {placeholder: "Title"})}
                        <span className="input-group-btn">
                            <button type="submit" className="btn btn-primary" disabled={this.state.disabled}>Add photo</button>
                        </span>
                    </div>
                </div>
            </form>
        );
    },

    onSubmit: function() {
        this.set('type', 'Photo');
        this.set('name', new Date().toISOString().replace(/[^\d]/g, ''));
    }
});

var PhotoAlbum = $class(Page, {
    tplChildItem: PhotoItem,
    tplChildForm: PhotoNew
});
var Photos = PhotoAlbum;