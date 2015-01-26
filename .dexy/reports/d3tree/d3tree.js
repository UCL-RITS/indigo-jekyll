// Taken from http://blog.pixelingene.com/2011/07/building-a-tree-diagram-in-d3-js/

var treeData = {"name": "", "contents": [{"name": "content", "contents": [{"name": "*.md|yamlargs|jinja|pandoc|h", "contents": [{"name": "assets", "contents": [{"name": "*.css", "contents": [{"name": "css/print.min.css", "contents": []}, {"name": "css/screen.min.css", "contents": []}, {"name": "css/jdibrief.min.css", "contents": []}, {"name": "css/daylab.min.css", "contents": []}, {"name": "css/designlang.min.css", "contents": []}, {"name": "css/venue.min.css", "contents": []}, {"name": "css/ie.min.css", "contents": []}, {"name": "css/yoursite.css", "contents": []}]}, {"name": "*.js", "contents": [{"name": "js/lib/all-site.min.js", "contents": []}, {"name": "js/src/respond.js", "contents": []}, {"name": "js/src/fastclick.js", "contents": []}, {"name": "js/lib/respond.min.js", "contents": []}, {"name": "js/main.js", "contents": []}, {"name": "js/lib/underscore-1.min.js", "contents": []}, {"name": "js/lib/backbone-1.1.2.min.js", "contents": []}, {"name": "js/src/underscore-1.6.0.js", "contents": []}, {"name": "js/src/all-site.js", "contents": []}, {"name": "js/lib/require.min.js", "contents": []}, {"name": "js/src/modernizr.js", "contents": []}, {"name": "js/lib/backbone-1.min.js", "contents": []}, {"name": "js/lib/fastclick.min.js", "contents": []}, {"name": "js/src/gridset-overlay.js", "contents": []}, {"name": "js/src/require.js", "contents": []}, {"name": "js/lib/modernizr.min.js", "contents": []}, {"name": "js/lib/jquery-2.1.1.min.js", "contents": []}, {"name": "js/app/general.js", "contents": []}, {"name": "js/src/respond.proxy.js", "contents": []}, {"name": "js/lib/modernizr-custom.js", "contents": []}, {"name": "js/src/backbone-1.1.2.js", "contents": []}, {"name": "js/lib/gridset-overlay.min.js", "contents": []}, {"name": "js/lib/jquery-1.7.1.min.js", "contents": []}, {"name": "js/ResponsiveSlides.js", "contents": []}, {"name": "js/src/jquery-2.1.1.js", "contents": []}, {"name": "js/src/html5shiv-printshiv.js", "contents": []}, {"name": "js/src/all-site/googleAnalytics.js", "contents": []}, {"name": "js/src/all-site/gridset-overlay.js", "contents": []}, {"name": "js/lib/respond.proxy.min.js", "contents": []}, {"name": "js/lib/underscore-1.6.0.min.js", "contents": []}, {"name": "js/lib/html5shiv-printshiv.min.js", "contents": []}, {"name": "js/src/all-site/ucl.js", "contents": []}]}, {"name": "*.png", "contents": [{"name": "images/mob-nav.png", "contents": []}, {"name": "images/close.png", "contents": []}, {"name": "favicon-152.png", "contents": []}, {"name": "favicon-144.png", "contents": []}, {"name": "images/ucl-logo.png", "contents": []}]}, {"name": "*.gif", "contents": [{"name": "images/respond.proxy.gif", "contents": []}]}, {"name": "*.svg", "contents": [{"name": "images/ucl-logo.svg", "contents": []}]}, {"name": "*.jpg", "contents": [{"name": "images/ucl-portico.jpg", "contents": []}, {"name": "images/cells.jpg", "contents": []}]}, {"name": "*.ico", "contents": [{"name": "favicon.ico", "contents": []}, {"name": "images/favicon.ico", "contents": []}]}, {"name": "*.scss", "contents": [{"name": "sass/print.scss", "contents": []}, {"name": "sass/partials/_typography.scss", "contents": []}, {"name": "sass/partials/_reset.scss", "contents": []}, {"name": "sass/partials/_layout.scss", "contents": []}, {"name": "sass/ie.scss", "contents": []}, {"name": "sass/partials/_gridset.scss", "contents": []}, {"name": "sass/mixins/_media-query.scss", "contents": []}, {"name": "sass/partials/_blog.scss", "contents": []}, {"name": "sass/partials/_forms.scss", "contents": []}, {"name": "sass/partials/_carousel.scss", "contents": []}, {"name": "sass/partials/_globalmasthead.scss", "contents": []}, {"name": "sass/jdibrief.scss", "contents": []}, {"name": "sass/partials/_search.scss", "contents": []}, {"name": "sass/venue.scss", "contents": []}, {"name": "sass/partials/_elements.scss", "contents": []}, {"name": "sass/screen.scss", "contents": []}, {"name": "sass/designlang.scss", "contents": []}, {"name": "sass/daylab.scss", "contents": []}, {"name": "sass/partials/_colors.scss", "contents": []}]}]}, {"name": "subfolder/index.md|yamlargs|jinja|pandoc|h", "contents": []}, {"name": "index.md|yamlargs|jinja|pandoc|h", "contents": []}, {"name": "_README.md|yamlargs|jinja|pandoc|h", "contents": []}]}]}]};

function visit(parent, visitFn, childrenFn)
{
    if (!parent) return;

    visitFn(parent);

    var children = childrenFn(parent);
    if (children) {
        var count = children.length;
        for (var i = 0; i < count; i++) {
            visit(children[i], visitFn, childrenFn);
        }
    }
}

function buildTree(containerName, customOptions)
{
    // build the options object
    var options = $.extend({
        nodeRadius: 5, fontSize: 12
    }, customOptions);

    
    // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;
    visit(treeData, function(d)
    {
        totalNodes++;
        maxLabelLength = Math.max(d.name.length, maxLabelLength);
    }, function(d)
    {
        return d.contents && d.contents.length > 0 ? d.contents : null;
    });

    // size of the diagram
    var size = { width:$(containerName).outerWidth(), height: totalNodes * 15};

    var tree = d3.layout.tree()
        .sort(null)
        .size([size.height, size.width - maxLabelLength*options.fontSize])
        .children(function(d)
        {
            return (!d.contents || d.contents.length === 0) ? null : d.contents;
        });

    var nodes = tree.nodes(treeData);
    var links = tree.links(nodes);

    
    /*
        <svg>
            <g class="container" />
        </svg>
     */
    var layoutRoot = d3.select(containerName)
        .append("svg:svg").attr("width", size.width).attr("height", size.height)
        .append("svg:g")
        .attr("class", "container")
        .attr("transform", "translate(" + maxLabelLength + ",0)");


    // Edges between nodes as a <path class="link" />
    var link = d3.svg.diagonal()
        .projection(function(d)
        {
            return [d.y, d.x];
        });

    layoutRoot.selectAll("path.link")
        .data(links)
        .enter()
        .append("svg:path")
        .attr("class", "link")
        .attr("d", link);


    /*
        Nodes as
        <g class="node">
            <circle class="node-dot" />
            <text />
        </g>
     */
    var nodeGroup = layoutRoot.selectAll("g.node")
        .data(nodes)
        .enter()
        .append("svg:g")
        .attr("class", "node")
        .attr("transform", function(d)
        {
            return "translate(" + d.y + "," + d.x + ")";
        });

    nodeGroup.append("svg:circle")
        .attr("class", "node-dot")
        .attr("r", options.nodeRadius);

    nodeGroup.append("svg:text")
        .attr("text-anchor", function(d)
        {
            return d.children ? "end" : "start";
        })
        .attr("dx", function(d)
        {
            var gap = 2 * options.nodeRadius;
            return d.children ? -gap : gap;
        })
        .attr("dy", 3)
        .text(function(d)
        {
            return d.name;
        });

}