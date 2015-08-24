var Video = $class({
    getInitialState: function(){
        return {}
    },

    render: function() {
        var src = this.props.src;
        if(!src) return <i />;
        if(this.state.src != src)
            baseAPI.getUnsafeFileURL(this.state.src = src, function(err, url){
                url && this.setState({ srcURL: url });
            }.bind(this));
        return (
            <video
                src={this.state.srcURL}
                onClick={this.onClick}
                width={this.props.width}
                height={this.props.height}
                autoplay={this.props.autoplay}
                preload={this.props.preload}
                controls={this.props.controls}
                poster={this.props.poster}
            />
        );
    },

    onClick: function(ev) {
        if(!/\bChrome\//.test(navigator.userAgent)) return;
        var vd = ev.currentTarget;
        if(vd.paused) vd.play();
        else vd.pause();
    }
});
