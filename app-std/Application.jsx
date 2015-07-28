var Application = $class({
    render: function() {
        var root = Application.element("/"); // main page
        var page = Application.element(); // current page
        var pageType = page.type();
        var pageClass = context[pageType];
        return (
            <div>
                <header className="navbar navbar-inverse navbar-default navbar-fixed-top ">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button className="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse">
                                <span className="sr-only">{transl("Toggle navigation")}</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a href="/" className="navbar-brand">{root.get("title")}</a>
                        </div>
                        <nav className="collapse navbar-collapse navbar-left bs-navbar-collapse">
                            <ul className="nav navbar-nav">
                            {root.children().map(function(e){
                                return <li key={e.key} className={e.isActive() && "active" || null}>
                                    <a href={e.href()}>
                                        {e.data.icon && <i className={"glyphicon glyphicon-"+e.data.icon}></i>}
                                        &nbsp;&nbsp;
                                        {e.toString()}
                                    </a>
                                </li>
                            })}
                            </ul>
                        </nav>
                    </div>
                </header>
                {pageClass?
                    $element(pageClass, { element: page }) :
                    $element(ErrorPage, { error: "Unknown Page Type", details: page})
                }
            </div>
        );
    },

    init: function() {
        application = this; // instance of Application

        if(window.history) {
            document.body.addEventListener('click', function(ev){
                for(var href, e = ev.target; e && e !== document.body; e = e.parentNode) {
                    if(e.nodeName == 'A') {
                        if((href = String(e.getAttribute('href'))) && href != "#") {
                            if(ev.metaKey || ev.ctrlKey) // spec keys
                                return true;
                            ev.preventDefault();
                            ev.stopPropagation();
                            $(".in").removeClass("in"); //todo: remove jQuery
                            Application.setLocation(href);
                        }
                        return;
                    }
                }
            }, false);
            if(window.history.state === null) {
                window.history.replaceState(location.pathname, location.hostname, location.pathname);
            }
            window.addEventListener('popstate', function(ev){
                if(ev.state !== null) Application.setLocation(ev.state, true);
            }, false);
        }
    },

    getInitialState: function() {
        this.init();
        return {}
    },

    //-------------- static methods ----------------------------
    statics: {
        siteInfo: baseAPI.getCurrentSiteInfo(),

        element: function(path, host) {
            return newElement(path, host);
        },

        setLocation: function(path, byHistory){
            if(!window.history) {
                window.location = path;
                return;
            } else if(!byHistory) {
                window.history.pushState(path, path, path);
            }
            Application.onElementUpdate();
        },

        breadCrumbs: function(){
            var url = "/", ee = [Application.element(url)];
            location.pathname.split('/').forEach(function(s) {
                if(s) ee.push(Application.element(url += s + "/"));
            });
            return ee;
        },

        onElementUpdate: function(element) {
            var docTitle = Application.element().toString();
            if(document.title != docTitle) {
                document.title = docTitle;
                window.history.replaceState(location.pathname, docTitle, location.pathname);
            }
            application.forceUpdate();
        }
    }
});
