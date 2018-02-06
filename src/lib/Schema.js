import schema from '../common/schema.json'

class Schema {
    _schema = "http://json-schema.org/draft-06/schema#";
    constructor(Tree, id) {
        this.instance = {
            $schema: this._schema,
            $id: `id`,
            definitions:{},
            type:Tree.type||'object'
        };
        this.tree = Tree;
        this.buildProps(this.instance, Tree);
        this._schemaJSON = schema;
    }
    generate = (Tree) => {

    }
    buildProps = (node, tree) => {
        if (tree.children) {
            for (let i = 0; i < tree.children.length; i++) {
                let child = tree.children[i];
                if (child.parent.type == 'array' && i > 0) {
                    break;
                }
                node.properties = node.properties == undefined ? {} : node.properties;
                let type = child.type, value = type == 'array' ? child.value[0] : child.value;
                let props = {
                    type,
                    examples: [value],
                };
                let _node;
                if(child.parent.type=='array'){
                    _node= node.items=props;
                }else{
                    _node= node.properties[child.key]=props;
                }
                this.buildProps(_node, child);
            }
        }
    }
}
export default Schema