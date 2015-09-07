var Comment = $component('comment', {
    render: function() {
        var element = this.props.element;
        return(
            <div className="comment">
                <div className="comment-ico">
                    <UserIcon user={element.author} showLink="true" />
                </div>
                <div className="comment-body">
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
            <form onSubmit={this.submit} className="comment">
                <div className="comment-ico">
                    &nbsp;
                </div>
                <div className="comment-body">
                    <div className="form-group">
                        {this.$inputText("text", {placeholder: "New comment", required: true})}
                    </div>
                    <div className="form-group">
                        <button type="submit" disabled={this.state.disabled} className="btn btn-primary">Add comment</button>
                    </div>
                </div>
            </form>
        );
    },

    onSubmit: function() {
        this.setDefault('name', strTime());
    }
});
