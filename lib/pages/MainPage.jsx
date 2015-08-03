/**
 * Site section
 */
var SiteSection = $class({
    render: function() {
        var e = this.props.element;
        return <div key={e.key} className="col-sm-5 site-item">
                {e.get("icon") &&
                <a href={e.path} className="col-xs-2">
                    <i className={"glyphicon glyphicon-"+e.get("icon")}  style={{backgroundColor: e.get("color") }}></i>
                </a>
                    }
            <div className="col-xs-10">
                <h2><a href={e.path}>{e.toString()}</a></h2>
                <p>{e.get("description")}</p>
                {e.isEditable() && <button className="btn btn-default btn-xs" onClick={e.ev("remove", [], "Remove?")}>{transl("remove")}</button>}
            </div>
        </div>
    }
});

var SiteSectionNew = $class(Form, {
    render: function() {
        return (
            <form onSubmit={this.submit} className="form-group">
                <h4>{transl("New Plugin")}</h4>
                <div className="form-group">
                    {this.$inputSelect("type", {
                        placeholder: "type of page",
                        values:[
                            { value:"Blog", icon: "book" },
                            { value:"Chat", icon: "comment" },
                            { value:"Photo album", icon: "camera" },
                            { value:"Video list", icon: "film" },
                        ]
                    })}
                </div>
                <div className="form-group">
                    {this.$input("name", { placeholder: "name" })}
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">{transl("Add Plugin")}</button>
                </div>
            </form>
        );
    },

    onSubmit: function() {
        var colors = ['#41c441','#f3cd52','#eb7667','#4aa417','#d36fe8','#e5ae0d','#bd1515'];
        var icons = ['star','music','heart','glass','signal','font','leaf','gift','fire','heart-empty','phone',
            'flash','send','tower','tree-conifer','tree-deciduous','apple','knight','king','queen','tent','bank',
            'education','grain','paperclip','bell','picture','camera','book','th-large','asterisk','pencil','cloud',
            'star-empty','file'
        ];
        this.set('icon', icons[Math.random() * icons.length | 0]);
        this.set('color', colors[Math.random() * colors.length | 0]);
        this.set('title', this.val('name'));
    }
});

var MainPageEditForm = $class(Form, {

    //render: function() {
    //    return (
    //        <form className="edit-form" onSubmit={this.onSubmit}>
    //            <h2>Edit</h2>
    //            <div className="form-group">
    //                {this.$input("title")}
    //            </div>
    //            <div className="form-group">
    //                <label>description</label>
    //                {this.$inputText("description")}
    //            </div>
    //            <div className="form-group">
    //                <label>icon</label>
    //                {this.$inputIcon("icon")}
    //            </div>
    // todo: add site-core configuration
    //            <div className="form-group">
    //                <button type="submit" className="btn btn-primary">{transl("Save")}</button>
    //            &nbsp;
    //                <button type="button" className="btn btn-default" onClick={this.close}>{transl("Close")}</button>
    //            </div>
    //        </form>
    //    );
    //}
});


var MainPage = $class(Page, {

    //tplFormEdit: MainPageEditForm,
    tplChildItem: SiteSection,
    tplChildForm: SiteSectionNew,

    $Stream: function() {
        return (
        <div className="container">
            <div className="row">
                {this.children().sort(function(a, b){
                    return a.name > b.name
                }).map(this.$ChildItem)}
            </div>
            {this.isAvailableToAdd() &&
            <div className="row">
                <a className="col-xs-2">
                    <i className="icon glyphicon glyphicon-plus"></i>
                </a>
                <div className="col-xs-5">
                    {this.$FormNewItem()}
                </div>
            </div>
            }
        </div>
        );
    }

});