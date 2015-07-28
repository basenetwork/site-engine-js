var Img = $class({
    render: function() {
        var src = this.props.src;
        if(!src) return <i />;
        if(this._src != src)
            setTimeout(function(){
                try{
                    var node = this.getDOMNode();
                } catch(e) {
                    return
                }
                var req = baseAPI.parseRequest(this._src = src);
                req.sizeLimit = this.props.sizeLimit;
                baseAPI.setImageContent(node, req);
            }.bind(this));
        return (
            <img width={this.props.width} height={this.props.height} alt={transl(this.props.alt)} />
        );
    }
});
