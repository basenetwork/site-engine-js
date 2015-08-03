var Comment = $class({
    render: function() {
        var element = this.props.element;
        return(
            <div className="comment media">
                <div className="media-left">
                    <UserIcon user={element.author} />
                </div>
                <div className="media-body">
                    <a name={element.name} />
                    <UserName user={element.author} /> &nbsp;
                    <span className="datetime">{element.datetime()}</span>
                    <p>{element.get('text')}</p>
                    {element.isEditable() && <button className="btn btn-default btn-xs" onClick={element.ev("remove", [], "Remove comment?")}>{transl("remove")}</button>}
                </div>
            </div>
        );
    }
});

var CommentNew = $class(Form, {
    render: function() {
        return (
            <form onSubmit={this.submit} className="row">
                <div className="col-sm-1">
                </div>
                <div className="col-sm-7">
                    <div className="form-group">
                        {this.$inputText("text", {placeholder: "New comment"})}
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">Add comment</button>
                    </div>
                </div>
            </form>
        );
    },

    onSubmit: function() {
        this.setDefault('name', strTime());
    }
});
