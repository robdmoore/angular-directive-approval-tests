// http://stackoverflow.com/a/14496573/1445713
function heredoc(f) {
    return f.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1];
}
