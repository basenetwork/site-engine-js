var AudioEdit = $class(Form, {
    render: function() {
        return (
            <form className="edit-form" onSubmit={this.submit}>
                <h2>{transl("Edit audio")}</h2>
                <div className="form-group row">
                    <div className="col-md-1">
                        <label>{transl("file")}</label>
                        {this.$inputFile("file", { placeholder: "audio", required:true })}
                    </div>
                    <div className="col-md-4">
                        <label>{transl("title")}</label>
                        {this.$input("title", { placeholder: "title" })}

                        <label>{transl("description")}</label>
                        {this.$inputText("description", { placeholder: "description" })}

                        <label>{transl("who can add comments")}</label>
                        {this.$inputSelect("access", { values:[
                            { value:"self", label:"only me" },  // todo: icon
                            { value:"reg",  label:"only registered users" },
                            { value:"all",  label:"all users" }
                        ]})}

                        <br/>
                        <br/>
                        <button type="submit" className="btn btn-primary">{transl("Save")}</button>
                    &nbsp;
                        <button type="button" className="btn btn-default" onClick={this.close}>{transl("Close")}</button>
                    </div>
                </div>
            </form>
        );
    }
});

$component('audio', Page, {
    tplFormEdit: AudioEdit,

    $Header: function() {
        return(
            <div className="audio-page">
                <div className="audio-cont">
                    <Audio autoplay="true" controls="controls" src={this.get("file")} />
                </div>
                <div className="audio-description">
                    <div className="col-xs-2">
                        <UserIcon user={this.author()} />
                    </div>
                    <div className="col-xs-7">
                        <UserName user={this.author()} /> &nbsp;
                        <span className="datetime">{this.datetime()}</span>
                        <p>{this.get('title')}</p>
                    </div>
                    <div className="col-xs-2">
                        {false && this.isEditable() && <button className="btn btn-default btn-xs" onClick={this.element().ev("remove", [], "Remove audio?")}>{transl("remove")}</button>}
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

var AudioItem = $class({
    render: function() {
        var element = this.props.element;
        return(
            <div className="audio-item">
                <div className="col-sm-5">
                    &nbsp;
                    {element.get('title')}
                    &nbsp;
                    {element.isEditable() && <button className="close" onClick={element.ev("remove", [], "Remove audio?")}>&times;</button>}
                </div>
                <div className="col-sm-5">
                    <Audio src={element.get("file")} width="100%" controls="controls" />
                </div>
                <div className="col-sm-2">
                </div>
                <div className="audio-desc">
                    <div className="col-xs-2">
                    </div>
                </div>
            </div>
        );
    }
});

var AudioNew = $class(Form, {
    render: function() {
        return (
            <form onSubmit={this.submit} className="row form-group">
                <div className="col-sm-2">
                    {this.$inputFile("file", {placeholder: "Audio file", required: true})}
                </div>
                <div className="col-sm-4">
                    <div className="input-group">
                        {this.$input("title", {placeholder: "Title"})}
                        <span className="input-group-btn">
                            <button type="submit" className="btn btn-primary" disabled={this.state.disabled}>{transl("Add audio")}</button>
                        </span>
                    </div>
                </div>
            </form>
        );
    },

    onSubmit: function() {
        this.set('type', 'audio');
        this.set('name', new Date().toISOString().replace(/[^\d]/g, ''));
    }
});

$component('audio-list,audios', Page, {
    tplChildItem: AudioItem,
    tplChildForm: AudioNew
});
