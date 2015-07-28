var ErrorPage = $class({
    render: function() {
        return(
            <div className="docs-header" tabindex="-1">
                <div className="container">
                    <h1>{transl("Error")}</h1>
                    <p>{transl(this.props.error)}</p>
                    {this.props.details && <pre>
                        <b>details:</b>
                        <br/>
                        {JSON.stringify(this.props.details)}
                    </pre>}
                </div>
            </div>
        );
    }
});