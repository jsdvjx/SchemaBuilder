import { gettype } from "../common/Utility";
class Tree{
    constructor(object) {
        this.object = JSON.parse(JSON.stringify(object));
        this.node = this.resolve(this.object);
        this.map={};
        this.buildLinkParent(this.node);
        this.buildPath(this.node);
        this.buildLink();
        //console.log(this.map);
    }
    static findNode=(node,path)=>{
        if(node.path==path)return node;
        else{
            if(node.children){
                for (let index = 0; index < node.children.length; index++) {
                    const child = node.children[index];
                    const ret= Tree.findNode(child,path);
                    if(ret)return ret;
                }
            }
            return false;
        }
    }
    resolve=(node,key='ROOT')=>{
        let type = gettype(node),children=[],value=node;
        if(type=='array'){
            children= node.map((child,idx)=>{
                return this.resolve(child,idx);
            })
        }else if(type=='object'){
            children= Object.keys(node).map((key)=>{
                return this.resolve(node[key],key);
            })
        }else{
            return children.length > 0 ? { type, children, key, value } : { type, key, value };
        }
        return children.length>0?{type,children,key,value}:{type,key,value};
    }
    buildLinkParent = (node, parent = null) => {
        node.parent = parent;
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                this.buildLinkParent(child, node);
            });
        }
    }
    buildLink = () => {
        Object.keys(this.map).reduce((last,curr)=>{
            this.map[last].next=this.map[curr]
            this.map[curr].last = this.map[last];
            return curr;
        })
    }
    buildPath=(node)=>{
        node.path=this._path(node);
        this.map[node.path]=node;
        if (node.children&&node.children.length > 0) {
            node.children.forEach(child => {
                this.buildPath(child);
            });
        }
    }
    _path=(node)=>{
        let pos = [], p = node;
        while (p != null) {
            pos.push({ name: p.key, type: p.type, parent_type: p.parent != null ? p.parent.type : 'object' });
            p = p.parent;
        }
        return pos.reverse().map((_p) => {
            switch (_p.parent_type) {
                case 'object':
                    if (_p.name == 'ROOT') return 'ROOT';
                    return `.${_p.name}`;
                case 'array':
                    return `[${_p.name}]`;
                default:
                    return _p.name;
            }
        }).join('');
    }
}
export default Tree;