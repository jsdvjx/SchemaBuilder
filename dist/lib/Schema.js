'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _schema = require('../common/schema.json');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Schema = function Schema(Tree, id) {
    var _this = this;

    _classCallCheck(this, Schema);

    this._schema = "http://json-schema.org/draft-06/schema#";

    this.generate = function (Tree) {};

    this.buildProps = function (node, tree) {
        if (tree.children) {
            for (var i = 0; i < tree.children.length; i++) {
                var child = tree.children[i];
                if (child.parent.type == 'array' && i > 0) {
                    break;
                }
                node.properties = node.properties == undefined ? {} : node.properties;
                var type = child.type,
                    value = type == 'array' ? child.value[0] : child.value;
                var props = {
                    type: type,
                    examples: [value]
                };
                var _node = void 0;
                if (child.parent.type == 'array') {
                    _node = node.items = props;
                } else {
                    _node = node.properties[child.key] = props;
                }
                _this.buildProps(_node, child);
            }
        }
    };

    this.instance = {
        $schema: this._schema,
        $id: 'id',
        definitions: {},
        type: Tree.type || 'object'
    };
    this.tree = Tree;
    this.buildProps(this.instance, Tree);
    this._schemaJSON = _schema2.default;
};

exports.default = Schema;