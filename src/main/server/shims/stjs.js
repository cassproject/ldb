
if (!String.prototype.startsWith) {
    String.prototype.startsWith=function(start, from) {
        let f = from != null ? from : 0;
        return this.substring(f, f + start.length) == start;
    };
}
