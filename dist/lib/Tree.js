'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _class, _temp;

var _Utility = require('../common/Utility');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tree = (_temp = _class = function Tree(object) {
    var _this = this;

    _classCallCheck(this, Tree);

    this.resolve = function (node) {
        var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ROOT';

        var type = (0, _Utility.gettype)(node),
            children = [],
            value = node;
        if (type == 'array') {
            children = node.map(function (child, idx) {
                return _this.resolve(child, idx);
            });
        } else if (type == 'object') {
            children = Object.keys(node).map(function (key) {
                return _this.resolve(node[key], key);
            });
        } else {
            return children.length > 0 ? { type: type, children: children, key: key, value: value } : { type: type, key: key, value: value };
        }
        return children.length > 0 ? { type: type, children: children, key: key, value: value } : { type: type, key: key, value: value };
    };

    this.buildLinkParent = function (node) {
        var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        node.parent = parent;
        if (node.children && node.children.length > 0) {
            node.children.forEach(function (child) {
                _this.buildLinkParent(child, node);
            });
        }
    };

    this.buildLink = function () {
        Object.keys(_this.map).reduce(function (last, curr) {
            _this.map[last].next = _this.map[curr];
            _this.map[curr].last = _this.map[last];
            return curr;
        });
    };

    this.buildPath = function (node) {
        node.path = _this._path(node);
        _this.map[node.path] = node;
        if (node.children && node.children.length > 0) {
            node.children.forEach(function (child) {
                _this.buildPath(child);
            });
        }
    };

    this._path = function (node) {
        var pos = [],
            p = node;
        while (p != null) {
            pos.push({ name: p.key, type: p.type, parent_type: p.parent != null ? p.parent.type : 'object' });
            p = p.parent;
        }
        return pos.reverse().map(function (_p) {
            switch (_p.parent_type) {
                case 'object':
                    if (_p.name == 'ROOT') return 'ROOT';
                    return '.' + _p.name;
                case 'array':
                    return '[' + _p.name + ']';
                default:
                    return _p.name;
            }
        }).join('');
    };

    this.object = JSON.parse(JSON.stringify(object));
    this.node = this.resolve(this.object);
    this.map = {};
    this.buildLinkParent(this.node);
    this.buildPath(this.node);
    this.buildLink();
}, _class.findNode = function (node, path) {
    if (node.path == path) return node;else {
        if (node.children) {
            for (var index = 0; index < node.children.length; index++) {
                var child = node.children[index];
                var ret = Tree.findNode(child, path);
                if (ret) return ret;
            }
        }
        return false;
    }
}, _temp);
exports.default = Tree;