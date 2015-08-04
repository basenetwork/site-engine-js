var ArticleEdit = $class(Form, {
    render: function() {
        return (
            <form className="edit-form" onSubmit={this.submit}>
                <h2>{transl("Edit article")}</h2>
                <div className="form-group row">
                    <div className="col-md-1">
                        <label>{transl("image")}</label>
                        {this.$inputFile("image", { placeholder: "image" })}
                    </div>
                    <div className="col-md-5">
                        <label>{transl("title")}</label>
                        {this.$input("title", { placeholder: "title", required: true })}

                        <label>{transl("description")}</label>
                        {this.$inputText("description", { placeholder: "description", required:true })}

                        <label>{transl("content")}</label>
                        {this.$inputText("body", { placeholder: "content" })}

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

var Article = $class(Page, {
    tplFormEdit: ArticleEdit,

    $Header: function() {
        var img = this.get("image");
        return(
            <div className="article-page container">
                <div className="article-head row col-md-8">
                    <h1>{this.get('title')}</h1>
                </div>
                <div className="article-info row col-md-8">
                    <div className="col-xs-2">
                        <UserIcon user={this.author()} />
                    </div>
                    <div className="col-xs-8">
                        <UserName user={this.author()} /> &nbsp;
                        <span className="datetime">{this.datetime()}</span>
                    </div>

                    <div className="col-xs-2">
                        {false && this.isEditable() && <button className="btn btn-default btn-xs" onClick={this.element().ev("remove", [], "Remove article?")}>{transl("remove")}</button>}
                        {this.isEditable() && <button className="btn btn-sm btn-default btn-edi-t" onClick={this.editModeOn}>
                            <i className="glyphicon glyphicon-edit"></i> {transl("edit")}
                        </button>}
                    </div>
                </div>
                <div className="article-image row col-md-8">
                    {img && <Img src={img} />}
                </div>
                <div className="article-content row col-md-8">
                    {this.get("body")}
                </div>
            </div>
        );
    }
});

var ArticleItem = $class({
    render: function() {
        var element = this.props.element;
        var img = element.get("image");
        return(
            <div className="article-item">
                <div className="row">
                    <h2 className="col-md-8">
                        <a href={element.path}>{element.get('title')}</a>
                    </h2>
                </div>
                <div className="row article-cont">
                    <div className="col-md-3">
                        {img && <a href={element.path}><Img src={img} /></a>}
                    </div>
                    <div className="col-md-5">
                        <div className="row article-desc">
                            <div className="col-xs-7">
                                <UserIcon user={element.author} />
                                <UserName user={element.author} /> &nbsp;
                                <span className="datetime">{element.datetime()}</span>
                            </div>
                        </div>
                        {element.get("description")}
                        <div className="row">
                            {element.isEditable() && <button className="btn btn-default btn-xs" onClick={element.ev("remove", [], "Remove article?")}>{transl("remove")}</button>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var ArticleNew = $class(Form, {
    render: function() {
        return (
            <form onSubmit={this.submit} className="row">
                <div className="container">
                    <label>{transl("New article")}</label>
                </div>
                <div className="form-group col-sm-1">
                {this.$inputFile("image", {placeholder: "Article image"})}
                </div>
                <div className="form-group col-sm-6">
                    {this.$input("title", {placeholder: "Title", required: true})}
                </div>
                <div className="form-group col-sm-6">
                    {this.$inputText("description", {placeholder: "Description", required: true})}
                </div>
                <div className="form-group col-sm-6">
                    <button type="submit" className="btn btn-primary" disabled={this.state.disabled}>{transl("Add article")}</button>
                </div>

            </form>
        );
    },

    onSubmit: function() {
        this.set('type', 'Article');
        this.set('name', new Date().toISOString().replace(/[^\d]/g, ''));
    }
});

var Blog = $class(Page, {
    tplChildItem: ArticleItem,
    tplChildForm: ArticleNew
});
