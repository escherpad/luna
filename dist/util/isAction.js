"use strict";
/** Created by ge on 12/27/16. */
function isAction(obj) {
    return (!!obj && !!obj.type);
}
exports.isAction = isAction;
